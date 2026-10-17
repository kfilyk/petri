// Performance-optimized math utilities
import type { Amoeba } from '@/entities/Amoeba';
import { state } from '../state';
import { NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS } from '@/constants';

/**
 * Fast rounding using bitwise operations
 * Equivalent to Math.round but faster
 */
export function round(r: number): number {
  return (r + (r < 0 ? -0.5 : 0.5)) | 0;
}

/**
 * Generate a random 4-character name
 */
export function generateName(alphabet: string): string {
  let n = '';
  for (let i = 0; i < 4; i++) {
    n += alphabet.charAt(round(Math.random() * 25));
  }
  return n;
}

/**
 * Resolve an amoeba index (positive = alive, negative = graveyard) to its instance.
 */
export function getAmoebaByIndex(idx: number): Amoeba | undefined {
  return idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
}

// ===================================================================================
// KIN DELTA SUMS
// ===================================================================================
//
// Flat layout for "one number per synapse" buffers, shared with the kin table:
//   input neuron i:  [KIN_IN_OFF  + i*2*NO .. +NO) = weights1, then weights2
//   output neuron i: [KIN_OUT_OFF + i*2*NO .. +NO) = weights1, then weights2

export const KIN_IN_OFF = 0;
export const KIN_OUT_OFF = NUM_INPUT_NEURONS * 2 * NUM_OUTPUT_NEURONS;
export const KIN_LEN = (NUM_INPUT_NEURONS + NUM_OUTPUT_NEURONS) * 2 * NUM_OUTPUT_NEURONS;

/** Offset of a neuron's weights1 block in a KIN_LEN buffer (weights2 follows at +NUM_OUTPUT_NEURONS) */
export function kinOffset(type: 'input' | 'output', index: number): number {
  return (type === 'input' ? KIN_IN_OFF : KIN_OUT_OFF) + index * 2 * NUM_OUTPUT_NEURONS;
}

/**
 * Running sums filled by accumulateKinSums(). Preallocated once and reused, so a
 * mitosis allocates nothing no matter how many relatives it has. Read them right
 * after the call; the next call overwrites them.
 */
export const kinAdvSum = new Float32Array(KIN_LEN);
export const kinDisSum = new Float32Array(KIN_LEN);

// Reusable stack for the iterative tree walk
const walkStack: number[] = [];

/** sum += (current − base) × weight, over every synapse */
function addWeightDelta(sum: Float32Array, current: Amoeba, base: Amoeba, weight: number): void {
  let p = KIN_IN_OFF;
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const c1 = current.inputs[i].weights1, b1 = base.inputs[i].weights1;
    const c2 = current.inputs[i].weights2, b2 = base.inputs[i].weights2;
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) sum[p + j] += (c1[j] - b1[j]) * weight;
    p += NUM_OUTPUT_NEURONS;
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) sum[p + j] += (c2[j] - b2[j]) * weight;
    p += NUM_OUTPUT_NEURONS;
  }
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    const c1 = current.outputs[i].weights1, b1 = base.outputs[i].weights1;
    const c2 = current.outputs[i].weights2, b2 = base.outputs[i].weights2;
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) sum[p + j] += (c1[j] - b1[j]) * weight;
    p += NUM_OUTPUT_NEURONS;
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) sum[p + j] += (c2[j] - b2[j]) * weight;
    p += NUM_OUTPUT_NEURONS;
  }
}

/**
 * Accumulate PER-EDGE weight deltas over EVERY descendant of `rootIdx` into
 * kinAdvSum / kinDisSum (no depth cap).
 *
 * Each descendant's delta is measured from its OWN parent, so one delta = one
 * mutation event, and it is labelled by that descendant's own outcome:
 *   - reproduced             -> kinAdvSum, weighted by its number of children
 *   - dead without children  -> kinDisSum, weight 1
 *   - alive without children -> verdict unknown, skipped
 *
 * Returns the weights the sums were built from, so callers can take means:
 *   mean adv delta = kinAdvSum / advCount,  mean dis delta = kinDisSum / disCount
 */
export function accumulateKinSums(rootIdx: number): { advCount: number; disCount: number } {
  kinAdvSum.fill(0);
  kinDisSum.fill(0);
  let advCount = 0;
  let disCount = 0;

  const root = getAmoebaByIndex(rootIdx);
  if (!root) return { advCount, disCount };

  walkStack.length = 0;
  for (let i = 0; i < root.children.length; i++) walkStack.push(root.children[i]);

  while (walkStack.length > 0) {
    const idx = walkStack.pop()!;
    const current = getAmoebaByIndex(idx);
    if (!current) continue;

    for (let i = 0; i < current.children.length; i++) walkStack.push(current.children[i]);

    if (current.parent === null) continue;
    const reproduced = current.children.length > 0;
    const diedChildless = !reproduced && idx < 0;
    if (!reproduced && !diedChildless) continue;

    const base = getAmoebaByIndex(current.parent);
    if (!base) continue;

    if (reproduced) {
      addWeightDelta(kinAdvSum, current, base, current.children.length);
      advCount += current.children.length;
    } else {
      addWeightDelta(kinDisSum, current, base, 1);
      disCount += 1;
    }
  }

  return { advCount, disCount };
}

// ===================================================================================
// BRAIN COMPARISON UTILITIES
// ===================================================================================

/**
 * Get total "brain weight" - sum of absolute values of all weights.
 * Higher = more opinionated connections, lower = more neutral/sparse brain.
 */
export function getBrainWeight(a: Amoeba): number {
  let sum = 0;
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      sum += Math.abs(a.inputs[i].weights1[j]) + Math.abs(a.inputs[i].weights2[j]);
    }
  }
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      sum += Math.abs(a.outputs[i].weights1[j]) + Math.abs(a.outputs[i].weights2[j]);
    }
  }
  return sum;
}

/**
 * Compute cosine similarity between two brains as a percentage.
 *
 * Returns 0-100%:
 *   100% = identical direction (perfectly alike)
 *   50%  = orthogonal (unrelated)
 *   0%   = opposite direction (anti-correlated)
 */
export function getAlikeness(a: Amoeba, b: Amoeba): number {
  let dot = 0, magA = 0, magB = 0;

  // Input → output weights
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      const a1 = a.inputs[i].weights1[j], b1 = b.inputs[i].weights1[j];
      const a2 = a.inputs[i].weights2[j], b2 = b.inputs[i].weights2[j];
      dot += a1 * b1 + a2 * b2;
      magA += a1 * a1 + a2 * a2;
      magB += b1 * b1 + b2 * b2;
    }
  }

  // Output → output weights (recurrent)
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      const a1 = a.outputs[i].weights1[j], b1 = b.outputs[i].weights1[j];
      const a2 = a.outputs[i].weights2[j], b2 = b.outputs[i].weights2[j];
      dot += a1 * b1 + a2 * b2;
      magA += a1 * a1 + a2 * a2;
      magB += b1 * b1 + b2 * b2;
    }
  }

  const cosSim = dot / (Math.sqrt(magA) * Math.sqrt(magB) + 0.0001);
  return ((cosSim + 1) / 2) * 100;
}

/**
 * Compute cosine similarity for a single neuron's outgoing weights.
 * Useful for inspecting which neurons changed most between generations.
 */
export function getNeuronAlikeness(
  a: Amoeba,
  b: Amoeba,
  type: 'input' | 'output',
  index: number
): number {
  const nA = type === 'input' ? a.inputs[index] : a.outputs[index];
  const nB = type === 'input' ? b.inputs[index] : b.outputs[index];

  let dot = 0, magA = 0, magB = 0;
  for (let j = 0; j < nA.weights1.length; j++) {
    const a1 = nA.weights1[j], b1 = nB.weights1[j];
    const a2 = nA.weights2[j], b2 = nB.weights2[j];
    dot += a1 * b1 + a2 * b2;
    magA += a1 * a1 + a2 * a2;
    magB += b1 * b1 + b2 * b2;
  }

  const cosSim = dot / (Math.sqrt(magA) * Math.sqrt(magB) + 0.0001);
  return ((cosSim + 1) / 2) * 100;
}

/**
 * Comprehensive comparison between two amoeba brains.
 * Returns overall alikeness, per-neuron breakdown, and weight magnitudes.
 */
export function compareBrains(a: Amoeba, b: Amoeba): {
  alikeness: number;           // 0-100% overall similarity
  change: number;              // 0-100% overall change (inverse of alikeness)
  weightA: number;             // total brain weight of A
  weightB: number;             // total brain weight of B
  inputNeurons: number[];      // per-input-neuron alikeness (0-100%)
  outputNeurons: number[];     // per-output-neuron alikeness (0-100%)
} {
  const alikeness = getAlikeness(a, b);

  const inputNeurons: number[] = [];
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    inputNeurons.push(getNeuronAlikeness(a, b, 'input', i));
  }

  const outputNeurons: number[] = [];
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    outputNeurons.push(getNeuronAlikeness(a, b, 'output', i));
  }

  return {
    alikeness,
    change: 100 - alikeness,
    weightA: getBrainWeight(a),
    weightB: getBrainWeight(b),
    inputNeurons,
    outputNeurons,
  };
}
