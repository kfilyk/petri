// =============================================================================
// simClient.ts — the main thread's handle on the simulation worker
// =============================================================================
//
// Everything the page wants from the simulation goes through one SimClient:
//
//   * it CREATES the worker (which starts sim/worker.ts on its own thread),
//   * it SENDS commands (pause, spawn, highlight, ...) as messages,
//   * it RECEIVES frames and replies, and hands them to whoever asked.
//
// THE FRAME HANDSHAKE (the part worth understanding)
// --------------------------------------------------
// There are exactly two frame buffers in existence, created in start(). At any
// moment each one is owned by either the worker or this client — never both,
// because `postMessage(msg, [buffer])` TRANSFERS ownership rather than copying.
//
//   worker: fills buffer → posts 'frame' (transfer) ────────────▶ client: `incoming`
//   client: next animation frame, swapFrame() moves `incoming` → `current`
//           and posts the OLD `current` back as 'frameDone' (transfer) ───▶ worker
//
// So the worker can only publish when it owns a buffer, and it only gets one
// back when we've drawn a frame. That gives natural back-pressure: the worker
// can tick as fast as it likes, but it never produces more snapshots than the
// screen can show, and if the tab is hidden (no animation frames) it simply
// keeps simulating without publishing.
//
// If two frames arrive between two draws (possible when a draw is slow), the
// older one is returned immediately and skipped — we always draw the newest.

import { DEFAULT_TPS } from '../constants';
import {
  FRAME_BYTES,
  FRAME_LEN,
  type MainToWorker,
  type WorkerToMain,
  type DisplayMode,
  type NeuronRef,
} from '../sim/protocol';
import type { Frame } from './frame';

// A map from message type → handler, where each handler receives the correctly
// narrowed message object for its type (e.g. the 'stats' handler gets a
// message with a `.sample`). Purely a TypeScript convenience.
type Handlers = {
  [K in WorkerToMain['type']]?: (msg: Extract<WorkerToMain, { type: K }>) => void;
};

export class SimClient {
  private worker: Worker;
  private handlers: Handlers = {};

  // Frame buffers we currently own (see the handshake above).
  private current: ArrayBuffer | null = null;   // the one being drawn this frame
  private incoming: ArrayBuffer | null = null;  // newest one received, not yet swapped in

  /** A Float32Array view over `current`. Null until the first frame arrives. */
  frame: Frame | null = null;

  constructor() {
    // `new URL(..., import.meta.url)` is the pattern bundlers (Vite) recognise:
    // it builds worker.ts into its own chunk and points this at it. `type:
    // 'module'` lets the worker use import/export like the rest of the code.
    this.worker = new Worker(new URL('../sim/worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<WorkerToMain>) => this.dispatch(e.data);
    this.worker.onerror = (e) => console.error('Simulation worker error:', e.message, e);
  }

  /** Register the handler for one message type (e.g. client.on('stats', m => ...)). */
  on<K extends WorkerToMain['type']>(type: K, handler: (msg: Extract<WorkerToMain, { type: K }>) => void): void {
    (this.handlers as Record<string, unknown>)[type] = handler;
  }

  /** Route an incoming message: frames are handled here, everything else goes to `on` handlers. */
  private dispatch(msg: WorkerToMain): void {
    if (msg.type === 'frame') {
      // A frame arrived before we drew the last one: skip the older one.
      if (this.incoming) this.returnBuffer(this.incoming);
      this.incoming = msg.buffer;
      return;
    }
    const h = (this.handlers as Record<string, ((m: WorkerToMain) => void) | undefined>)[msg.type];
    if (h) h(msg);
  }

  /** Send a command. `transfer` moves buffers instead of copying them. */
  private post(msg: MainToWorker, transfer?: Transferable[]): void {
    if (transfer) this.worker.postMessage(msg, transfer);
    else this.worker.postMessage(msg);
  }

  /** Give a buffer back to the worker so it can write the next frame into it. */
  private returnBuffer(buf: ArrayBuffer): void {
    this.post({ type: 'frameDone', buffer: buf }, [buf]);
  }

  /**
   * Called once per render frame by main.ts. Swaps in the newest snapshot,
   * returns the old one to the worker, and reports whether the frame changed.
   * After this, `this.frame` is what the renderer should draw.
   */
  swapFrame(): boolean {
    if (!this.incoming) return false;
    if (this.current) this.returnBuffer(this.current);
    this.current = this.incoming;
    this.incoming = null;
    this.frame = new Float32Array(this.current, 0, FRAME_LEN); // view, not a copy
    return true;
  }

  // ─── Commands (one small method per MainToWorker message) ────────────────

  /** Allocate the two frame buffers, hand them to the worker, and start it ticking. */
  start(tps: number = DEFAULT_TPS): void {
    const buffers = [new ArrayBuffer(FRAME_BYTES), new ArrayBuffer(FRAME_BYTES)];
    this.post({ type: 'start', buffers, tps }, buffers); // transferred: we no longer own them
  }

  setPaused(paused: boolean): void { this.post({ type: 'pause', paused }); }
  setTps(tps: number): void { this.post({ type: 'setTps', tps }); }
  newSimulation(): void { this.post({ type: 'new' }); }
  spawn(x: number, y: number): void { this.post({ type: 'spawn', x, y }); }
  highlight(idx: number | null): void { this.post({ type: 'highlight', idx }); }
  setDisplay(mode: DisplayMode): void { this.post({ type: 'display', mode }); }
  requestKinTable(idx: number, neurons: NeuronRef[]): void { this.post({ type: 'kinTable', idx, neurons }); }
  requestFamily(idx: number): void { this.post({ type: 'family', idx }); }
  requestAlikeness(a: number, b: number): void { this.post({ type: 'alikeness', a, b }); }
  save(): void { this.post({ type: 'save' }); }
  load(json: string): void { this.post({ type: 'load', json }); }
}
