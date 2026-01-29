// TileSystem - Handles tile generation and updates

import { FIELDX, FIELDY, TILENUMBER, TILE_SIZE } from '../constants';
import { state } from '../state';
import { Tile } from '../entities/Tile';
import { round } from '../utils/math';

// Offscreen tile buffer (1 pixel per tile, scaled up on draw)
export const GRID_W = FIELDX / TILE_SIZE;
export const GRID_H = FIELDY / TILE_SIZE;
export const GRID_TILES = GRID_W*GRID_H;

const tileCanvas = document.createElement('canvas');
tileCanvas.width = GRID_W;
tileCanvas.height = GRID_H;
const tileCtx = tileCanvas.getContext('2d')!;
const tileImageData = tileCtx.createImageData(GRID_W, GRID_H);
const tileBuf = tileImageData.data; // Uint8ClampedArray, length = GRID_W * GRID_H * 4

export const tileSystem = {
  /**
   * Generate all tiles with smoothed terrain
   */
  generate(): void {
    const neighbors: number[] = [];
    let pos = 0;

    for (let i = 0; i < FIELDY; i += TILE_SIZE) {
      for (let j = 0; j < FIELDX; j += TILE_SIZE) {
        // Determine neighbors based on position
        if (pos >= GRID_W) neighbors.push(pos - GRID_W);                // not top
        if (pos < TILENUMBER - GRID_W) neighbors.push(pos + GRID_W);   // not bottom
        if (pos % GRID_W !== 0) neighbors.push(pos - 1);               // not left
        if ((pos + 1) % GRID_W !== 0) neighbors.push(pos + 1);         // not right

        state.tiles[pos] = new Tile(j, i, pos, [...neighbors]);
        pos++;
        neighbors.length = 0;
      }
    }

    // Smoothing iterations
    const standardRangeR = 100;
    const standardRangeG = 100;
    const standardRangeB = 75;
    const standardMinR = 50;
    const standardMinG = 100;
    const standardMinB = 25;

    for (let iter = 0; iter < 8; iter++) {
      let minR = 255, minG = 255, minB = 255;
      let maxR = 0, maxG = 0, maxB = 0;

      // Average with neighbors
      for (let i = 0; i < pos; i++) {
        const t = state.tiles[i];
        let aveRedAgar = t.RCap;
        let aveGreenAgar = t.GCap;
        let aveBlueAgar = t.BCap;

        for (let n = 0; n < t.neighbors.length; n++) {
          aveRedAgar += state.tiles[t.neighbors[n]].RCap;
          aveGreenAgar += state.tiles[t.neighbors[n]].GCap;
          aveBlueAgar += state.tiles[t.neighbors[n]].BCap;
        }

        t.RCap = aveRedAgar / (t.neighbors.length + 1);
        t.GCap = aveGreenAgar / (t.neighbors.length + 1);
        t.BCap = aveBlueAgar / (t.neighbors.length + 1);
        t.R = t.RCap;
        t.G = t.GCap;
        t.B = t.BCap;

        // Track mins/maxes
        if (t.RCap < minR) minR = t.RCap;
        if (t.GCap < minG) minG = t.GCap;
        if (t.BCap < minB) minB = t.BCap;
        if (t.RCap > maxR) maxR = t.RCap;
        if (t.GCap > maxG) maxG = t.GCap;
        if (t.BCap > maxB) maxB = t.BCap;
      }

      // Standardize to bounds
      const rangeR = maxR - minR;
      const rangeG = maxG - minG;
      const rangeB = maxB - minB;

      const RMult = standardRangeR / rangeR;
      const GMult = standardRangeG / rangeG;
      const BMult = standardRangeB / rangeB;

      for (let i = 0; i < pos; i++) {
        const t = state.tiles[i];
        t.RCap = (t.RCap - minR) * RMult + standardMinR;
        t.GCap = (t.GCap - minG) * GMult + standardMinG;
        t.BCap = (t.BCap - minB) * BMult + standardMinB;
        t.R = t.RCap;
        t.G = t.GCap;
        t.B = t.BCap;
      }
    }
  },

  /**
   * Update all tiles - draw and regenerate
   */
  update(): void {
    const ctx = state.ctx.map;
    if (!ctx) return;

    // Clear canvas using untransformed coordinates
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    // Write tile colors into the ImageData buffer (1 pixel per tile)
    for (let i = 0; i < TILENUMBER; i++) {
      const t = state.tiles[i];
      const off = i * 4;
      // const cap = t.RCap + t.GCap + t.BCap;

      tileBuf[off]     = t.R < 255 ? (t.R > 48 ? t.R : 48) : 255;
      tileBuf[off + 1] = t.G < 255 ? (t.G > 48 ? t.G : 48) : 255;
      tileBuf[off + 2] = t.B < 255 ? (t.B > 48 ? t.B : 48) : 255;
      tileBuf[off + 3] = 255; // transparent when depleted

      if (!state.pause) {
        t.regenerate();
      }
    }

    // Blit the 40×40 buffer to the offscreen canvas, then scale up
    tileCtx.putImageData(tileImageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tileCanvas, 0, 0, FIELDX, FIELDY);

    // Hover overlay (only for the one tile under the mouse)
    if (state.mouse.overMap) {
      const tx = Math.floor(state.mouse.x / TILE_SIZE);
      const ty = Math.floor(state.mouse.y / TILE_SIZE);
      const ti = ty * GRID_W + tx;
      if (ti >= 0 && ti < TILENUMBER) {
        const t = state.tiles[ti];
        const rDark = t.R - 32;
        const gDark = t.G - 32;
        const bDark = t.B - 32;
        ctx.fillStyle = `rgb(${rDark},${gDark},${bDark})`;

        if (!state.mouse.leftPressed) {
          ctx.fillText(t.num.toString(), t.x, t.y + 25);
        } else if (state.mouse.x > t.x && state.mouse.x < t.x + TILE_SIZE && state.mouse.y > t.y && state.mouse.y < t.y + TILE_SIZE) {
          ctx.fillText(round(t.R).toString(), t.x, t.y + 8);
          ctx.fillText(round(t.G).toString(), t.x, t.y + 16);
          ctx.fillText(round(t.B).toString(), t.x, t.y + 25);
        }
      }
    }
  },
};
