// AmoebSystem - Handles amoeb updates and interactions

import { state } from '../state';

// Cached DOM elements
let dashGold: HTMLElement | null = null;
let dashSilver: HTMLElement | null = null;
let dashBronze: HTMLElement | null = null;
let dashStats: HTMLElement | null = null;
let dashHighlighted: HTMLElement | null = null;

/**
 * Initialize cached DOM elements
 */
export function initAmoebSystemDom(): void {
  dashGold = document.getElementById('dash-gold');
  dashSilver = document.getElementById('dash-silver');
  dashBronze = document.getElementById('dash-bronze');
  dashStats = document.getElementById('amoeb-stats');
  dashHighlighted = document.getElementById('dash-highlighted');
}

export const amoebSystem = {
  /**
   * Update all amoebs - process AI, movement, interactions, and rendering
   */
  update(): void {

    const amoebs = state.amoebs;                                                                                                                   
    // const tiles = state.tiles;                                                                                                                       
    const highest = state.HIGHESTINDEX; 

    if (!state.pause) {
      state.gold = null;
      state.silver = null;
      state.bronze = null;

      // First pass: decay, move, sense, find top performers
      for (let i = 0; i <= highest; i++) {
        const a = amoebs[i];
        if (a.alive) {
          a.decay();
          if (a.alive) {
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
        }
      }

      // Update medal displays
      if (state.gold !== null && dashGold) {
        const g = amoebs[state.gold];
        dashGold.innerHTML = g.name + '-' + g.gen + 'A' + g.descendants;
      }
      if (state.silver !== null && dashSilver) {
        const s = amoebs[state.silver];
        dashSilver.innerHTML = s.name + '-' + s.gen + 'A' + s.descendants;
      }
      if (state.bronze !== null && dashBronze) {
        const b = amoebs[state.bronze];
        dashBronze.innerHTML = b.name + '-' + b.gen + 'A' + b.descendants;
      }
    }

    // Second pass: draw, think, eat, grow
    for (let i = 0; i <= highest; i++) {
      const a = amoebs[i];
      if (a.alive) {
        a.draw(a.cols);

        if (!state.pause) {
          a.think();
          a.eat();
          a.grow();
        }

        // Handle mouse selection
        if (state.mouse.leftPressed && state.mouse.overMap) {
          const mouseX = state.mouse.x;
          const mouseY = state.mouse.y;

          if (Math.abs(a.x - mouseX) <= a.size + 1 && Math.abs(a.y - mouseY) <= a.size + 1) {

            if (state.highlighted !== i) {
              state.highlighted = i;
              // If tracking was on, switch to tracking the new amoeb
              if (state.tracking !== null) {
                state.tracking = i;
              }
              console.log(amoebs[i]);

              if (dashStats) dashStats.style.display = 'block';
              if (dashHighlighted) {
                dashHighlighted.innerHTML =
                  'HIGHLIGHTED: ' +
                  amoebs[state.highlighted].name +
                  '-' +
                  amoebs[state.highlighted].gen +
                  'A' +
                  amoebs[state.highlighted].descendants;
              }
              state.mouse.leftPressed = false;
            }
          }
        }
      }
    }

    // If click was on canvas but not on any amoeb, stop tracking
    if (state.mouse.leftPressed && state.mouse.overMap && state.tracking !== null) {
      state.tracking = null;
      state.mouse.leftPressed = false;
    }
  },
};
