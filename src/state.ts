// Centralized mutable simulation state.
//
// This singleton lives inside the simulation worker. Nothing here may reference
// the DOM, canvases, or input devices; the main thread keeps its own view state
// (camera, mouse, display mode) and only sees this through frame snapshots.

import { POPCAP, TILENUMBER, SCORESCAP } from './constants';
import type { Tile } from './entities/Tile';
import type { Amoeba } from './entities/Amoeba';

// Simulation statistics
export interface SimulationStats {
  time: number;
  livePop: number;
  netParents: number;
  aveChildren: number;
  avePosNRG: number;
  maxAveChildren: number;
  maxAvePosNRG: number;
  redAgarOnMap: number;
  greenAgarOnMap: number;
  blueAgarOnMap: number;
  advWeight: number,
  disWeight: number,
  mitoses: number;
  netEatenRatio: number;
}

// History arrays for charts
export interface StatsHistory {
  aveChildren: number[];
  avePosNRG: number[];
}

// Global state singleton
class State {
  // Entity arrays - pre-allocated for performance
  tiles: Tile[] = new Array(TILENUMBER);
  amoebs: Amoeba[] = new Array(POPCAP);
  graveyard: Amoeba[] = [];

  // Index tracking
  HIGHESTINDEX: number = -1;
  TILE_REGEN_RATE:number = 0.05;
  // Medal holders (top performers)
  gold: number | null = null;
  silver: number | null = null;
  bronze: number | null = null;

  // Selection state. Lives here (not on the main thread) because death remaps
  // a live index to a graveyard index, and only the simulation knows when.
  highlighted: number | null = null;
  newest: number | null = null;

  // Simulation statistics
  stats: SimulationStats = {
    time: 0,
    livePop: 0,
    netParents: 0,
    aveChildren: 0,
    avePosNRG: 0,
    maxAveChildren: 1,
    maxAvePosNRG: 1,
    redAgarOnMap: 0,
    greenAgarOnMap: 0,
    blueAgarOnMap: 0,
    advWeight: 0,
    disWeight: 0,
    mitoses: 0,
    netEatenRatio: 0,
  };

  // History for charts
  history: StatsHistory = {
    aveChildren: [],
    avePosNRG: [],
  };

  // Scores array (for tracking top performers)
  scores: (Amoeba | null)[] = new Array(SCORESCAP);

  /**
   * Reset all statistics for new simulation
   */
  resetStats(): void {
    this.stats.time = 0;
    this.stats.aveChildren = 0;
    this.stats.avePosNRG = 0;
    this.stats.maxAveChildren = 1;
    this.stats.maxAvePosNRG = 1;
    this.stats.livePop = 0;
    this.HIGHESTINDEX = 0;

    // Recalculate live population
    for (let i = 0; i < this.amoebs.length; i++) {
      const a = this.amoebs[i];
      if (a != null && a.status === 'alive') {
        this.stats.livePop++;
        this.HIGHESTINDEX = i;
      }
    }

    this.history.aveChildren = [];
    this.history.avePosNRG = [];
  }
}

// Export singleton instance
export const state = new State();
