// Core type definitions for Petri simulation

export interface NeuronData {
  weights1: Float32Array;
  weights2: Float32Array;
  in: number;
  out: number;
}

export interface SensorData {
  x: number;
  y: number;
  tile: number | null;
  r: number;
  g: number;
  b: number;
  s: number;
  sees: number;
}

export interface TileData {
  x: number;
  y: number;
  num: number;
  neighbors: number[];
  R: number;
  G: number;
  B: number;
  RCap: number;
  GCap: number;
  BCap: number;
  regenRate: number;
}

export interface AmoebData {
  index: number;
  grave?: number;
  x: number;
  y: number;
  alive: boolean;
  tile: number | null;
  size: number;
  health: number;
  gen: number;
  parent: number | null;
  sibling_idx: number | null;
  children: number[];
  descendants: number;
  proGenes: number;
  conGenes: number;
  name: string;
  velocity: number;
  rotation: number;
  direction: number;
  energy: number;
  maxEnergy: number;
  energyChange: number;
  totalEnergyGain: number;
  damage: number;
  damageReceived: number;
  damageCaused: number;
  eaten: number;
  redEaten: number;
  greenEaten: number;
  blueEaten: number;
  netEaten: number;
}

// Amoeb index: positive = alive in amoebs[], negative = in graveyard
// graveyard index = -(amoebIndex + 1)
export type AmoebIndex = number;

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  pointRadius: number;
  lineTension: number;
  fill: boolean;
  yAxisID: string;
}

export interface WeightDeltas {
  in_weights1_deltas: number[][];
  in_weights2_deltas: number[][];
  out_weights1_deltas: number[][];
  out_weights2_deltas: number[][];
  in_sigmas1_deltas: number[][];
  in_sigmas2_deltas: number[][];
  out_sigmas1_deltas: number[][];
  out_sigmas2_deltas: number[][];
}

// Canvas rendering context type
export type RenderContext = CanvasRenderingContext2D;
