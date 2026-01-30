// InputHandler - Handles mouse and keyboard input

import { POPCAP, FIELDX, FIELDY } from '../constants';
import { round } from '../utils/math';
import { state } from '../state';
import { Amoeb } from '../entities/Amoeb';

// Cached DOM element
let dashLiveInfo: HTMLElement | null = null;

/**
 * Initialize cached DOM elements
 */
export function initInputHandlerDom(): void {
  dashLiveInfo = document.getElementById('dash-live-info');
}

export const inputHandler = {
  /**
   * Process all input each frame
   */
  update(): void {
    const ctx = state.ctx.map;
    if (!ctx) return;

    if (state.mouse.overMap) {
      // Right click: spawn new animal
      if (state.mouse.rightPressed) {
        if (state.stats.livePop < POPCAP) {
          let i = 0;
          while (state.amoebs[i] != null) {
            if (state.amoebs[i].status !== 'dead') {
              i++;
            } else {
              break;
            }
          }

          state.amoebs[i] = new Amoeb(round(state.mouse.x), round(state.mouse.y), i);
          state.newest = i;
          state.stats.livePop++;

          if (i > state.HIGHESTINDEX) {
            state.HIGHESTINDEX = i;
          }

          if (dashLiveInfo) {
            dashLiveInfo.innerHTML = 'LIVE: ' + state.stats.livePop + '     DEAD: ' + state.graveyard.length;
          }
        }
        state.mouse.rightPressed = false;
      } else if (state.mouse.leftPressed) {
        // Left click: drag canvas
        if (!state.canvas.dragging) {
          state.canvas.dragging = true;
        } else {
          const dx = state.mouse.x - state.mouse.prevX;
          const dy = state.mouse.y - state.mouse.prevY;
          ctx.translate(dx, dy);
          state.canvas.dragOffsetX += dx * state.canvas.scale;
          state.canvas.dragOffsetY += dy * state.canvas.scale;
        }
        state.mouse.prevX = state.mouse.x;
        state.mouse.prevY = state.mouse.y;
      } else if (state.canvas.dragging) {
        // End drag
        state.canvas.dragging = false;
        state.mouse.originalX += state.canvas.dragOffsetX;
        state.mouse.originalY += state.canvas.dragOffsetY;
        state.mouse.x += state.canvas.dragOffsetX;
        state.mouse.y += state.canvas.dragOffsetY;
        state.canvas.dragOffsetX = 0;
        state.canvas.dragOffsetY = 0;
      }
    }

    // Keyboard navigation
    for (const k in state.keysPressed) {
      if ((k === 'a' || k === 'ArrowLeft') && state.keysPressed[k]) {
        state.leftAccel += 2;
        state.mouse.x -= state.leftAccel;
        state.mouse.originalX += state.leftAccel * state.canvas.scale;
        ctx.translate(state.leftAccel, 0);
      }

      if ((k === 'w' || k === 'ArrowUp') && state.keysPressed[k]) {
        state.upAccel += 2;
        state.mouse.y -= state.upAccel;
        state.mouse.originalY += state.upAccel * state.canvas.scale;
        ctx.translate(0, state.upAccel);
      }

      if ((k === 's' || k === 'ArrowDown') && state.keysPressed[k]) {
        state.downAccel += 2;
        state.mouse.y += state.downAccel;
        state.mouse.originalY -= state.downAccel * state.canvas.scale;
        ctx.translate(0, -state.downAccel);
      }

      if ((k === 'd' || k === 'ArrowRight') && state.keysPressed[k]) {
        state.rightAccel += 2;
        state.mouse.x += state.rightAccel;
        state.mouse.originalX -= state.rightAccel * state.canvas.scale;
        ctx.translate(-state.rightAccel, 0);
      }
    }
  },
};

/**
 * Get mouse coordinates from event
 */
export function getMouseCoords(
  e: MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  let x = (e.clientX / rect.right) * canvas.width;
  let y = (e.clientY / rect.bottom) * canvas.height;
  x -= state.mouse.originalX;
  y -= state.mouse.originalY;
  x /= state.canvas.scale;
  y /= state.canvas.scale;
  return { x, y };
}

/**
 * Handle mouse events
 */
export function handleMouseEvent(
  action: string,
  e: MouseEvent,
  canvas: HTMLCanvasElement
): void {
  const coords = getMouseCoords(e, canvas);
  state.mouse.x = coords.x;
  state.mouse.y = coords.y;

  if (action === 'down') {
    if (e.button === 0) {
      state.mouse.leftPressed = true;
    } else if (e.button === 2) {
      state.mouse.rightPressed = true;
    }
  }

  if (action === 'up' || action === 'out') {
    if (e.button === 0) {
      state.mouse.leftPressed = false;
    } else if (e.button === 2) {
      state.mouse.rightPressed = false;
    }
  }
}

/**
 * Handle mouse wheel for zooming
 */
export function handleMouseWheel(e: WheelEvent, canvas: HTMLCanvasElement): void {
  e.preventDefault();
  const ctx = state.ctx.map;
  if (!ctx) return;

  let scaleDelta = (e as any).wheelDelta || -e.deltaY;
  if (scaleDelta > 20) scaleDelta = 20;
  else if (scaleDelta < -20) scaleDelta = -20;

  const tSca = 1 + scaleDelta / 400;

  state.mouse.originalX += (state.mouse.x - state.mouse.x * tSca) * state.canvas.scale;
  state.mouse.originalY += (state.mouse.y - state.mouse.y * tSca) * state.canvas.scale;

  ctx.translate(state.mouse.x, state.mouse.y);
  ctx.scale(tSca, tSca);
  ctx.translate(-state.mouse.x, -state.mouse.y);

  const rect = canvas.getBoundingClientRect();
  let mouseX = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  let mouseY = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
  mouseX -= state.mouse.originalX;
  mouseY -= state.mouse.originalY;

  state.canvas.scale *= tSca;
  state.mouse.x = mouseX / state.canvas.scale;
  state.mouse.y = mouseY / state.canvas.scale;
}

/**
 * Handle keyboard events
 */
export function handleKeyDown(e: KeyboardEvent, pauseCallback: () => void): void {
  const handledKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'];

  if (!handledKeys.includes(e.key)) {
    return;
  }

  e.preventDefault();
  state.keysPressed[e.key] = true;

  if (e.key === ' ') {
    pauseCallback();
  }

  // ESC stops tracking
  if (e.key === 'Escape') {
    state.tracking = null;
  }
}

export function handleKeyUp(e: KeyboardEvent): void {
  const handledKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'];

  if (!handledKeys.includes(e.key)) {
    return;
  }

  e.preventDefault();
  state.keysPressed[e.key] = false;

  if (e.key === 'a' || e.key === 'ArrowLeft') {
    state.leftAccel = 0;
  } else if (e.key === 'w' || e.key === 'ArrowUp') {
    state.upAccel = 0;
  } else if (e.key === 's' || e.key === 'ArrowDown') {
    state.downAccel = 0;
  } else if (e.key === 'd' || e.key === 'ArrowRight') {
    state.rightAccel = 0;
  }
}
