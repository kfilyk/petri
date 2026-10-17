// =============================================================================
// protocol.ts — the contract between the simulation worker and the main thread
// =============================================================================
//
// WHY THIS FILE EXISTS
// --------------------
// Petri runs on two threads:
//
//   * The MAIN THREAD is the normal browser page: it owns the DOM, the canvas,
//     mouse/keyboard, the charts, the 3D brain. (src/main.ts, src/ui/*)
//   * The WORKER THREAD runs the simulation: every amoeba, every tile, every
//     tick of physics and evolution. (src/sim/worker.ts)
//
// A Web Worker is a separate JavaScript thread with its OWN memory. It cannot
// see the page's variables and the page cannot see the worker's. The ONLY way
// they communicate is by sending messages with `postMessage`. Every message is
// either:
//
//   (a) COPIED ("structured clone") — plain objects, arrays, strings, numbers.
//       Fine for small or rare things (a stats sample, a family tree, a save
//       file). Class instances lose their methods when cloned, which is one
//       reason we never send Amoeba objects across.
//
//   (b) TRANSFERRED — an ArrayBuffer whose OWNERSHIP moves to the other side
//       with zero copying. After the transfer, the sender's reference becomes
//       an empty, detached buffer. This is how the per-frame snapshot travels:
//       the worker fills a buffer, transfers it, the main thread draws from it,
//       then transfers it back so the worker can reuse it. Two buffers ping-pong
//       forever and nothing is allocated per frame.
//
// Because the frame is a raw block of numbers (a Float32Array) rather than an
// object, both sides need to agree EXACTLY on what lives at which position.
// That agreement is the "layout" below. If you add a field, add it here, bump
// the stride/length it belongs to, write it in worker.ts and read it in ui/*.
//
// This file is imported by BOTH threads. It must contain only constants, types
// and pure helper functions — nothing that touches the DOM or the simulation.

import { POPCAP, TILENUMBER, NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS } from '../constants';

// =============================================================================
// FRAME BUFFER LAYOUT
// =============================================================================
//
// One frame is a single Float32Array of FRAME_LEN numbers, divided into blocks:
//
//   [ HEADER | REFS | FOCUS | TILES | AMOEBAS | BRAIN ]
//
// Every constant below is an OFFSET (position) or a LENGTH measured in float32
// elements, not bytes. A "stride" is the number of floats one record occupies.
// Within a record, the little `X = { ... }` objects name each field's position
// relative to the start of that record, so code reads `f[off + A.SIZE]` instead
// of `f[off + 4]`.

// ─── HEADER: a few scalars about the whole simulation ───────────────────────
export const HEADER_OFF = 0;
export const HEADER_LEN = 32; // room to grow; only 16 slots are used today
export const H = {
  TIME: 0,            // simulation tick counter
  LIVE_POP: 1,        // number of living amoebas
  DEAD_COUNT: 2,      // size of the graveyard
  AMOEBA_COUNT: 3,    // how many records are in the AMOEBAS block THIS frame
  HAS_HIGHLIGHTED: 4, // 1 if an amoeba is selected (then HIGHLIGHTED is valid)
  HIGHLIGHTED: 5,     // its index: >= 0 live slot, < 0 graveyard (see getAmoebaByIndex)
  HAS_NEWEST: 6,      // 1 if NEWEST is valid
  NEWEST: 7,          // index of the most recently born amoeba
  PAUSED: 8,          // 1 while the worker is paused
  TPS_TARGET: 9,      // ticks per second the worker aims for; 0 = unlimited
  TPS_MEASURED: 10,   // ticks per second it actually achieved (shown next to FPS)
  HAS_BRAIN: 11,      // 1 if the BRAIN block was filled this frame
  HAS_FOCUS: 12,      // 1 if the FOCUS block was filled this frame
  GOLD: 13,           // live index of the medal holders, or -1 when none
  SILVER: 14,
  BRONZE: 15,
} as const;

// ─── REFS: dashboard labels for a few "named" amoebas ───────────────────────
// The header gives us indices, but the dashboard wants to print "ABCD-12A7".
// Rather than make the main thread look amoebas up (it can't — it has no
// access to them), the worker pre-packs name/gen/status/descendants for the
// five amoebas the dashboard names: highlighted, newest, gold, silver, bronze.
export const REF_OFF = HEADER_OFF + HEADER_LEN;
export const REF_STRIDE = 10;
export const REF_COUNT = 5;
export const REF = { HIGHLIGHTED: 0, NEWEST: 1, GOLD: 2, SILVER: 3, BRONZE: 4 } as const; // slot numbers
export const R = {
  VALID: 0,                               // 0 means "nothing in this slot"
  IDX: 1,
  NAME0: 2, NAME1: 3, NAME2: 4, NAME3: 5, // the 4-letter name as char codes (see nameFromCodes)
  GEN: 6,
  ALIVE: 7,                               // 1 alive, 0 dead
  DESCENDANTS: 8,
} as const;

// ─── FOCUS: everything about the HIGHLIGHTED amoeba ─────────────────────────
// The stats panel and the on-map highlight overlay need far more detail than a
// normal amoeba record carries (energy, damage, sensor hits, ...). Only one
// amoeba is highlighted at a time, so this is a single fixed block. It also
// works for a dead amoeba from the graveyard: the record is whatever the
// graveyard clone holds, i.e. the amoeba as it was at the moment of death.
export const FOCUS_OFF = REF_OFF + REF_STRIDE * REF_COUNT;
export const FOCUS_LEN = 64;
export const F = {
  IDX: 0,
  STATUS: 1,          // 0 alive, 1 decaying (husk), 2 dead (graveyard record)
  X: 2, Y: 3,
  SIZE: 4,
  DIRECTION: 5,       // degrees
  BORN: 6,            // tick of birth
  AGE: 7,
  SIBLING_IDX: 8,     // position among its parent's children, -1 = none
  ENERGY: 9,
  MAX_ENERGY: 10,
  ENERGY_CHANGE: 11,  // last tick's energy delta
  DAMAGE_RECEIVED: 12,
  DAMAGE_CAUSED: 13,
  BRAIN_WEIGHT: 14,   // sum of |weights|, computed by the worker
  MOUTH_DETECTED: 15, // index of the amoeba the mouth touches, -1 = none
  EYE_DETECTED: 16,   // same for each of the 5 eyes: slots 16..20
  OUT: 21,            // brain outputs 0..5 (velX, velY, rot, eatR, eatG, eatB): slots 21..26
  DESCENDANTS: 27,
  GEN: 28,
  HAS_PARENT: 29,
  PARENT: 30,
  NAME0: 31, NAME1: 32, NAME2: 33, NAME3: 34,
  VELOCITY_X: 35,     // sign decides which way the rotation indicator is drawn
  MOUTH_X: 36, MOUTH_Y: 37,
  EYE_XY: 38,         // 5 (x, y) pairs: slots 38..47
} as const;

// ─── TILES: food levels for every tile ──────────────────────────────────────
// Three floats per tile (R, G, B food). The renderer turns these into pixels;
// the hover overlay prints the raw numbers.
export const TILE_OFF = FOCUS_OFF + FOCUS_LEN;
export const TILE_STRIDE = 3;
export const TILE_LEN = TILENUMBER * TILE_STRIDE;

// ─── AMOEBAS: one record per amoeba that is on the map ──────────────────────
// Alive amoebas and decaying husks are written back-to-back, starting at
// AMOEBA_OFF, with no gaps; H.AMOEBA_COUNT says how many there are this frame.
// The block is sized for the population cap so it never needs to grow.
export const AMOEBA_OFF = TILE_OFF + TILE_LEN;
export const AMOEBA_STRIDE = 32;
export const AMOEBA_LEN = POPCAP * AMOEBA_STRIDE;
export const A = {
  IDX: 0,             // its slot in the worker's live array (used to send 'highlight' back)
  STATUS: 1,          // 0 alive, 1 decaying husk
  X: 2, Y: 3,
  SIZE: 4,
  DIRECTION: 5,
  OUT: 6,             // brain outputs 0..5: slots 6..11 (3..5 give the body colour)
  MOUTH_X: 12, MOUTH_Y: 13,
  EYE_XY: 14,         // 5 (x, y) pairs: slots 14..23
  GEN: 24,
  DESCENDANTS: 25,
  NAME0: 26, NAME1: 27, NAME2: 28, NAME3: 29,
  VELOCITY_X: 30,
  GRAVE: 31,          // for a husk: its graveyard index, so clicking it selects the dead record
} as const;

// ─── BRAIN: the highlighted amoeba's whole neural network ───────────────────
// Only written while the 3D brain panel is open (display mode 'brain'), because
// it's the biggest block and nobody else needs it. Layout:
//
//   ins[NUM_INPUT_NEURONS]              current activation of each input neuron
//   outs[NUM_OUTPUT_NEURONS]            current output of each output neuron
//   for each input neuron i:            weights1[NUM_OUTPUT_NEURONS], then weights2[...]
//   for each output neuron i:           weights1[NUM_OUTPUT_NEURONS], then weights2[...]
//
// So the weight from input i to output o is at BRAIN_IN_W_OFF + i*2*NO + o
// (weights1) or + NO + o (weights2). BrainDisplay3D reads with exactly that
// arithmetic; worker.writeBrain writes with it.
export const BRAIN_OFF = AMOEBA_OFF + AMOEBA_LEN;
export const BRAIN_INS_OFF = BRAIN_OFF;
export const BRAIN_OUTS_OFF = BRAIN_INS_OFF + NUM_INPUT_NEURONS;
export const BRAIN_IN_W_OFF = BRAIN_OUTS_OFF + NUM_OUTPUT_NEURONS;
export const BRAIN_OUT_W_OFF = BRAIN_IN_W_OFF + NUM_INPUT_NEURONS * 2 * NUM_OUTPUT_NEURONS;
export const BRAIN_LEN =
  NUM_INPUT_NEURONS + NUM_OUTPUT_NEURONS +
  (NUM_INPUT_NEURONS + NUM_OUTPUT_NEURONS) * 2 * NUM_OUTPUT_NEURONS;

// ─── Whole frame ────────────────────────────────────────────────────────────
export const FRAME_LEN = BRAIN_OFF + BRAIN_LEN; // in floats
export const FRAME_BYTES = FRAME_LEN * 4;       // in bytes (an ArrayBuffer is sized in bytes)

// =============================================================================
// SMALL HELPERS USED BY BOTH SIDES
// =============================================================================

/**
 * Names are 4 ASCII letters. A Float32Array can't hold strings, so the worker
 * writes the 4 character codes as 4 floats and the main thread turns them back
 * into a string with this.
 */
export function nameFromCodes(buf: Float32Array, off: number): string {
  return String.fromCharCode(buf[off], buf[off + 1], buf[off + 2], buf[off + 3]);
}

/** The "NAME-genA12" label format used everywhere in the dashboard. */
export function formatLabel(name: string, gen: number, alive: boolean, descendants: number): string {
  return `${name}-${gen}${alive ? 'A' : 'D'}${descendants}`;
}

// =============================================================================
// MESSAGES
// =============================================================================
//
// Everything that is NOT the per-frame snapshot is an ordinary message object
// with a `type` field. TypeScript "discriminated unions" below let each side
// `switch (msg.type)` and get the right fields type-checked for each case.

export type DisplayMode = 'default' | 'brain' | 'family';

/** Identifies one neuron for the kin-delta table. */
export interface NeuronRef { type: 'input' | 'output'; index: number }

// ─── main → worker: commands ────────────────────────────────────────────────
export type MainToWorker =
  // Sent once. Hands the worker its two frame buffers (transferred) and the
  // initial tick rate. The worker generates terrain and starts its loop.
  | { type: 'start'; buffers: ArrayBuffer[]; tps: number }
  // "I've finished drawing this buffer, you can fill it again." (transferred)
  | { type: 'frameDone'; buffer: ArrayBuffer }
  | { type: 'pause'; paused: boolean }
  | { type: 'setTps'; tps: number }              // 0 = run as fast as possible
  | { type: 'new' }                              // fresh terrain + 100 random amoebas
  | { type: 'spawn'; x: number; y: number }      // right-click: drop a new amoeba here
  | { type: 'highlight'; idx: number | null }    // select an amoeba (null = deselect)
  | { type: 'display'; mode: DisplayMode }       // tells the worker whether to fill the BRAIN block
  | { type: 'kinTable'; idx: number; neurons: NeuronRef[] } // request → 'kinTable' reply
  | { type: 'family'; idx: number }              // request → 'family' reply
  | { type: 'alikeness'; a: number; b: number }  // request → 'alikeness' reply
  | { type: 'save' }                             // request → 'save' reply with the JSON
  | { type: 'load'; json: string };              // replace the whole simulation from a save file

// ─── worker → main: frames, periodic stats, and replies ─────────────────────

/** One point on every chart. Produced every 1000 ticks by sim/stats.ts. */
export interface StatsSample {
  timeLabel: number;        // x axis value (ticks / 100)
  redAgar: number;          // total food on the map, by colour
  greenAgar: number;
  blueAgar: number;
  livePop: number;
  aveChildren: number;
  eatEfficiency: number;
  aveLivingLifespan: number;
  avgEnergyEff: number;
  mutationRate: number;
  // generation demographics: parallel arrays indexed by generation
  gens: number[];
  stackedCounts: number[];  // dead + alive per generation
  deadCounts: number[];     // dead per generation
}

/** One amoeba in a family tree, with optional one-level-deep children. */
export interface FamilyNode {
  idx: number;
  name: string;
  gen: number;
  alive: boolean;
  descendants: number;
  children?: FamilyNode[];
}

/** Exactly the shape the family panel renders: parent, siblings, children. */
export interface FamilyTree {
  self: FamilyNode;
  parent: FamilyNode | null;
  siblings: FamilyNode[];   // each carries its children (nieces/nephews)
  children: FamilyNode[];   // each carries its children (grandchildren)
}

/** The kin-delta table for one selected neuron (one row group in the UI). */
export interface KinTableRow {
  type: 'input' | 'output';
  index: number;
  w1: number[];      // this neuron's current weights
  w2: number[];
  advW1: number[];   // mean per-synapse delta among relatives that reproduced
  advW2: number[];
  disW1: number[];   // mean per-synapse delta among relatives that died childless
  disW2: number[];
}

export interface KinTable {
  idx: number;
  advCount: number;
  disCount: number;
  error?: string;    // e.g. "No parent — no delta data"; rows is empty when set
  rows: KinTableRow[];
}

export type WorkerToMain =
  | { type: 'ready' }                                 // the worker finished 'start'
  | { type: 'frame'; buffer: ArrayBuffer }            // a snapshot (buffer is transferred)
  | { type: 'stats'; sample: StatsSample }            // every 1000 ticks
  | { type: 'kinTable'; table: KinTable }             // reply to 'kinTable'
  | { type: 'family'; idx: number; tree: FamilyTree | null } // reply to 'family'
  | { type: 'alikeness'; a: number; b: number; value: number } // reply to 'alikeness'
  | { type: 'save'; json: string }                    // reply to 'save'
  | { type: 'loaded'; ok: boolean; error?: string };  // reply to 'load'
