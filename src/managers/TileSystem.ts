// TileSystem - Tile generation and regeneration (simulation side, no rendering)

import { FIELDX, FIELDY, TILENUMBER, TILE_SIZE, GRID_W } from '../constants';
import { state } from '../state';
import { Tile } from '../entities/Tile';

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
   * Regenerate food on every tile (one simulation tick)
   */
  regenerate(): void {
    for (let i = 0; i < TILENUMBER; i++) {
      state.tiles[i].regenerate();
    }
  },
};
