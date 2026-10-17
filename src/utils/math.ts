// Performance-optimized math utilities
import { Amoeba } from '@/entities/Amoeba';
import { state } from '../state';
import { WeightDeltas } from '@/types';
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

export function getDescendantIndices(idx: number, orig: number): number[] {
  const indices: number[] = [];
  const current = getAmoebaByIndex(idx);
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
   * Calculate weight deltas between current and base animal
   */
  export function getWeightDeltas(current: Amoeba, base: Amoeba): WeightDeltas {
    const sustain_delta:number = 0;
    const in_weights1_deltas: number[][] = [];
    const in_weights2_deltas: number[][] = [];
    const out_weights1_deltas: number[][] = [];
    const out_weights2_deltas: number[][] = [];

    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      const w1_deltas: number[] = [];
      const w2_deltas: number[] = [];
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        w1_deltas[j] = current.inputs[i].weights1[j] - base.inputs[i].weights1[j];
        w2_deltas[j] = current.inputs[i].weights2[j] - base.inputs[i].weights2[j];
      }
      in_weights1_deltas.push(w1_deltas);
      in_weights2_deltas.push(w2_deltas);
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      const w1_deltas: number[] = [];
      const w2_deltas: number[] = [];
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        w1_deltas[j] = current.outputs[i].weights1[j] - base.outputs[i].weights1[j];
        w2_deltas[j] = current.outputs[i].weights2[j] - base.outputs[i].weights2[j];
      }
      out_weights1_deltas.push(w1_deltas);
      out_weights2_deltas.push(w2_deltas);
    }

    return {
      in_weights1_deltas, in_weights2_deltas, out_weights1_deltas, out_weights2_deltas,
    };
  }

/**
 * Collect PER-EDGE weight deltas across every descendant of `rootIdx`.
 *
 * Each descendant's delta is measured from its OWN parent, so one delta = one
 * mutation event, and it is labelled by that descendant's own outcome:
 *   - reproduced            -> advantageous (pushed once per child, as a fitness weight)
 *   - dead without children -> disadvantageous
 *   - alive without children -> verdict unknown, skipped
 *
 * Measuring from the direct parent (rather than from `rootIdx`) stops a dead
 * grandchild's delta from carrying its successful parent's mutation along with it.
 */
export function collectKinDeltas(rootIdx: number): {
  advantageous: WeightDeltas[];
  disadvantageous: WeightDeltas[];
} {
  const advantageous: WeightDeltas[] = [];
  const disadvantageous: WeightDeltas[] = [];

  const descendants = getDescendantIndices(rootIdx, rootIdx);
  for (let i = 0; i < descendants.length; i++) {
    const idx = descendants[i];
    const current = getAmoebaByIndex(idx);
    if (!current || current.parent === null) continue;

    const reproduced = current.children.length > 0;
    const diedChildless = !reproduced && idx < 0;
    if (!reproduced && !diedChildless) continue;

    const base = getAmoebaByIndex(current.parent);
    if (!base) continue;

    const deltas = getWeightDeltas(current, base);
    if (reproduced) {
      for (let c = 0; c < current.children.length; c++) {
        advantageous.push(deltas);
      }
    } else {
      disadvantageous.push(deltas);
    }
  }

  return { advantageous, disadvantageous };
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