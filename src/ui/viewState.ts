// =============================================================================
// viewState.ts — main-thread view state: camera, mouse, keyboard, display mode
// =============================================================================
//
// Before the worker split there was one big `state` object holding both the
// simulation (amoebas, tiles) and the view (mouse position, zoom, which panel
// is open). Those are now on different threads, so they had to be separated:
//
//   * src/state.ts      — simulation state, lives in the WORKER
//   * src/ui/viewState.ts (this file) — view state, lives on the MAIN THREAD
//
// Nothing here is ever sent to the worker. The camera transform is applied
// directly to the canvas context; the worker doesn't know or care where you
// are looking.

import type { DisplayMode } from '../sim/protocol';

export const view = {
  /** The map canvas's 2D context. Set once in main.ts init(). */
  ctx: null as CanvasRenderingContext2D | null,

  /** Zoom level and in-progress drag, applied via ctx.scale / ctx.translate. */
  canvas: {
    scale: 1,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragging: false,
  },

  /**
   * Mouse state. `x`/`y` are in WORLD coordinates (after undoing pan and zoom),
   * which is what hit-testing against amoeba positions needs. `originalX`/`Y`
   * accumulate the pan offset in screen pixels so new mouse events can be
   * converted to world space (see InputHandler.getMouseCoords).
   */
  mouse: {
    x: 0,
    y: 0,
    originalX: 0,
    originalY: 0,
    prevX: 0,
    prevY: 0,
    overMap: false,
    leftPressed: false,
    rightPressed: false,
  },

  /** Keys currently held (WASD / arrows pan the camera) and their acceleration. */
  keysPressed: {} as Record<string, boolean>,
  leftAccel: 0,
  rightAccel: 0,
  upAccel: 0,
  downAccel: 0,

  /** Which detail panel is open under the stats panel. Mirrored to the worker via setDisplay(). */
  display: 'default' as DisplayMode,

  /** Camera follows the highlighted amoeba while true. */
  tracking: false,

  /** Local mirror of the pause button; the worker is told via setPaused(). */
  paused: false,

  /** True when the tick rate is unlimited (fast-forward button). */
  fastForward: false,

  /**
   * Index of the selected amoeba, copied from the latest frame every render.
   * The worker is the source of truth (an amoeba's index changes when it
   * dies); this is just so UI code can read it synchronously.
   */
  highlighted: null as number | null,
};
