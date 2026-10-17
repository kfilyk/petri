// InputHandler - Mouse and keyboard input (main thread)
//
// Camera pan/zoom happens here directly on the canvas transform. Anything that
// changes the simulation (spawning, selecting) is sent to the worker.

import { A } from '../sim/protocol';
import { view } from '../ui/viewState';
import { type Frame, amoebaCount, amoebaOff, highlightedIdx } from '../ui/frame';
import type { SimClient } from '../ui/simClient';

/**
 * Resolve a left click on the map against the live amoeba records.
 * Mirrors the original selection pass: first hit wins and consumes the press.
 */
export function handleSelection(f: Frame | null, client: SimClient): void {
  if (!view.mouse.leftPressed || !view.mouse.overMap || !f) return;

  const n = amoebaCount(f);
  const mx = view.mouse.x;
  const my = view.mouse.y;
  const current = highlightedIdx(f);

  for (let i = 0; i < n; i++) {
    const o = amoebaOff(i);
    const size = f[o + A.SIZE];
    if (Math.abs(f[o + A.X] - mx) <= size + 1 && Math.abs(f[o + A.Y] - my) <= size + 1) {
      const decaying = f[o + A.STATUS] === 1;
      // A husk is selected via its graveyard record so the genealogy stays valid
      const target = decaying ? f[o + A.GRAVE] : f[o + A.IDX];
      if (target !== current) {
        client.highlight(target);
        if (decaying) view.tracking = false;
      }
      view.mouse.leftPressed = false;
      return;
    }
  }

  // Click on empty map while tracking: stop tracking
  if (view.tracking) {
    view.tracking = false;
    view.mouse.leftPressed = false;
  }
}

export const inputHandler = {
  /**
   * Process held input each frame (drag, pan keys, right-click spawn)
   */
  update(client: SimClient): void {
    const ctx = view.ctx;
    if (!ctx) return;

    if (view.mouse.overMap) {
      // Right click: spawn new animal
      if (view.mouse.rightPressed) {
        client.spawn(view.mouse.x, view.mouse.y);
        view.mouse.rightPressed = false;
      } else if (view.mouse.leftPressed) {
        // Left click: drag canvas
        if (!view.canvas.dragging) {
          view.canvas.dragging = true;
        } else {
          const dx = view.mouse.x - view.mouse.prevX;
          const dy = view.mouse.y - view.mouse.prevY;
          ctx.translate(dx, dy);
          view.canvas.dragOffsetX += dx * view.canvas.scale;
          view.canvas.dragOffsetY += dy * view.canvas.scale;
        }
        view.mouse.prevX = view.mouse.x;
        view.mouse.prevY = view.mouse.y;
      } else if (view.canvas.dragging) {
        // End drag
        view.canvas.dragging = false;
        view.mouse.originalX += view.canvas.dragOffsetX;
        view.mouse.originalY += view.canvas.dragOffsetY;
        view.mouse.x += view.canvas.dragOffsetX;
        view.mouse.y += view.canvas.dragOffsetY;
        view.canvas.dragOffsetX = 0;
        view.canvas.dragOffsetY = 0;
      }
    }

    // Keyboard navigation
    for (const k in view.keysPressed) {
      if (!view.keysPressed[k]) continue;

      if (k === 'a' || k === 'ArrowLeft') {
        view.leftAccel += 2;
        view.mouse.x -= view.leftAccel;
        view.mouse.originalX += view.leftAccel * view.canvas.scale;
        ctx.translate(view.leftAccel, 0);
      }
      if (k === 'w' || k === 'ArrowUp') {
        view.upAccel += 2;
        view.mouse.y -= view.upAccel;
        view.mouse.originalY += view.upAccel * view.canvas.scale;
        ctx.translate(0, view.upAccel);
      }
      if (k === 's' || k === 'ArrowDown') {
        view.downAccel += 2;
        view.mouse.y += view.downAccel;
        view.mouse.originalY -= view.downAccel * view.canvas.scale;
        ctx.translate(0, -view.downAccel);
      }
      if (k === 'd' || k === 'ArrowRight') {
        view.rightAccel += 2;
        view.mouse.x += view.rightAccel;
        view.mouse.originalX -= view.rightAccel * view.canvas.scale;
        ctx.translate(-view.rightAccel, 0);
      }
    }
  },
};

/**
 * Get mouse coordinates (world space) from event
 */
export function getMouseCoords(e: MouseEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  let x = (e.clientX / rect.right) * canvas.width;
  let y = (e.clientY / rect.bottom) * canvas.height;
  x -= view.mouse.originalX;
  y -= view.mouse.originalY;
  x /= view.canvas.scale;
  y /= view.canvas.scale;
  return { x, y };
}

/**
 * Handle mouse events
 */
export function handleMouseEvent(action: string, e: MouseEvent, canvas: HTMLCanvasElement): void {
  const coords = getMouseCoords(e, canvas);
  view.mouse.x = coords.x;
  view.mouse.y = coords.y;

  if (action === 'down') {
    if (e.button === 0) view.mouse.leftPressed = true;
    else if (e.button === 2) view.mouse.rightPressed = true;
  }

  if (action === 'up' || action === 'out') {
    if (e.button === 0) view.mouse.leftPressed = false;
    else if (e.button === 2) view.mouse.rightPressed = false;
  }
}

/**
 * Handle mouse wheel for zooming
 */
export function handleMouseWheel(e: WheelEvent, canvas: HTMLCanvasElement): void {
  e.preventDefault();
  const ctx = view.ctx;
  if (!ctx) return;

  let scaleDelta = (e as any).wheelDelta || -e.deltaY;
  if (scaleDelta > 20) scaleDelta = 20;
  else if (scaleDelta < -20) scaleDelta = -20;

  const tSca = 1 + scaleDelta / 400;

  view.mouse.originalX += (view.mouse.x - view.mouse.x * tSca) * view.canvas.scale;
  view.mouse.originalY += (view.mouse.y - view.mouse.y * tSca) * view.canvas.scale;

  ctx.translate(view.mouse.x, view.mouse.y);
  ctx.scale(tSca, tSca);
  ctx.translate(-view.mouse.x, -view.mouse.y);

  const rect = canvas.getBoundingClientRect();
  let mouseX = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  let mouseY = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
  mouseX -= view.mouse.originalX;
  mouseY -= view.mouse.originalY;

  view.canvas.scale *= tSca;
  view.mouse.x = mouseX / view.canvas.scale;
  view.mouse.y = mouseY / view.canvas.scale;
}

const HANDLED_KEYS = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'];

/**
 * Handle keyboard events
 */
export function handleKeyDown(e: KeyboardEvent, pauseCallback: () => void): void {
  if (!HANDLED_KEYS.includes(e.key)) return;

  e.preventDefault();
  view.keysPressed[e.key] = true;

  if (e.key === ' ') pauseCallback();

  // ESC stops tracking
  if (e.key === 'Escape') view.tracking = false;
}

export function handleKeyUp(e: KeyboardEvent): void {
  if (!HANDLED_KEYS.includes(e.key)) return;

  e.preventDefault();
  view.keysPressed[e.key] = false;

  if (e.key === 'a' || e.key === 'ArrowLeft') view.leftAccel = 0;
  else if (e.key === 'w' || e.key === 'ArrowUp') view.upAccel = 0;
  else if (e.key === 's' || e.key === 'ArrowDown') view.downAccel = 0;
  else if (e.key === 'd' || e.key === 'ArrowRight') view.rightAccel = 0;
}
