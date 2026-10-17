// FPS Counter component - measures render frame rate; also shows the
// simulation tick rate reported by the worker.

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;
let element: HTMLElement | null = null;

/**
 * Initialize the FPS counter with a DOM element
 */
export function initFPSCounter(el: HTMLElement): void {
  element = el;
}

/**
 * Call this every frame to update FPS calculation
 * Updates display every 500ms for stability
 * @param tps - measured simulation ticks per second (from the latest frame)
 */
export function updateFPS(tps: number = 0): void {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;

  // Update display twice per second
  if (delta >= 500) {
    fps = (frameCount / delta) * 1000;
    frameCount = 0;
    lastTime = now;

    if (element) {
      element.textContent = `${fps | 0} FPS | ${tps | 0} TPS`;
    }
  }
}

/**
 * Get current FPS value
 */
export function getFPS(): number {
  return fps;
}
