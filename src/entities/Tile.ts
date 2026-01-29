// Tile class - Represents a food-producing grid cell
import { round } from '../utils/math';

export class Tile {
  x: number;
  y: number;
  num: number;
  neighbors: number[];
  regenRate: number;

  // Capacity values (maximum food levels)
  RCap: number;
  GCap: number;
  BCap: number;

  // Current food levels
  R: number;
  G: number;
  B: number;

  constructor(x: number, y: number, num: number, neighbors: number[]) {
    this.x = x;
    this.y = y;
    this.num = num;
    this.neighbors = neighbors;
    this.regenRate = Math.random() * 0.1 + 0.05;

    // Initialize capacity with random values
    this.RCap = round(Math.random() * 100) + 50;  // 50-150
    this.GCap = round(Math.random() * 100) + 100; // 100-200
    this.BCap = round(Math.random() * 75) + 25;   // 25-100

    // Start at full capacity
    this.R = this.RCap;
    this.G = this.GCap;
    this.B = this.BCap;
  }

  /**
   * Regenerate food up to capacity
   */
  regenerate(): void {
    if (this.R < this.RCap) {
      this.R += this.regenRate;
    }
    if (this.G < this.GCap) {
      this.G += this.regenRate;
    }
    if (this.B < this.BCap) {
      this.B += this.regenRate;
    }
  }
}
