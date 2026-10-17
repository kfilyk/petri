// Benchmark: current think() vs optimized variants
// Run with: npx tsx src/benchmark.ts

import { NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS } from './constants';

// Minimal Neuron replica for benchmarking
class Neuron {
  weights1: Float32Array;
  weights2: Float32Array;
  in: number = 0;
  out: number = 0;

  constructor(size: number) {
    this.weights1 = new Float32Array(size);
    this.weights2 = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      this.weights1[i] = Math.random() * 2 - 1;
      this.weights2[i] = Math.random() * 2 - 1;
    }
  }

  synapse(idx: number): number {
    return this.in > 0
      ? this.in * this.weights1[idx]
      : this.in * this.weights2[idx];
  }
}

// Set up neurons with random weights and inputs
const inputs: Neuron[] = [];
const outputs: Neuron[] = [];

for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  const n = new Neuron(NUM_OUTPUT_NEURONS);
  n.in = Math.random() * 2 - 1;
  inputs.push(n);
}
for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  const n = new Neuron(NUM_OUTPUT_NEURONS);
  n.in = Math.random() * 2 - 1;
  n.out = Math.random() * 2 - 1;
  outputs.push(n);
}

// ─── A) Current implementation: synapse() calls with branch ─────────

function thinkCurrent(): void {
  let input = 0;
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
      input += inputs[j].synapse(o);
    }
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      if (j !== o) {
        input += outputs[j].synapse(o);
      }
    }
    outputs[o].in = input;
    input = 0;
  }
  for (let o = 0; o < 22; o++) {
    const n = outputs[o];
    n.out = Math.min(Math.max(n.in, -1), 1);
  }
}

// ─── B) Inlined synapse (no function call, same branch) ─────────────

function thinkInlined(): void {
  let sum = 0;
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
      const n = inputs[j];
      sum += n.in > 0 ? n.in * n.weights1[o] : n.in * n.weights2[o];
    }
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      if (j !== o) {
        const n = outputs[j];
        sum += n.in > 0 ? n.in * n.weights1[o] : n.in * n.weights2[o];
      }
    }
    outputs[o].in = sum;
    sum = 0;
  }
  for (let o = 0; o < 22; o++) {
    const n = outputs[o];
    n.out = Math.min(Math.max(n.in, -1), 1);
  }
}

// ─── C) Branchless: pos*w1 + neg*w2 ────────────────────────────────

const inPos = new Float32Array(NUM_INPUT_NEURONS);
const inNeg = new Float32Array(NUM_INPUT_NEURONS);
const outPos = new Float32Array(NUM_OUTPUT_NEURONS);
const outNeg = new Float32Array(NUM_OUTPUT_NEURONS);

function thinkBranchless(): void {
  for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
    const v = inputs[j].in;
    inPos[j] = v > 0 ? v : 0;
    inNeg[j] = v < 0 ? v : 0;
  }
  for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
    const v = outputs[j].in;
    outPos[j] = v > 0 ? v : 0;
    outNeg[j] = v < 0 ? v : 0;
  }

  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    let sum = 0;
    for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
      sum += inPos[j] * inputs[j].weights1[o] + inNeg[j] * inputs[j].weights2[o];
    }
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      if (j !== o) {
        sum += outPos[j] * outputs[j].weights1[o] + outNeg[j] * outputs[j].weights2[o];
      }
    }
    outputs[o].in = sum;
  }
  for (let o = 0; o < 22; o++) {
    const n = outputs[o];
    n.out = Math.min(Math.max(n.in, -1), 1);
  }
}

// ─── D) Pre-select weight array per neuron ──────────────────────────

function thinkPreselect(): void {
  // Pick which weight array to use once per neuron, not per synapse
  let sum = 0;
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
      const n = inputs[j];
      const w = n.in > 0 ? n.weights1 : n.weights2;
      sum += n.in * w[o];
    }
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      if (j !== o) {
        const n = outputs[j];
        const w = n.in > 0 ? n.weights1 : n.weights2;
        sum += n.in * w[o];
      }
    }
    outputs[o].in = sum;
    sum = 0;
  }
  for (let o = 0; o < 22; o++) {
    const n = outputs[o];
    n.out = Math.min(Math.max(n.in, -1), 1);
  }
}

// ─── Verify correctness ─────────────────────────────────────────────

function snapshot(): number[] {
  return outputs.map(o => o.in);
}

function resetOutputs(): void {
  for (const o of outputs) { o.in = 0; o.out = 0.5; }
}

// All variants should produce identical results from the same state
resetOutputs();
thinkCurrent();
const baseline = snapshot();

const variants: [string, () => void][] = [
  ['B) Inlined', thinkInlined],
  ['C) Branchless', thinkBranchless],
  ['D) Preselect', thinkPreselect],
];

for (const [name, fn] of variants) {
  resetOutputs();
  fn();
  const result = snapshot();
  let maxDiff = 0;
  for (let i = 0; i < baseline.length; i++) {
    maxDiff = Math.max(maxDiff, Math.abs(baseline[i] - result[i]));
  }
  console.log(`${name} — max diff from baseline: ${maxDiff.toExponential(3)} ${maxDiff < 0.001 ? 'OK' : 'MISMATCH'}`);
}

// ─── Benchmark ──────────────────────────────────────────────────────

const ITERATIONS = 1_000_000;
const WARMUP = 200_000;

const allVariants: [string, () => void][] = [
  ['A) Current (synapse calls)', thinkCurrent],
  ['B) Inlined (same branch)',   thinkInlined],
  ['C) Branchless (pos/neg)',    thinkBranchless],
  ['D) Preselect (w = in>0?w1:w2)', thinkPreselect],
];

// Warmup all
for (const [, fn] of allVariants) {
  for (let i = 0; i < WARMUP; i++) fn();
}

console.log(`\n--- ${ITERATIONS.toLocaleString()} iterations ---`);

const times: number[] = [];
for (const [name, fn] of allVariants) {
  const t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) fn();
  const elapsed = performance.now() - t0;
  times.push(elapsed);
  console.log(`${name}: ${elapsed.toFixed(1)}ms  (${(elapsed / ITERATIONS * 1000).toFixed(2)}µs/call)`);
}

const fastest = Math.min(...times);
console.log(`\nRelative to fastest:`);
for (let i = 0; i < allVariants.length; i++) {
  console.log(`  ${allVariants[i][0]}: ${(times[i] / fastest).toFixed(2)}x`);
}
