// Dashboard - Handles UI updates and highlighted animal display

import { state } from '../state';

// Cached DOM elements
let dashNewest: HTMLElement | null = null;
let dashTime: HTMLElement | null = null;

/**
 * Initialize cached DOM elements
 */
export function initDashboardDom(): void {
  dashNewest = document.getElementById('dash-newest');
  dashTime = document.getElementById('dash-time');
}

export const dashboard = {
  /**
   * Setup dashboard (called on init and reset)
   */
  setup(): void {
    // Currently empty but preserved for future setup logic
  },

  /**
   * Update dashboard display each frame
   */
  update(): void {
    // Update newest creature display
    if (state.newest !== null && dashNewest) {
      if (state.newest < 0) {
        const n = state.graveyard[-(state.newest + 1)];
        dashNewest.innerHTML = 'NEW: ' + n.name + '-' + n.gen + 'D' + n.children.length;
      } else {
        const n = state.amoebs[state.newest];
        dashNewest.innerHTML = 'NEW: ' + n.name + '-' + n.gen + 'A' + n.children.length;
      }
    }

    // Update time display
    if (dashTime) {
      dashTime.innerHTML = 'TIME: ' + state.stats.time;
    }

    // Update highlighted creature display
    if (state.highlighted !== null) {
      if (state.highlighted < 0) {
        state.graveyard[-(state.highlighted + 1)].highlight();
      } else {
        state.amoebs[state.highlighted].highlight();
      }
    }
  },
};
