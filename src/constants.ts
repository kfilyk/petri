// Global constants for Petri simulation

// Amoeb configuration
export const START_SIZE = 1;
export const MAX_SIZE = 20;
export const BRAIN_SIZE = 50;
export const NUM_INPUT_NEURONS = 32;
export const NUM_OUTPUT_NEURONS = 35;
export const EATING_CONSTANT = 2;

// World configuration
export const FIELDX = 1200;
export const FIELDY = 1200;
export const TILE_SIZE = 25;
export const TILENUMBER = (FIELDX / TILE_SIZE) * (FIELDY / TILE_SIZE); 

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
