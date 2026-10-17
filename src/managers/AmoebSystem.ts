// AmoebSystem - Advances every amoeba by one tick (simulation side, no rendering)

import { TILENUMBER } from '../constants';
import { state } from '../state';

export const amoebSystem = {
  /**
   * Update all amoebs - AI, movement, interactions, reproduction
   */
  update(): void {
    const amoebs = state.amoebs;
    const highest = state.HIGHESTINDEX;

    state.gold = null;
    state.silver = null;
    state.bronze = null;

    // First pass: age/decay, move, sense, find top performers
    for (let i = 0; i <= highest; i++) {
      const a = amoebs[i];
      if (!a) continue;
      if (a.status === 'alive') {
        a.metabolize();
        if (a.status === 'alive') {
          a.move();
          a.currDamage = 0; // important: do BEFORE eat(), AFTER move() (affects move/rotation speed, caused by attack from other creatures)
          a.sense();

          // Track medal holders
          if (state.gold === null || a.descendants > amoebs[state.gold].descendants) {
            state.gold = i;
          } else if (state.silver === null || a.descendants > amoebs[state.silver].descendants) {
            state.silver = i;
          } else if (state.bronze === null || a.descendants > amoebs[state.bronze].descendants) {
            state.bronze = i;
          }
        }
      } else if (a.status === 'decaying') {
        a.decay();
      }
    }

    // Second pass: think, eat, grow
    for (let i = 0; i <= highest; i++) {
      const a = amoebs[i];
      if (a && a.status === 'alive') {
        a.think();
        a.eat();
        a.grow();
      }
    }

    // Commit tile deltas accumulated during eat(), then reset
    for (let i = 0; i < TILENUMBER; i++) {
      const t = state.tiles[i];
      t.R = Math.max(t.R + t.rDelta, -t.RCap);
      t.G = Math.max(t.G + t.gDelta, -t.GCap);
      t.B = Math.max(t.B + t.bDelta, -t.BCap);
      t.rDelta = 0;
      t.gDelta = 0;
      t.bDelta = 0;
    }
  },
};
