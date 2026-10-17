// =============================================================================
// frame.ts — typed read helpers over a frame snapshot (main thread)
// =============================================================================
//
// A frame is just a Float32Array (see sim/protocol.ts for the layout). Reading
// it directly means writing `f[REF_OFF + slot * REF_STRIDE + R.GEN]` all over
// the UI, which is error-prone. These helpers give the common reads a name.
//
// None of these copy anything; they index into the same buffer the worker
// filled. They are all O(1) except where noted.

import {
  H, HEADER_OFF,
  R, REF_OFF, REF_STRIDE,
  F, FOCUS_OFF,
  A, AMOEBA_OFF, AMOEBA_STRIDE,
  nameFromCodes,
  formatLabel,
} from '../sim/protocol';

/** A frame is a Float32Array view over one of the two shared frame buffers. */
export type Frame = Float32Array;

// ─── Header ─────────────────────────────────────────────────────────────────

/** Read one header scalar, e.g. header(f, H.TIME). */
export function header(f: Frame, key: number): number {
  return f[HEADER_OFF + key];
}

/** Index of the selected amoeba (negative = graveyard record), or null if none. */
export function highlightedIdx(f: Frame): number | null {
  return header(f, H.HAS_HIGHLIGHTED) ? header(f, H.HIGHLIGHTED) : null;
}

/** Index of the most recently born amoeba, or null. */
export function newestIdx(f: Frame): number | null {
  return header(f, H.HAS_NEWEST) ? header(f, H.NEWEST) : null;
}

/** Live index of a medal holder (pass H.GOLD / H.SILVER / H.BRONZE), or null. */
export function medalIdx(f: Frame, key: number): number | null {
  const v = header(f, key);
  return v < 0 ? null : v;
}

// ─── Named references (dashboard labels) ────────────────────────────────────

/**
 * Dashboard label ("NAME-genA12") for one of the REF slots
 * (REF.HIGHLIGHTED, REF.NEWEST, REF.GOLD, ...), or null if that slot is empty.
 */
export function refLabel(f: Frame, slot: number): string | null {
  const off = REF_OFF + slot * REF_STRIDE;
  if (!f[off + R.VALID]) return null;
  return formatLabel(
    nameFromCodes(f, off + R.NAME0),
    f[off + R.GEN],
    f[off + R.ALIVE] === 1,
    f[off + R.DESCENDANTS]
  );
}

// ─── Focus block (the highlighted amoeba) ───────────────────────────────────

/** True if the FOCUS block holds data this frame (an amoeba is selected and was found). */
export function hasFocus(f: Frame): boolean {
  return header(f, H.HAS_FOCUS) === 1;
}

/** Read one focus field, e.g. focus(f, F.ENERGY). Only meaningful when hasFocus(f). */
export function focus(f: Frame, key: number): number {
  return f[FOCUS_OFF + key];
}

export function focusName(f: Frame): string {
  return nameFromCodes(f, FOCUS_OFF + F.NAME0);
}

/** "NAME-genA12" for the highlighted amoeba. */
export function focusLabel(f: Frame): string {
  return formatLabel(focusName(f), focus(f, F.GEN), focus(f, F.STATUS) === 0, focus(f, F.DESCENDANTS));
}

// ─── Amoeba records ─────────────────────────────────────────────────────────

/** How many amoeba records are in this frame (alive + decaying husks). */
export function amoebaCount(f: Frame): number {
  return header(f, H.AMOEBA_COUNT);
}

/**
 * Offset of the i-th amoeba record. Fields are then read as f[off + A.X] etc.
 * Typical loop:
 *     for (let i = 0; i < amoebaCount(f); i++) { const o = amoebaOff(i); ... f[o + A.SIZE] ... }
 */
export function amoebaOff(i: number): number {
  return AMOEBA_OFF + i * AMOEBA_STRIDE;
}

/** "NAME-genA12" for the amoeba record starting at `off`. */
export function amoebaLabel(f: Frame, off: number): string {
  return formatLabel(
    nameFromCodes(f, off + A.NAME0),
    f[off + A.GEN],
    f[off + A.STATUS] === 0,
    f[off + A.DESCENDANTS]
  );
}

// ─── Brain block ────────────────────────────────────────────────────────────

/** True if the BRAIN block was filled this frame (brain panel open + amoeba selected). */
export function hasBrain(f: Frame): boolean {
  return header(f, H.HAS_BRAIN) === 1;
}
