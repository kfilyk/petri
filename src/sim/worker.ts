// =============================================================================
// worker.ts — the simulation thread
// =============================================================================
//
// WHAT A WEB WORKER IS, IN ONE PARAGRAPH
// --------------------------------------
// The main thread creates this file as a Worker (see ui/simClient.ts):
//
//     new Worker(new URL('../sim/worker.ts', import.meta.url), { type: 'module' })
//
// From then on this code runs on its own thread with its own global scope and
// its own copy of every module it imports. `state` here is NOT the same object
// as a `state` imported on the main thread — it's a separate instance in a
// separate memory space. There is no `window`, no `document`, no canvas. The
// only bridge is messages: we receive them via `onmessage` and send them via
// `postMessage`. That isolation is the whole point: however long a tick takes,
// the page's event loop never waits on it, and vice versa.
//
// WHAT THIS FILE DOES
// -------------------
//   1. Owns the simulation: `state`, every Amoeba, every Tile.
//   2. Runs the tick loop on its own clock (not tied to screen refresh).
//   3. After ticks, writes a snapshot into a frame buffer and transfers it to
//      the main thread (layout in protocol.ts).
//   4. Answers requests that need deep access to simulation objects: kin
//      tables, family trees, alikeness, save/load.
//
// The simulation code itself (Amoeba, TileSystem, AmoebSystem, math, saveLoad)
// is unchanged from the single-threaded days except that all drawing and DOM
// code was removed from it. This file is the only one that knows about both
// the simulation and the message protocol.

import {
  FIELDX,
  FIELDY,
  POPCAP,
  SCORESCAP,
  DEFAULT_TPS,
  NUM_INPUT_NEURONS,
  NUM_OUTPUT_NEURONS,
  TILENUMBER,
} from '../constants';
import { state } from '../state';
import { Amoeba } from '../entities/Amoeba';
import { tileSystem } from '../managers/TileSystem';
import { amoebSystem } from '../managers/AmoebSystem';
import {
  round,
  getAmoebaByIndex,
  getBrainWeight,
  getAlikeness,
  accumulateKinSums,
  kinAdvSum,
  kinDisSum,
  kinOffset,
} from '../utils/math';
import { saveState, loadState } from '../utils/saveLoad';
import { collectStatsSample } from './stats';
import {
  H, HEADER_OFF,
  R, REF, REF_OFF, REF_STRIDE, REF_COUNT,
  F, FOCUS_OFF, FOCUS_LEN,
  TILE_OFF, TILE_STRIDE,
  A, AMOEBA_OFF, AMOEBA_STRIDE,
  BRAIN_INS_OFF, BRAIN_OUTS_OFF, BRAIN_IN_W_OFF, BRAIN_OUT_W_OFF,
  FRAME_LEN,
  type MainToWorker,
  type WorkerToMain,
  type DisplayMode,
  type FamilyNode,
  type FamilyTree,
  type KinTable,
  type KinTableRow,
  type NeuronRef,
} from './protocol';

// =============================================================================
// WORKER SCOPE
// =============================================================================
//
// Inside a worker, the global object is `self` (a DedicatedWorkerGlobalScope),
// and `self.postMessage(msg, transferList)` is how we talk to the page. Our
// tsconfig uses the DOM type library, which types `self` as a Window — whose
// postMessage has a different signature. Rather than fight the type libraries,
// we declare the two members we actually use and cast once.

interface WorkerScope {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  onmessage: ((e: MessageEvent<MainToWorker>) => void) | null;
}
const scope = self as unknown as WorkerScope;

/**
 * Send a message to the main thread.
 * `transfer` lists ArrayBuffers whose ownership should MOVE instead of being
 * copied. After this call those buffers are unusable on this side (byteLength
 * becomes 0) until the main thread transfers them back.
 */
function post(msg: WorkerToMain, transfer?: Transferable[]): void {
  scope.postMessage(msg, transfer);
}

// =============================================================================
// LOOP STATE
// =============================================================================

let tps = DEFAULT_TPS;          // target ticks per second; 0 = as fast as possible
let paused = false;
let displayMode: DisplayMode = 'default'; // only 'brain' changes what we write (the BRAIN block)

// Frame buffers we currently own and may write into. The main thread owns the
// others. 'start' gives us two; each 'frame' we send removes one from here and
// each 'frameDone' we receive puts one back.
const freeBuffers: ArrayBuffer[] = [];

// Why publish a frame? Either the simulation advanced (`ticked`) or something
// the UI shows changed without a tick (`dirty`: highlight, pause, load...).
// If neither is true there is nothing new to draw and we send nothing.
let ticked = false;
let dirty = true;

// Fixed-rate ticking (tps > 0) uses an accumulator: real elapsed time is
// converted into "ticks owed", and we run whole ticks while at least one is
// owed. This keeps the average rate exact even though timers fire unevenly.
let tickAccumulator = 0;
let lastLoopTime = 0;
const MAX_BACKLOG = 8;          // if the thread stalls (e.g. tab hidden), owe at most this many ticks
const UNLIMITED_SLICE_MS = 8;   // in unlimited mode, tick for this long, then yield to handle messages

// Measured tick rate, so the FPS counter can show "60 FPS | 540 TPS".
let tpsWindowStart = 0;
let tpsWindowTicks = 0;
let measuredTps = 0;

// A MessageChannel is the cheapest way to say "run `loop` again as soon as the
// event loop is free". setTimeout(fn, 0) would also work but browsers clamp
// nested zero-delay timers to >= 4ms, which would cap unlimited mode at ~250
// slices/second. Posting to our own port has no such clamp.
//
// Yielding matters: `onmessage` handlers only run between our turns on the
// event loop. If `loop` never returned, 'pause' and 'frameDone' would never be
// processed. UNLIMITED_SLICE_MS bounds how long we hog the thread.
const yieldChannel = new MessageChannel();
yieldChannel.port1.onmessage = () => loop();
const yieldNow = () => yieldChannel.port2.postMessage(0);

// =============================================================================
// SIMULATION CONTROL
// =============================================================================

/** Fresh terrain and 100 random amoebas (the restart button). */
function newSimulation(): void {
  state.highlighted = null;
  state.newest = null;
  state.gold = state.silver = state.bronze = null;
  state.scores = new Array(SCORESCAP);
  state.amoebs = new Array(POPCAP);
  state.graveyard = [];

  for (let i = 0; i < 100; i++) {
    state.amoebs[i] = new Amoeba(
      round(Math.random() * FIELDX),
      round(Math.random() * FIELDY),
      i
    );
  }

  state.resetStats();
  tileSystem.generate();
  dirty = true;
}

/**
 * Find the first slot that is empty or holds a fully dead amoeba.
 * Live amoebas occupy a contiguous prefix of `state.amoebs`; slots are reused
 * once their occupant has finished decaying ('dead'), never while it is a husk.
 */
function findFreeSlot(): number {
  let i = 0;
  while (state.amoebs[i] != null && state.amoebs[i].status !== 'dead') i++;
  return i;
}

/** Right-click on the map: drop a brand-new random amoeba at world (x, y). */
function spawn(x: number, y: number): void {
  if (state.stats.livePop >= POPCAP) return;
  const i = findFreeSlot();
  state.amoebs[i] = new Amoeba(round(x), round(y), i);
  state.newest = i;
  state.stats.livePop++;
  if (i > state.HIGHESTINDEX) state.HIGHESTINDEX = i;
  dirty = true;
}

/**
 * ONE simulation tick. Same order as the old single-threaded `cycle()`:
 * tiles regrow, amoebas act, stats are sampled on round-number ticks, time
 * advances. This is the function whose cost sets the maximum tick rate.
 */
function tick(): void {
  tileSystem.regenerate();
  amoebSystem.update();

  if (state.stats.time % 1000 === 0) {
    // Stats go as an ordinary (cloned) message: small and infrequent.
    post({ type: 'stats', sample: collectStatsSample() });
  }

  state.stats.time++;
  ticked = true;
  tpsWindowTicks++;
}

// =============================================================================
// FRAME SNAPSHOT
// =============================================================================
//
// These functions serialise the parts of the simulation the UI needs into the
// flat Float32Array described in protocol.ts. The main thread never sees an
// Amoeba object; it sees these numbers.

/** 4-letter name → 4 char codes (space-padded if shorter). */
function writeName(f: Float32Array, off: number, name: string): void {
  f[off] = name.charCodeAt(0) || 32;
  f[off + 1] = name.charCodeAt(1) || 32;
  f[off + 2] = name.charCodeAt(2) || 32;
  f[off + 3] = name.charCodeAt(3) || 32;
}

/** Fill one REFS slot (dashboard label data) for the amoeba at `idx`, or mark it empty. */
function writeRef(f: Float32Array, slot: number, idx: number | null): void {
  const off = REF_OFF + slot * REF_STRIDE;
  const a = idx === null ? undefined : getAmoebaByIndex(idx);
  if (!a) {
    f[off + R.VALID] = 0;
    return;
  }
  f[off + R.VALID] = 1;
  f[off + R.IDX] = a.index;
  writeName(f, off + R.NAME0, a.name);
  f[off + R.GEN] = a.gen;
  f[off + R.ALIVE] = a.status === 'alive' ? 1 : 0;
  f[off + R.DESCENDANTS] = a.descendants;
}

function statusCode(a: Amoeba): number {
  return a.status === 'alive' ? 0 : a.status === 'decaying' ? 1 : 2;
}

/** Fill the FOCUS block with everything the stats panel / highlight overlay shows. */
function writeFocus(f: Float32Array, a: Amoeba): void {
  const o = FOCUS_OFF;
  f.fill(0, o, o + FOCUS_LEN); // clear stale values from a previous amoeba
  f[o + F.IDX] = a.index;
  f[o + F.STATUS] = statusCode(a);
  f[o + F.X] = a.x;
  f[o + F.Y] = a.y;
  f[o + F.SIZE] = a.size;
  f[o + F.DIRECTION] = a.direction;
  f[o + F.BORN] = a.born;
  f[o + F.AGE] = a.age;
  f[o + F.SIBLING_IDX] = a.sibling_idx === null ? -1 : a.sibling_idx;
  f[o + F.ENERGY] = a.energy;
  f[o + F.MAX_ENERGY] = a.maxEnergy;
  f[o + F.ENERGY_CHANGE] = a.energyChange;
  f[o + F.DAMAGE_RECEIVED] = a.damageReceived;
  f[o + F.DAMAGE_CAUSED] = a.damageCaused;
  f[o + F.BRAIN_WEIGHT] = getBrainWeight(a);
  f[o + F.MOUTH_DETECTED] = a.mouth.detected;
  for (let i = 0; i < 5; i++) f[o + F.EYE_DETECTED + i] = a.eyes[i].detected;
  for (let i = 0; i < 6; i++) f[o + F.OUT + i] = a.outputs[i].out;
  f[o + F.DESCENDANTS] = a.descendants;
  f[o + F.GEN] = a.gen;
  f[o + F.HAS_PARENT] = a.parent === null ? 0 : 1;
  f[o + F.PARENT] = a.parent === null ? 0 : a.parent;
  writeName(f, o + F.NAME0, a.name);
  f[o + F.VELOCITY_X] = a.velocityX;
  f[o + F.MOUTH_X] = a.mouth.x;
  f[o + F.MOUTH_Y] = a.mouth.y;
  for (let i = 0; i < 5; i++) {
    f[o + F.EYE_XY + i * 2] = a.eyes[i].x;
    f[o + F.EYE_XY + i * 2 + 1] = a.eyes[i].y;
  }
}

/**
 * Fill the BRAIN block: activations plus every weight of the highlighted
 * amoeba. `Float32Array.set` copies a whole weight array in one call, which is
 * much faster than a per-element loop.
 */
function writeBrain(f: Float32Array, a: Amoeba): void {
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) f[BRAIN_INS_OFF + i] = a.inputs[i].in;
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) f[BRAIN_OUTS_OFF + o] = a.outputs[o].out;

  let p = BRAIN_IN_W_OFF;
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    f.set(a.inputs[i].weights1, p); p += NUM_OUTPUT_NEURONS;
    f.set(a.inputs[i].weights2, p); p += NUM_OUTPUT_NEURONS;
  }
  p = BRAIN_OUT_W_OFF;
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    f.set(a.outputs[i].weights1, p); p += NUM_OUTPUT_NEURONS;
    f.set(a.outputs[i].weights2, p); p += NUM_OUTPUT_NEURONS;
  }
}

/** Write a complete snapshot of the current simulation into `buf`. */
function writeFrame(buf: ArrayBuffer): void {
  // A typed-array VIEW over the raw bytes. No copy: writing f[i] writes buf.
  const f = new Float32Array(buf, 0, FRAME_LEN);

  // ── Header ──
  const h = HEADER_OFF;
  f[h + H.TIME] = state.stats.time;
  f[h + H.LIVE_POP] = state.stats.livePop;
  f[h + H.DEAD_COUNT] = state.graveyard.length;
  f[h + H.HAS_HIGHLIGHTED] = state.highlighted === null ? 0 : 1;
  f[h + H.HIGHLIGHTED] = state.highlighted === null ? 0 : state.highlighted;
  f[h + H.HAS_NEWEST] = state.newest === null ? 0 : 1;
  f[h + H.NEWEST] = state.newest === null ? 0 : state.newest;
  f[h + H.PAUSED] = paused ? 1 : 0;
  f[h + H.TPS_TARGET] = tps;
  f[h + H.TPS_MEASURED] = measuredTps;
  f[h + H.GOLD] = state.gold === null ? -1 : state.gold;
  f[h + H.SILVER] = state.silver === null ? -1 : state.silver;
  f[h + H.BRONZE] = state.bronze === null ? -1 : state.bronze;

  // ── Named references for the dashboard labels ──
  writeRef(f, REF.HIGHLIGHTED, state.highlighted);
  writeRef(f, REF.NEWEST, state.newest);
  writeRef(f, REF.GOLD, state.gold);
  writeRef(f, REF.SILVER, state.silver);
  writeRef(f, REF.BRONZE, state.bronze);
  void REF_COUNT; // (documented in protocol.ts; referenced here so the import isn't flagged unused)

  // ── Focus block, and brain block only when the brain panel is open ──
  const focus = state.highlighted === null ? undefined : getAmoebaByIndex(state.highlighted);
  f[h + H.HAS_FOCUS] = focus ? 1 : 0;
  f[h + H.HAS_BRAIN] = 0;
  if (focus) {
    writeFocus(f, focus);
    if (displayMode === 'brain') {
      writeBrain(f, focus);
      f[h + H.HAS_BRAIN] = 1;
    }
  }

  // ── Tiles: R, G, B food per tile ──
  let p = TILE_OFF;
  for (let i = 0; i < TILENUMBER; i++) {
    const t = state.tiles[i];
    f[p] = t.R;
    f[p + 1] = t.G;
    f[p + 2] = t.B;
    p += TILE_STRIDE;
  }

  // ── Live amoebas (alive + decaying husks), packed with no gaps ──
  let count = 0;
  p = AMOEBA_OFF;
  for (let i = 0; i <= state.HIGHESTINDEX; i++) {
    const a = state.amoebs[i];
    if (!a || a.status === 'dead') continue;
    f[p + A.IDX] = a.index;
    f[p + A.STATUS] = a.status === 'alive' ? 0 : 1;
    f[p + A.X] = a.x;
    f[p + A.Y] = a.y;
    f[p + A.SIZE] = a.size;
    f[p + A.DIRECTION] = a.direction;
    for (let k = 0; k < 6; k++) f[p + A.OUT + k] = a.outputs[k].out;
    f[p + A.MOUTH_X] = a.mouth.x;
    f[p + A.MOUTH_Y] = a.mouth.y;
    for (let k = 0; k < 5; k++) {
      f[p + A.EYE_XY + k * 2] = a.eyes[k].x;
      f[p + A.EYE_XY + k * 2 + 1] = a.eyes[k].y;
    }
    f[p + A.GEN] = a.gen;
    f[p + A.DESCENDANTS] = a.descendants;
    writeName(f, p + A.NAME0, a.name);
    f[p + A.VELOCITY_X] = a.velocityX;
    f[p + A.GRAVE] = a.grave ?? 0;
    p += AMOEBA_STRIDE;
    count++;
  }
  f[h + H.AMOEBA_COUNT] = count;
}

/**
 * Send a frame if (a) we own a buffer to write into and (b) there is anything
 * new to show. (a) is the back-pressure mechanism: the main thread returns a
 * buffer once per rendered frame, so we can never publish faster than it
 * draws, and if the tab is hidden (no rendering) we simply stop publishing
 * while the simulation keeps ticking.
 */
function publish(): void {
  if (freeBuffers.length === 0 || !(ticked || dirty)) return;
  const buf = freeBuffers.pop()!;
  writeFrame(buf);
  post({ type: 'frame', buffer: buf }, [buf]); // [buf] = transfer, don't copy
  ticked = false;
  dirty = false;
}

// =============================================================================
// THE LOOP
// =============================================================================
//
// There is no requestAnimationFrame in a worker (and we wouldn't want one: the
// simulation shouldn't care about screen refresh). Instead `loop` runs some
// ticks, publishes, and schedules itself again:
//
//   paused        → check back in 50ms (still publishes `dirty` frames)
//   tps > 0       → setTimeout for exactly as long as until the next tick is owed
//   tps == 0      → yield via the MessageChannel and run again immediately
//
// Messages from the main thread are processed in the gaps between runs.

function loop(): void {
  const now = performance.now();

  if (!paused) {
    if (tps > 0) {
      // Convert elapsed real time into ticks owed, then pay them off.
      tickAccumulator += ((now - lastLoopTime) * tps) / 1000;
      if (tickAccumulator > MAX_BACKLOG) tickAccumulator = MAX_BACKLOG;
      while (tickAccumulator >= 1) {
        tick();
        tickAccumulator -= 1;
      }
    } else {
      // Unlimited: tick back-to-back for one slice, then yield so messages
      // (pause! frameDone!) get a chance to run.
      const end = now + UNLIMITED_SLICE_MS;
      do {
        tick();
      } while (performance.now() < end);
    }
  }
  lastLoopTime = now;

  // Measured tick rate, refreshed twice a second
  if (now - tpsWindowStart >= 500) {
    measuredTps = (tpsWindowTicks * 1000) / (now - tpsWindowStart);
    tpsWindowTicks = 0;
    tpsWindowStart = now;
    dirty = true; // header changed even if nothing ticked (e.g. while paused)
  }

  publish();
  schedule();
}

function schedule(): void {
  if (paused) {
    setTimeout(loop, 50);
  } else if (tps > 0) {
    const msToNext = Math.max(0, ((1 - tickAccumulator) * 1000) / tps);
    setTimeout(loop, msToNext);
  } else {
    yieldNow();
  }
}

// =============================================================================
// ON-DEMAND QUERIES
// =============================================================================
//
// Some panels need data that is too big or too rare to put in every frame.
// The main thread asks with a message; we answer with a message. Replies are
// plain objects (cloned), built fresh each time.

/** Minimal description of one amoeba for the family tree. */
function node(a: Amoeba): FamilyNode {
  return {
    idx: a.index,
    name: a.name,
    gen: a.gen,
    alive: a.status === 'alive',
    descendants: a.descendants,
  };
}

/** Same, plus its direct children (one level only). */
function withChildren(a: Amoeba): FamilyNode {
  const n = node(a);
  n.children = [];
  for (const childIdx of a.children) {
    const c = getAmoebaByIndex(childIdx);
    if (c) n.children.push(node(c));
  }
  return n;
}

/**
 * Parent, siblings (with their children), and children (with grandchildren)
 * of the amoeba at `idx` — exactly what the family panel draws.
 */
function buildFamilyTree(idx: number): FamilyTree | null {
  const self = getAmoebaByIndex(idx);
  if (!self) return null;

  let parent: FamilyNode | null = null;
  const siblings: FamilyNode[] = [];
  if (self.parent !== null) {
    const p = getAmoebaByIndex(self.parent);
    if (p) {
      parent = node(p);
      for (const childIdx of p.children) {
        if (childIdx === self.index) continue;
        const s = getAmoebaByIndex(childIdx);
        if (s) siblings.push(withChildren(s));
      }
    }
  }

  const children: FamilyNode[] = [];
  for (const childIdx of self.children) {
    const c = getAmoebaByIndex(childIdx);
    if (c) children.push(withChildren(c));
  }

  return { self: node(self), parent, siblings, children };
}

/**
 * The kin-delta table shown under the 3D brain when neurons are selected.
 * Reuses the exact same accumulation mitosis uses (accumulateKinSums), then
 * slices out the selected neurons' rows and converts sums to means.
 */
function buildKinTable(idx: number, neurons: NeuronRef[]): KinTable {
  const a = getAmoebaByIndex(idx);
  if (!a) return { idx, advCount: 0, disCount: 0, error: 'Amoeba not found', rows: [] };
  if (a.parent === null) return { idx, advCount: 0, disCount: 0, error: 'No parent — no delta data', rows: [] };
  if (!getAmoebaByIndex(a.parent)) return { idx, advCount: 0, disCount: 0, error: 'Parent not found', rows: [] };

  const { advCount, disCount } = accumulateKinSums(a.parent);
  const n = NUM_OUTPUT_NEURONS;
  const advScale = advCount > 0 ? 1 / advCount : 0;
  const disScale = disCount > 0 ? 1 / disCount : 0;

  const rows: KinTableRow[] = neurons.map((sel) => {
    const neuron = sel.type === 'input' ? a.inputs[sel.index] : a.outputs[sel.index];
    const off = kinOffset(sel.type, sel.index); // where this neuron's weights1 start in the sum buffers
    const advW1 = new Array<number>(n);
    const advW2 = new Array<number>(n);
    const disW1 = new Array<number>(n);
    const disW2 = new Array<number>(n);
    for (let j = 0; j < n; j++) {
      advW1[j] = kinAdvSum[off + j] * advScale;
      advW2[j] = kinAdvSum[off + n + j] * advScale;
      disW1[j] = kinDisSum[off + j] * disScale;
      disW2[j] = kinDisSum[off + n + j] * disScale;
    }

    return {
      type: sel.type,
      index: sel.index,
      w1: Array.from(neuron.weights1), // typed arrays become plain arrays for the message
      w2: Array.from(neuron.weights2),
      advW1, advW2, disW1, disW2,
    };
  });

  return { idx, advCount, disCount, rows };
}

// =============================================================================
// MESSAGE HANDLING
// =============================================================================
//
// `onmessage` is the worker's inbox. It runs between turns of `loop`, never in
// the middle of one, so we can mutate `state` here without any locking — the
// worker is single-threaded like any other JavaScript context.

scope.onmessage = (e: MessageEvent<MainToWorker>) => {
  const msg = e.data;
  switch (msg.type) {
    case 'start':
      // The buffers arrive TRANSFERRED: the main thread no longer owns them.
      for (const b of msg.buffers) freeBuffers.push(b);
      tps = msg.tps;
      tileSystem.generate();
      lastLoopTime = performance.now();
      tpsWindowStart = lastLoopTime;
      post({ type: 'ready' });
      dirty = true;
      publish(); // first frame: empty map, so the page has something to draw
      loop();    // kick off the self-scheduling loop
      return;

    case 'frameDone':
      // The main thread drew this buffer and transferred it back to us.
      freeBuffers.push(msg.buffer);
      break;

    case 'pause':
      if (paused && !msg.paused) {
        // Resuming: don't "owe" ticks for the time we were paused.
        lastLoopTime = performance.now();
        tickAccumulator = 0;
      }
      paused = msg.paused;
      dirty = true;
      break;

    case 'setTps':
      tps = Math.max(0, msg.tps);
      tickAccumulator = 0;
      dirty = true;
      break;

    case 'new':
      newSimulation();
      break;

    case 'spawn':
      spawn(msg.x, msg.y);
      break;

    case 'highlight':
      // Selection lives here, not on the main thread, because when an amoeba
      // dies its index changes (live slot → graveyard) and only we know when.
      state.highlighted = msg.idx;
      dirty = true;
      break;

    case 'display':
      displayMode = msg.mode;
      dirty = true;
      break;

    case 'kinTable':
      post({ type: 'kinTable', table: buildKinTable(msg.idx, msg.neurons) });
      break;

    case 'family':
      post({ type: 'family', idx: msg.idx, tree: buildFamilyTree(msg.idx) });
      break;

    case 'alikeness': {
      const a = getAmoebaByIndex(msg.a);
      const b = getAmoebaByIndex(msg.b);
      post({ type: 'alikeness', a: msg.a, b: msg.b, value: a && b ? getAlikeness(a, b) : 0 });
      break;
    }

    case 'save':
      // saveState() produces a JSON string; strings are cloned (copied) when
      // posted, which is fine for an occasional multi-megabyte save.
      post({ type: 'save', json: saveState() });
      break;

    case 'load':
      try {
        loadState(msg.json);
        dirty = true;
        post({ type: 'loaded', ok: true });
      } catch (err) {
        post({ type: 'loaded', ok: false, error: String(err) });
      }
      break;
  }

  // Most commands change something visible; try to get a frame out right away
  // rather than waiting for the next loop turn (matters most while paused).
  publish();
};
