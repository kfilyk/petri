// Dashboard - header labels and the highlighted-amoeba stats panel (main thread)

import { H, F, REF } from '../sim/protocol';
import { round } from '../utils/math';
import { type Frame, header, refLabel, hasFocus, focus, focusLabel } from '../ui/frame';

// Cached DOM elements
const els: Record<string, HTMLElement | null> = {};
const lastText: Record<string, string> = {};

const IDS = [
  'dash-live-info', 'dash-newest', 'dash-time', 'dash-highlighted',
  'dash-gold', 'dash-silver', 'dash-bronze', 'amoeba-stats',
  'stats-name', 'stats-idx', 'stats-sibling-idx', 'stats-age', 'stats-energy',
  'stats-size', 'stats-brain-weight', 'stats-damage', 'stats-sensors',
  'stats-red', 'stats-green', 'stats-blue', 'stats-velocity', 'stats-rotation', 'stats-mutation',
];

/**
 * Initialize cached DOM elements
 */
export function initDashboardDom(): void {
  for (const id of IDS) els[id] = document.getElementById(id);
}

/** Write HTML only when it changed, so idle frames cost nothing in layout */
function setHtml(id: string, html: string): void {
  if (lastText[id] === html) return;
  lastText[id] = html;
  const el = els[id];
  if (el) el.innerHTML = html;
}

const FILLED = '█';
const EMPTY = '&nbsp;';

/** -1..1 gauge */
function signedGauge(id: string, prefix: string, value: number): void {
  const sign = value > 0 ? '&nbsp;' : '';
  const clamped = Math.max(-1, Math.min(1, value));
  const magnitude = Math.round(Math.abs(clamped) * 10);

  let left = EMPTY.repeat(10);
  let right = EMPTY.repeat(10);
  if (clamped < 0) left = EMPTY.repeat(10 - magnitude) + FILLED.repeat(magnitude);
  else right = FILLED.repeat(magnitude) + EMPTY.repeat(10 - magnitude);

  setHtml(id, `${prefix} ${left} ${sign}${value.toFixed(2)} ${right}`);
}

/** 0..1 gauge */
function positiveGauge(id: string, prefix: string, current: number, max: number): void {
  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * 20);
  const bar = FILLED.repeat(filled) + EMPTY.repeat(20 - filled);
  setHtml(id, `${prefix} ${bar} ${round(current)}/${round(max)}`);
}

export const dashboard = {
  /**
   * Update header labels and the stats panel from the latest frame
   */
  update(f: Frame): void {
    setHtml('dash-live-info', 'LIVE: ' + header(f, H.LIVE_POP) + '     DEAD: ' + header(f, H.DEAD_COUNT));
    setHtml('dash-time', 'TIME: ' + header(f, H.TIME));

    const newest = refLabel(f, REF.NEWEST);
    if (newest) setHtml('dash-newest', 'NEW: ' + newest);

    const gold = refLabel(f, REF.GOLD);
    const silver = refLabel(f, REF.SILVER);
    const bronze = refLabel(f, REF.BRONZE);
    if (gold) setHtml('dash-gold', gold);
    if (silver) setHtml('dash-silver', silver);
    if (bronze) setHtml('dash-bronze', bronze);

    const highlighted = refLabel(f, REF.HIGHLIGHTED);
    setHtml('dash-highlighted', highlighted ? 'HIGHLIGHTED: ' + highlighted : '');

    const panel = els['amoeba-stats'];
    if (!hasFocus(f)) {
      if (panel && panel.style.display !== 'none') panel.style.display = 'none';
      return;
    }
    if (panel && panel.style.display !== 'block') panel.style.display = 'block';

    this.updateStatsPanel(f);
  },

  updateStatsPanel(f: Frame): void {
    setHtml('stats-name', focusLabel(f));
    setHtml('stats-idx', 'IDX ' + focus(f, F.IDX));

    const sibling = focus(f, F.SIBLING_IDX);
    if (sibling >= 0) setHtml('stats-sibling-idx', 'SIBLING: ' + sibling);

    setHtml('stats-age', 'BORN/AGE: <b>' + focus(f, F.BORN) + '/' + focus(f, F.AGE) + '</b>');
    setHtml('stats-size', 'SIZE: ' + focus(f, F.SIZE).toFixed(1));
    setHtml('stats-brain-weight', 'BRAIN: ' + focus(f, F.BRAIN_WEIGHT).toFixed(1));
    setHtml('stats-damage', round(focus(f, F.DAMAGE_RECEIVED)) + ' >> DMG >> ' + round(focus(f, F.DAMAGE_CAUSED)));

    let sensors = focus(f, F.MOUTH_DETECTED) >= 0 ? 'M ' : '';
    for (let i = 0; i < 5; i++) {
      if (focus(f, F.EYE_DETECTED + i) >= 0) sensors += `E${i + 1} `;
    }
    setHtml('stats-sensors', sensors);

    positiveGauge('stats-energy', 'ϟ&nbsp;', focus(f, F.ENERGY), focus(f, F.MAX_ENERGY));

    signedGauge('stats-red', 'R&nbsp;', focus(f, F.OUT + 3));
    signedGauge('stats-green', 'G&nbsp;', focus(f, F.OUT + 4));
    signedGauge('stats-blue', 'B&nbsp;', focus(f, F.OUT + 5));

    signedGauge('stats-velocity', '∆X', focus(f, F.OUT));      // velocity x
    signedGauge('stats-rotation', '∆Y', focus(f, F.OUT + 1));  // velocity y
    signedGauge('stats-mutation', '∆°', focus(f, F.OUT + 2));  // rotation
  },
};
