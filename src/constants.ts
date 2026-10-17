// Global constants for Petri simulation

// Amoeba configuration
export const MIN_SIZE = 1;
export const MAX_SIZE = 20;
export const MAX_EYE_DISTANCE = 50;
export const MAX_MOUTH_DISTANCE = 25;
export const NUM_INPUT_NEURONS = 33; // 32 original + 1 energy ratio
export const NUM_OUTPUT_NEURONS = 42;
export const FAN_IN = NUM_INPUT_NEURONS + NUM_OUTPUT_NEURONS;  // sources per output neuron
//export const MUTATION_RATE = 0.01; // Per-synapse noise/erosion scale applied at mitosis
export const MUTATION_RATE = 0.01; // Per-synapse noise/erosion scale applied at mitosis

// Erosion rate at which an unselected weight settles to std 1/sqrt(FAN_IN),
// so a neutral neuron's pre-activation sits at the clamp edge (|sum| ~ 1).
// Derived from the OU equilibrium: std² = MUTATION_RATE² / (6 · EROSION_RATE).
export const EROSION_RATE = (MUTATION_RATE ** 2) * FAN_IN / 6;
export const HUSK_DECAY_RATE = 0.1;
export const HUSK_ENERGY_FACTOR = 1000;

// World configuration
export const FIELDX = 1600;
export const FIELDY = 1600;
export const TILE_SIZE = 25;
export const GRID_W = FIELDX / TILE_SIZE;
export const GRID_H = FIELDY / TILE_SIZE;
export const GRID_TILES = GRID_W * GRID_H;
export const TILENUMBER = GRID_TILES;

// Simulation clock: ticks per second the worker aims for (0 = as fast as possible)
export const DEFAULT_TPS = 0;

// Population configuration
export const POPCAP = 1000;
export const SCORESCAP = 3;
export const MUTCAP = 10;

// Dashboard configuration
export const BRAINX = 1200;
export const BRAINY = 2000;

// Math constants (pre-computed for performance)
export const TWOPI = Math.PI * 2;
export const DEG_TO_RAD = 0.0174533;

// Alphabet for random name generation
export const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
