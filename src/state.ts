// Centralized mutable state for Petri simulation

import { POPCAP, TILENUMBER, SCORESCAP } from './constants';
import type { Tile } from './entities/Tile';
import type { Amoeba } from './entities/Amoeba';

// Canvas contexts
export interface CanvasContexts {
  map: CanvasRenderingContext2D | null;
  stats: CanvasRenderingContext2D | null;
}

// Mouse state
export interface MouseState {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  prevX: number;
  prevY: number;
  overMap: boolean;
  overConsole: boolean;
  leftPressed: boolean;
  rightPressed: boolean;
}

// Canvas state
export interface CanvasState {
  scale: number;
  dragOffsetX: number;
  dragOffsetY: number;
  dragging: boolean;
}

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

// Neuron weights display state
export interface NeuronWeightsState {
  amoebIndex: number | null;
  neuronType: 'input' | 'output' | null;
  neuronIndex: number | null;
  lastParentDescendants: number;
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

  // Selection state
  highlighted: number | null = null;
  following: number | null = null;
  newest: number | null = null;
  tracking: number | null = null;

  // Display mode
  display: 'brain' | 'default' | 'family' = 'default';
  scoreType: number = 0;

  // Simulation control
  pause: boolean = false;
  accelerate: number = 0;

  // Canvas contexts
  ctx: CanvasContexts = {
    map: null,
    stats: null,
  };

  // Mouse state
  mouse: MouseState = {
    x: 0,
    y: 0,
    originalX: 0,
    originalY: 0,
    prevX: 0,
    prevY: 0,
    overMap: false,
    overConsole: false,
    leftPressed: false,
    rightPressed: false,
  };

  // Canvas state
  canvas: CanvasState = {
    scale: 1,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragging: false,
  };

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

  // Keyboard state
  keysPressed: Record<string, boolean> = {};
  leftAccel: number = 0;
  rightAccel: number = 0;
  upAccel: number = 0;
  downAccel: number = 0;

  // Animation
  requestId: number = 0;

  // Scores array (for tracking top performers)
  scores: (Amoeba | null)[] = new Array(SCORESCAP);

  // Neuron weights display tracking
  neuronWeights: NeuronWeightsState = {
    amoebIndex: null,
    neuronType: null,
    neuronIndex: null,
    lastParentDescendants: -1,
  };

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
