// Performance-optimized math utilities

/**
 * Fast rounding using bitwise operations
 * Equivalent to Math.round but faster
 */
export function round(r: number): number {
  return (r + (r < 0 ? -0.5 : 0.5)) | 0;
}

/**
 * Fast absolute value
 */
export function abs(x: number): number {
  return x > 0 ? x : -x;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
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
