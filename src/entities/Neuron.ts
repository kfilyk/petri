// Neuron class - Performance critical, uses Float32Array for weights

export class Neuron {
  // One connection for every other neuron in brain
  weights1: Float32Array = new Float32Array(0);
  weights2: Float32Array = new Float32Array(0);
  // decays: Float32Array = new Float32Array(0);

  in: number = 0;
  out: number = 0;
  // Learnable output memory (output neurons only): out = sustain·out + (1−sustain)·in.
  // 0 = output tracks input instantly; 1 = output never changes.
  // Mutated like a weight (noise + erosion toward 0), clamped to [0, 1].
  sustain: number = 0;

  /**
   * Initialize neuron with specified number of connections
   * @param connections - Total number of output neurons to connect to
   * @param initialized - Number of connections to initialize with random weights
   */
  init(connections: number, initialized: number): void {
    this.weights1 = new Float32Array(connections).fill(0);
    this.weights2 = new Float32Array(connections).fill(0);
    // this.decays = new Float32Array(connections).fill(0.5);

    for (let i = 0; i < initialized; i++) {
      this.weights1[i] = Math.random() + Math.random() - 1;
      this.weights2[i] = Math.random() + Math.random() - 1;
    }
  }

  /**
   * Calculate synapse contribution to target neuron
   * Uses positive/negative weight branches based on input sign
   * @param idx - Index of target neuron
   * @returns Weighted contribution
   */
  // synapse(idx: number): number {
  //   return this.in > 0
  //     ? this.in * this.weights1[idx]
  //     : this.in * this.weights2[idx];
  // }

  /**
   * Hyperbolic tangent activation (currently unused)
   * Kept for potential future use
   */
  tanh(): void {
    // Fastest implementation found (~130ms for 10M operations)
    this.out = (Math.exp(2 * this.in) - 1) / (Math.exp(2 * this.in) + 1);
  }
}
