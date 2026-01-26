// TileSystem - Handles tile generation and updates

import { FIELDX, FIELDY, TILENUMBER } from '../constants';
import { state } from '../state';
import { Tile } from '../entities/Tile';

export const tileSystem = {
  /**
   * Generate all tiles with smoothed terrain
   */
  generate(): void {
    const neighbors: number[] = [];
    let pos = 0;

    for (let i = 0; i < FIELDY; i += 25) {
      for (let j = 0; j < FIELDX; j += 25) {
        // Determine neighbors based on position
        if (pos >= 40) neighbors.push(pos - 40);    // not top
        if (pos < 1560) neighbors.push(pos + 40);   // not bottom
        if (pos % 40 !== 0) neighbors.push(pos - 1); // not left
        if ((pos + 1) % 40 !== 0) neighbors.push(pos + 1); // not right

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

    // Clear borders using untransformed coordinates
    // Save current transform, reset to identity, clear, then restore
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    for (let i = 0; i < TILENUMBER; i++) {
      state.tiles[i].draw(
        ctx,
        state.mouse.overMap,
        state.mouse.x,
        state.mouse.y,
        state.mouse.leftPressed
      );

      if (!state.pause) {
        state.tiles[i].regenerate();
      }
    }
  },
};
