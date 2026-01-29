// Neuron class - Performance critical, uses Float32Array for weights

export class Neuron {
  // One connection for every other neuron in brain
  weights1: Float32Array = new Float32Array(0);
  weights2: Float32Array = new Float32Array(0);
  sigmas1: Float32Array = new Float32Array(0); // Per-synapse mutation rate for weights1
  sigmas2: Float32Array = new Float32Array(0); // Per-synapse mutation rate for weights2

  in: number = 0;
  out: number = 0;

  /**
   * Initialize neuron with specified number of connections
   * @param connections - Total number of output neurons to connect to
   * @param initialized - Number of connections to initialize with random weights
   */
  init(connections: number, initialized: number): void {
    this.weights1 = new Float32Array(connections).fill(0);
    this.weights2 = new Float32Array(connections).fill(0);
    this.sigmas1 = new Float32Array(connections).fill(0);
    this.sigmas2 = new Float32Array(connections).fill(0);

    for (let i = 0; i < initialized; i++) {
      this.weights1[i] = Math.random() + Math.random() - 1;
      this.weights2[i] = Math.random() + Math.random() - 1;
    }
  }

  /**
   * Clamp output to [-1, 1] range
   * Calculates activation from input
   */
  clamp(): void {
    this.out = this.in > 1 ? 1 : this.in < -1 ? -1 : this.in;
  }

  /**
   * Calculate synapse contribution to target neuron
   * Uses positive/negative weight branches based on input sign
   * @param idx - Index of target neuron
   * @returns Weighted contribution
   */
  synapse(idx: number): number {
    return this.in > 0
      ? this.in * this.weights1[idx]
      : this.in * this.weights2[idx];
  }

  /**
   * Hyperbolic tangent activation (currently unused)
   * Kept for potential future use
   */
  tanh(): void {
    // Fastest implementation found (~130ms for 10M operations)
    this.out = (Math.exp(2 * this.in) - 1) / (Math.exp(2 * this.in) + 1);
  }
}
