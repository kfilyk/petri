// BrainDisplay - Visualizes neural network of an animal

import {
  BRAINX,
  BRAINY,
  NUM_INPUT_NEURONS,
  NUM_OUTPUT_NEURONS,
  TWOPI,
} from '../constants';
import type { Amoeb } from '../entities/Amoeb';
import { state } from '../state';
import { abs, round } from '../utils/math';

// Layout settings
const LEFT_MARGIN = 80;
const RIGHT_MARGIN = BRAINX - 80;
const TOP_MARGIN = 30;
const BOTTOM_MARGIN = BRAINY - 30;
const NEURON_RADIUS = 12;

// Input labels (must match order in Amoeb.think())
const INPUT_LABELS = [
  'VELX', 'VELY', 'ROT', 'EATN', 'SIZE', 'ECHG',
  'MR', 'MG', 'MB', 'MS',
  'E1R', 'E1G', 'E1B', 'E1S',
  'E2R', 'E2G', 'E2B', 'E2S',
  'E3R', 'E3G', 'E3B', 'E3S',
  'E4R', 'E4G', 'E4B', 'E4S',
  'E5R', 'E5G', 'E5B', 'E5S',
  'B+', 'B-',  // Bias neurons (+1, -1)
];

// Output labels (must match order in Amoeb.think())
const OUTPUT_LABELS = [
  'VELX', 'VELY', 'ROT',
  'EATR', 'EATG', 'EATB',
  'REPR', 'MUT',
  'MX', 'MY',
  'E1X', 'E1Y', 'E2X', 'E2Y', 'E3X', 'E3Y', 'E4X', 'E4Y', 'E5X', 'E5Y',
];

// Pre-calculate neuron positions
const inputPositions: { x: number; y: number }[] = [];
const outputPositions: { x: number; y: number }[] = [];

// Mouse cursor tracking
let cursorX: number | null = null;
let cursorY: number | null = null;

/**
 * Update cursor position (call from mousemove handler)
 */
export function updateBrainCursor(x: number | null, y: number | null): void {
  cursorX = x;
  cursorY = y;
}

const inputSpacing = (BOTTOM_MARGIN - TOP_MARGIN) / (NUM_INPUT_NEURONS - 1);
const outputSpacing = (BOTTOM_MARGIN - TOP_MARGIN) / (NUM_OUTPUT_NEURONS - 1);

for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  inputPositions.push({
    x: LEFT_MARGIN,
    y: TOP_MARGIN + i * inputSpacing,
  });
}

for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
  outputPositions.push({
    x: RIGHT_MARGIN,
    y: TOP_MARGIN + o * outputSpacing,
  });
}

/**
 * Clamp value to [-1, 1] range
 */
function clamp(val: number): number {
  return val > 1 ? 1 : val < -1 ? -1 : val;
}

// Pre-computed color cache for quantized values (-1.0 to 1.0 in 0.1 steps = 41 colors)
const COLOR_STEPS = 21;
const colorCache: string[] = new Array(COLOR_STEPS);
for (let i = 0; i < COLOR_STEPS; i++) {
  const value = (i / (COLOR_STEPS - 1)) * 2 - 1; // -1 to 1
  const red = value < 0 ? 255 : 0;
  const blue = value > 0 ? 255 : 0;
  const alpha = abs(value);
  colorCache[i] = `rgba(${red}, 0, ${blue}, ${alpha})`;
}

/**
 * Get quantized color index for batching (0 to COLOR_STEPS-1)
 */
function getColorIndex(value: number): number {
  const clamped = clamp(value);
  return round((clamped + 1) * (COLOR_STEPS - 1) / 2);
}

/**
 * Get rgba color string for a value (-1 = red, 0 = transparent, 1 = blue)
 */
function getColor(value: number): string {
  return colorCache[getColorIndex(value)];
}

// Line batches grouped by color index
const lineBatches: { x1: number; y1: number; x2: number; y2: number }[][] =
  new Array(COLOR_STEPS).fill(null).map(() => []);

// Cached offscreen canvas for static labels
let labelCanvas: HTMLCanvasElement | null = null;
let labelCanvasReady = false;

/**
 * Initialize the label cache (call once when canvas is ready)
 */
function initLabelCanvas(width: number, height: number): void {
  if (labelCanvasReady) return;

  labelCanvas = document.createElement('canvas');
  labelCanvas.width = width;
  labelCanvas.height = height;
  const lctx = labelCanvas.getContext('2d');
  if (!lctx) return;

  lctx.font = '16px Arial';
  lctx.fillStyle = '#000000';

  // Draw input labels
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const pos = inputPositions[i];
    const label = INPUT_LABELS[i] || `I${i}`;
    lctx.fillText(label, pos.x - 65, pos.y);
  }

  // Draw output labels
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const pos = outputPositions[o];
    const label = OUTPUT_LABELS[o] || `O${o}`;
    lctx.fillText(label, pos.x + 24, pos.y);
  }

  labelCanvasReady = true;
}

/**
 * Draw the brain visualization for an animal
 */
export function drawBrain(animal: Amoeb): void {
  const ctx = state.ctx.stats;
  if (!ctx) return;

  // Initialize label cache on first run
  if (!labelCanvasReady) {
    initLabelCanvas(BRAINX, BRAINY);
  }

  // Clear canvas
  ctx.clearRect(0, 0, BRAINX, BRAINY);

  // Clear all batches
  for (let b = 0; b < COLOR_STEPS; b++) {
    lineBatches[b].length = 0;
  }

  // Batch connections by color
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const inPos = inputPositions[i];
    for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
      const synapseValue = animal.inputs[i].synapse(o);
      const colorIdx = getColorIndex(synapseValue);
      lineBatches[colorIdx].push({
        x1: inPos.x, y1: inPos.y,
        x2: outputPositions[o].x, y2: outputPositions[o].y
      });
    }
  }

  // Draw all batches (one stroke call per color)
  for (let b = 0; b < COLOR_STEPS; b++) {
    const batch = lineBatches[b];
    if (batch.length === 0) continue;

    ctx.strokeStyle = colorCache[b];
    ctx.beginPath();
    for (let j = 0; j < batch.length; j++) {
      const line = batch[j];
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
    }
    ctx.stroke();
  }

  // Draw cached labels
  if (labelCanvas) {
    ctx.drawImage(labelCanvas, 0, 0);
  }

  // Draw input neurons and values
  ctx.font = '16px Arial';
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const pos = inputPositions[i];
    const activation = animal.inputs[i].in;

    ctx.fillStyle = getColor(activation);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, NEURON_RADIUS, 0, TWOPI);
    ctx.fill();

    // Draw dynamic value underneath label
    ctx.fillStyle = '#000000';
    ctx.fillText(activation.toFixed(2), pos.x - 65, pos.y + 14);
  }

  // Draw output neurons and values
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const pos = outputPositions[o];
    let activation = 0;
    if (o < 20) {
      activation = animal.outputs[o].out;

    } else {
      activation = animal.outputs[o].in;
    }

    ctx.fillStyle = getColor(activation);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, NEURON_RADIUS, 0, TWOPI);
    ctx.fill();

    // Draw dynamic value underneath label
    ctx.fillStyle = '#000000';
    ctx.fillText(activation.toFixed(2), pos.x + 24, pos.y + 14);
  }

  // Draw cursor indicator
  if (cursorX !== null && cursorY !== null) {
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 5, 0, TWOPI);
    ctx.fill();
  }

  // Check if neuron weights table needs updating
  updateNeuronWeightsIfNeeded();
}

/**
 * Clear the brain display
 */
export function clearBrain(): void {
  const ctx = state.ctx.stats;
  if (!ctx) return;
  ctx.clearRect(0, 0, BRAINX, BRAINY);
}

/**
 * Check if a click hit a neuron and return its info
 */
export function getNeuronAtPosition(x: number, y: number): { type: 'input' | 'output'; index: number } | null {
  // Check input neurons
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const pos = inputPositions[i];
    const dx = x - pos.x;
    const dy = y - pos.y;
    if (dx * dx + dy * dy <= NEURON_RADIUS * NEURON_RADIUS) {
      return { type: 'input', index: i };
    }
  }

  // Check output neurons
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const pos = outputPositions[o];
    const dx = x - pos.x;
    const dy = y - pos.y;
    if (dx * dx + dy * dy <= NEURON_RADIUS * NEURON_RADIUS) {
      return { type: 'output', index: o };
    }
  }

  return null;
}

/**
 * Check if neuron weights need updating and refresh if so.
 * Call this from the render loop.
 */
export function updateNeuronWeightsIfNeeded(): void {
  const nw = state.neuronWeights;
  if (nw.amoebIndex === null || nw.neuronType === null || nw.neuronIndex === null) {
    return;
  }

  const amoeb = nw.amoebIndex >= 0
    ? state.amoebs[nw.amoebIndex]
    : state.graveyard[-(nw.amoebIndex + 1)];

  if (!amoeb || amoeb.parent === null) return;

  const parent = amoeb.parent >= 0
    ? state.amoebs[amoeb.parent]
    : state.graveyard[-(amoeb.parent + 1)];

  if (parent && parent.descendants !== nw.lastParentDescendants) {
    nw.lastParentDescendants = parent.descendants;
    displayNeuronWeights(amoeb, nw.neuronType, nw.neuronIndex);
  }
}

/**
 * Display weight details for a neuron
 */
export function displayNeuronWeights(amoeb: Amoeb, neuronType: 'input' | 'output', neuronIndex: number): void {
  const container = document.getElementById('neuron-weights');
  if (!container) return;

  // Track for auto-updates via state
  const amoebIndex = state.amoebs.indexOf(amoeb);
  state.neuronWeights.amoebIndex = amoebIndex >= 0 ? amoebIndex : -(state.graveyard.indexOf(amoeb) + 1);
  state.neuronWeights.neuronType = neuronType;
  state.neuronWeights.neuronIndex = neuronIndex;
  if (amoeb.parent !== null) {
    const parent = amoeb.parent >= 0 ? state.amoebs[amoeb.parent] : state.graveyard[-(amoeb.parent + 1)];
    state.neuronWeights.lastParentDescendants = parent ? parent.descendants : -1;
  }

  const label = neuronType === 'input'
    ? (INPUT_LABELS[neuronIndex] || `I${neuronIndex}`)
    : (OUTPUT_LABELS[neuronIndex] || `O${neuronIndex}`);

  // Get base weights
  const neuron = neuronType === 'input' ? amoeb.inputs[neuronIndex] : amoeb.outputs[neuronIndex];
  const numWeights = NUM_OUTPUT_NEURONS;
  const targetLabels = OUTPUT_LABELS;

  // Calculate advantageous and disadvantageous deltas from descendants (matches Amoeb.ts)
  const { advW1, advW2, disW1, disW2, advCount, disCount } = calculateWeightDeltas(amoeb, neuronType, neuronIndex);

  // Build HTML table with both W1 and W2, separator between them
  let html = `<div class="neuron-weights-header">${neuronType.toUpperCase()} ${label}</div>`;
  html += `
    <table class="neuron-weights-table"><thead><tr>
      <th>Target</th>
      <th>W1</th>
      <th>Adv(${advCount})</th>
      <th>Dis(${disCount})</th>
      <th>W1'</th>
      <th class="col-separator"></th>
      <th>W2</th>
      <th>Adv(${advCount})</th>
      <th>Dis(${disCount})</th>
      <th>W2'</th>
    </tr></thead><tbody>`;

  for (let j = 0; j < numWeights; j++) {
    const baseW1 = neuron.weights1[j].toFixed(3);
    const baseW2 = neuron.weights2[j].toFixed(3);

    html += `<tr>
      <td>${targetLabels[j] || j}</td>
      <td class="initial-weights">${baseW1}</td>
      <td class="adv-delta">${advW1[j].toFixed(3)}</td>
      <td class="dis-delta">${disW1[j].toFixed(3)}</td>
      <td>${(neuron.weights1[j] + advW1[j] - disW1[j]).toFixed(3)}</td>
      <td class="col-separator"></td>
      <td class="initial-weights">${baseW2}</td>
      <td class="adv-delta">${advW2[j].toFixed(3)}</td>
      <td class="dis-delta">${disW2[j].toFixed(3)}</td>
      <td>${(neuron.weights2[j] + advW2[j] - disW2[j]).toFixed(3)}</td>
    </tr>`;
  }

  html += '</tbody></table>';
  container.innerHTML = html;
  container.style.display = 'block';
}

interface WeightDeltas {
  advW1: number[];
  advW2: number[];
  disW1: number[];
  disW2: number[];
  advCount: number;
  disCount: number;
}

/**
 * Calculate weight deltas from descendants (matches Amoeb.ts mitosis logic)
 */
function calculateWeightDeltas(amoeb: Amoeb, neuronType: 'input' | 'output', neuronIndex: number): WeightDeltas {
  const numWeights = NUM_OUTPUT_NEURONS;
  const advW1 = new Array(numWeights).fill(0);
  const advW2 = new Array(numWeights).fill(0);
  const disW1 = new Array(numWeights).fill(0);
  const disW2 = new Array(numWeights).fill(0);

  if (amoeb.parent === null) {
    return { advW1, advW2, disW1, disW2, advCount: 0, disCount: 0 };
  }

  const parent = amoeb.parent >= 0 ? state.amoebs[amoeb.parent] : state.graveyard[-(amoeb.parent + 1)];
  if (!parent) return { advW1, advW2, disW1, disW2, advCount: 0, disCount: 0 };

  // Get all descendants (excluding the parent itself, matching Amoeb.getDescendants)
  const descendants = getDescendantIndices(amoeb.parent, amoeb.parent);

  let advCount = 0;
  let disCount = 0;

  for (const idx of descendants) {
    const desc = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
    if (!desc) continue;

    const descNeuron = neuronType === 'input' ? desc.inputs[neuronIndex] : desc.outputs[neuronIndex];
    const parentNeuron = neuronType === 'input' ? parent.inputs[neuronIndex] : parent.outputs[neuronIndex];

    if (desc.children.length > 0) {
      // Advantageous: has children (reproduced successfully)
      for (let j = 0; j < numWeights; j++) {
        advW1[j] += descNeuron.weights1[j] - parentNeuron.weights1[j];
        advW2[j] += descNeuron.weights2[j] - parentNeuron.weights2[j];
      }
      advCount++;
    } else {
      // Disadvantageous: no children (hasn't reproduced yet or died without reproducing)
      for (let j = 0; j < numWeights; j++) {
        disW1[j] += descNeuron.weights1[j] - parentNeuron.weights1[j];
        disW2[j] += descNeuron.weights2[j] - parentNeuron.weights2[j];
      }
      disCount++;
    }
  }

  // Average the deltas
  if (advCount > 0) {
    for (let j = 0; j < numWeights; j++) {
      advW1[j] /= advCount;
      advW2[j] /= advCount;
    }
  }
  if (disCount > 0) {
    for (let j = 0; j < numWeights; j++) {
      disW1[j] /= disCount;
      disW2[j] /= disCount;
    }
  }

  return { advW1, advW2, disW1, disW2, advCount, disCount };
}

/**
 * Get all descendant indices recursively (matches Amoeb.getDescendants)
 */
function getDescendantIndices(idx: number, orig: number): number[] {
  const indices: number[] = [];
  const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
  if (!current) return indices;

  for (const childIdx of current.children) {
    indices.push(...getDescendantIndices(childIdx, orig));
  }

  // Exclude the original starting node from results
  if (idx !== orig) {
    indices.push(idx);
  }

  return indices;
}

/**
 * Hide the neuron weights display
 */
export function hideNeuronWeights(): void {
  const container = document.getElementById('neuron-weights');
  if (container) {
    container.style.display = 'none';
  }
  // Clear tracking state
  state.neuronWeights.amoebIndex = null;
  state.neuronWeights.neuronType = null;
  state.neuronWeights.neuronIndex = null;
  state.neuronWeights.lastParentDescendants = -1;
}
