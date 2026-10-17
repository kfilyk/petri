// =============================================================================
// renderer.ts — draws the map canvas from a frame snapshot (main thread)
// =============================================================================
//
// Before the worker split, each Amoeba drew itself (Amoeba.draw) and the tile
// system drew the terrain, both reading live objects. Now the live objects are
// on another thread, so drawing reads the frame buffer instead. This file is
// those drawing routines, ported field-for-field:
//
//   Amoeba.draw        → drawBody / drawAmoebas
//   Amoeba.highlight   → drawHighlight
//   TileSystem.update  → drawTiles
//
// drawFrame() is called every animation frame by main.ts, even when no new
// snapshot arrived (the camera may have moved). It never mutates the frame.

import { FIELDX, FIELDY, TILE_SIZE, TILENUMBER, GRID_W, GRID_H, TWOPI, DEG_TO_RAD } from '../constants';
import { H, F, A, TILE_OFF, TILE_STRIDE, FOCUS_OFF } from '../sim/protocol';
import { round } from '../utils/math';
import { view } from './viewState';
import { type Frame, header, amoebaCount, amoebaOff, amoebaLabel, hasFocus, focusLabel, highlightedIdx } from './frame';

// ─── Offscreen tile buffer ──────────────────────────────────────────────────
// Drawing 2304 tiles as rectangles every frame would be slow. Instead we keep
// a tiny canvas with ONE PIXEL PER TILE, write the tile colours into its
// ImageData, and then draw that canvas scaled up to the full field with image
// smoothing off, so each pixel becomes a crisp square.
const tileCanvas = document.createElement('canvas');
tileCanvas.width = GRID_W;
tileCanvas.height = GRID_H;
const tileCtx = tileCanvas.getContext('2d', { alpha: false })!;
const tileImageData = tileCtx.createImageData(GRID_W, GRID_H);
const tileBuf = tileImageData.data; // Uint8ClampedArray: RGBA, 4 bytes per tile

const BG = '#303030';

/** Food level → displayed channel: floor at 48 so depleted tiles stay visible, cap at 255. */
function clamp48(v: number): number {
  return v < 255 ? (v > 48 ? v : 48) : 255;
}

/** The up/down/left/right neighbours of a tile index (same rule TileSystem.generate uses). */
function tileNeighbors(ti: number): number[] {
  const out: number[] = [];
  if (ti >= GRID_W) out.push(ti - GRID_W);
  if (ti < TILENUMBER - GRID_W) out.push(ti + GRID_W);
  if (ti % GRID_W !== 0) out.push(ti - 1);
  if ((ti + 1) % GRID_W !== 0) out.push(ti + 1);
  return out;
}

function drawTiles(ctx: CanvasRenderingContext2D, f: Frame): void {
  // Tile RGB from the frame → pixels
  let p = TILE_OFF;
  for (let i = 0; i < TILENUMBER; i++) {
    const off = i * 4;
    tileBuf[off] = clamp48(f[p]);
    tileBuf[off + 1] = clamp48(f[p + 1]);
    tileBuf[off + 2] = clamp48(f[p + 2]);
    tileBuf[off + 3] = 255;
    p += TILE_STRIDE;
  }

  tileCtx.putImageData(tileImageData, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tileCanvas, 0, 0, FIELDX, FIELDY);

  // Hover overlay: print the food numbers on the tile under the mouse and its
  // neighbours (or the tile index while the left button is held).
  if (view.mouse.overMap) {
    const tx = Math.floor(view.mouse.x / TILE_SIZE);
    const ty = Math.floor(view.mouse.y / TILE_SIZE);
    if (tx >= 0 && tx < GRID_W && ty >= 0 && ty < GRID_H) {
      const ti = ty * GRID_W + tx;
      ctx.font = '8px monospace';
      const show = [ti, ...tileNeighbors(ti)];
      for (const idx of show) {
        const r = f[TILE_OFF + idx * TILE_STRIDE];
        const g = f[TILE_OFF + idx * TILE_STRIDE + 1];
        const b = f[TILE_OFF + idx * TILE_STRIDE + 2];
        const x = (idx % GRID_W) * TILE_SIZE;
        const y = Math.floor(idx / GRID_W) * TILE_SIZE;
        ctx.fillStyle = `rgb(${r - 32},${g - 32},${b - 32})`;
        if (view.mouse.leftPressed) {
          ctx.fillText(String(idx), x + 2, y + 25);
        } else {
          ctx.fillText(String(round(r)), x + 2, y + 9);
          ctx.fillText(String(round(g)), x + 2, y + 16);
          ctx.fillText(String(round(b)), x + 2, y + 23);
        }
      }
    }
  }
}

/**
 * Draw one amoeba body: five eyes, the body, the mouth. Colour comes from
 * brain outputs 3..5 (the eat-R/G/B preferences), exactly as Amoeba.draw did:
 * body = 50 + |out|·205, mouth +40 brighter, eyes +80 brighter.
 *
 * Takes plain numbers plus an accessor for eye coordinates so it can serve both
 * a live amoeba record (A.* fields) and the focus block (F.* fields).
 */
function drawBody(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  out3: number, out4: number, out5: number,
  mouthX: number, mouthY: number,
  eyeXY: (k: number) => number
): void {
  const c0 = 50 + round(Math.abs(out3) * 205);
  const c1 = 50 + round(Math.abs(out4) * 205);
  const c2 = 50 + round(Math.abs(out5) * 205);

  // Eyes
  const er = size / 4;
  ctx.fillStyle = `rgb(${c0 + 80},${c1 + 80},${c2 + 80})`;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(eyeXY(i * 2), eyeXY(i * 2 + 1), er, 0, TWOPI);
    ctx.fill();
  }

  // Body
  ctx.fillStyle = `rgb(${c0},${c1},${c2})`;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, TWOPI);
  ctx.fill();

  // Mouth
  ctx.fillStyle = `rgb(${c0 + 40},${c1 + 40},${c2 + 40})`;
  ctx.beginPath();
  ctx.arc(mouthX, mouthY, size / 2, 0, TWOPI);
  ctx.fill();
}

/** Is the mouse within 50 world units of (x, y)? Used for hover labels. */
function mouseNear(x: number, y: number): boolean {
  return (
    view.mouse.overMap &&
    view.mouse.x >= x - 50 && view.mouse.x < x + 50 &&
    view.mouse.y >= y - 50 && view.mouse.y < y + 50
  );
}

/** Every amoeba record in the frame: body, and its name label when hovered. */
function drawAmoebas(ctx: CanvasRenderingContext2D, f: Frame): void {
  const n = amoebaCount(f);
  const highlighted = highlightedIdx(f);
  ctx.font = '10px Arial';

  for (let i = 0; i < n; i++) {
    const o = amoebaOff(i);
    const x = f[o + A.X];
    const y = f[o + A.Y];
    const size = f[o + A.SIZE];

    drawBody(
      ctx, x, y, size,
      f[o + A.OUT + 3], f[o + A.OUT + 4], f[o + A.OUT + 5],
      f[o + A.MOUTH_X], f[o + A.MOUTH_Y],
      (k) => f[o + A.EYE_XY + k]
    );

    // Show name on hover (the highlighted one gets its label from drawHighlight)
    if (mouseNear(x, y) && highlighted !== f[o + A.IDX]) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(amoebaLabel(f, o), x + 2 * size, y - 2 * size + 2);
    }
  }
}

/**
 * The selection overlay for the highlighted amoeba: a white box, red/blue
 * velocity lines, a white rotation indicator, eye outlines on hover, and the
 * name. Port of Amoeba.highlight(), reading the FOCUS block.
 */
function drawHighlight(ctx: CanvasRenderingContext2D, f: Frame): void {
  if (!hasFocus(f)) return;
  const o = FOCUS_OFF;
  const x = f[o + F.X];
  const y = f[o + F.Y];
  const s = f[o + F.SIZE];
  const alive = f[o + F.STATUS] === 0;

  // A dead/decaying highlighted amoeba is not in the amoeba records (or is
  // only there as a husk), so draw its body here from the focus data: a ghost
  // where it was last seen.
  if (!alive) {
    drawBody(
      ctx, x, y, s,
      f[o + F.OUT + 3], f[o + F.OUT + 4], f[o + F.OUT + 5],
      f[o + F.MOUTH_X], f[o + F.MOUTH_Y],
      (k) => f[o + F.EYE_XY + k]
    );
  }

  // Highlight box
  ctx.beginPath();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeRect(x - 2 * s, y - 2 * s, s * 4, s * 4);

  const direction = f[o + F.DIRECTION];
  const dirRad = direction * DEG_TO_RAD;
  const out0 = f[o + F.OUT];      // velocity X (forward/back)
  const out1 = f[o + F.OUT + 1];  // velocity Y (strafe)
  const out2 = f[o + F.OUT + 2];  // rotation

  // velocityX as red line (forward/backward)
  ctx.beginPath();
  ctx.strokeStyle = '#FF0000';
  const velXEndX = x + out0 * 10 * Math.cos(dirRad);
  const velXEndY = y + out0 * 10 * Math.sin(dirRad);
  ctx.moveTo(x, y);
  ctx.lineTo(velXEndX, velXEndY);
  ctx.stroke();

  // velocityY as blue line (strafe)
  ctx.beginPath();
  ctx.strokeStyle = '#0088FF';
  ctx.moveTo(x, y);
  ctx.lineTo(x + out1 * 10 * Math.sin(dirRad), y - out1 * 10 * Math.cos(dirRad));
  ctx.stroke();

  // Rotation indicator (white, from the end of the direction arrow). Its side
  // flips with the sign of the actual forward velocity, as in the original.
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  const perp = (direction - 90) * DEG_TO_RAD;
  const sign = f[o + F.VELOCITY_X] > 0 ? -1 : 1;
  ctx.moveTo(velXEndX, velXEndY);
  ctx.lineTo(velXEndX + sign * out2 * 10 * Math.cos(perp), velXEndY + sign * out2 * 10 * Math.sin(perp));
  ctx.stroke();

  // Eye outlines on hover
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = '#FFFFFF';
  if (mouseNear(x, y)) {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(f[o + F.EYE_XY + i * 2], f[o + F.EYE_XY + i * 2 + 1], s / 4, 0, TWOPI);
      ctx.stroke();
    }
  }
  ctx.lineWidth = 1;

  // Name
  if (alive) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(focusLabel(f), x + 2 * s, y - 2 * s + 2);
  }
}

/**
 * Draw a whole frame: clear, tiles, amoebas, selection overlay.
 * `f` may be null before the first snapshot arrives (just clears).
 *
 * The canvas context carries the camera transform (pan + zoom) set by the
 * input handler, so everything below is drawn in world coordinates. Only the
 * background clear temporarily resets the transform to cover the full canvas.
 */
export function drawFrame(f: Frame | null): void {
  const ctx = view.ctx;
  if (!ctx) return;

  // Clear using untransformed coordinates
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();

  if (!f) return;

  drawTiles(ctx, f);
  drawAmoebas(ctx, f);
  drawHighlight(ctx, f);
  void H; // (header constants are documented in protocol.ts; imported for reference)
}
