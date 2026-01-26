// Tile class - Represents a food-producing grid cell

import { TILE_SIZE } from '../constants';
import { round } from '../utils/math';
import type { RenderContext } from '../types';

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
   * Draw the tile on the canvas
   */
  draw(
    ctx: RenderContext,
    mouseOverMap: boolean,
    mouseX: number,
    mouseY: number,
    leftPressed: boolean
  ): void {
    // Draw tile with minimum brightness of 50
    const r = this.R < 50 ? 50 : round(this.R);
    const g = this.G < 50 ? 50 : round(this.G);
    const b = this.B < 50 ? 50 : round(this.B);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);

    // Show tile info on hover
    if (mouseOverMap && mouseX > this.x - 25 && mouseX < this.x + 50 &&
        mouseY > this.y - 25 && mouseY < this.y + 50) {
      const rDark = this.R - 30 < 0 ? 0 : round(this.R) - 30;
      const gDark = this.G - 30 < 0 ? 0 : round(this.G) - 30;
      const bDark = this.B - 30 < 0 ? 0 : round(this.B) - 30;
      ctx.fillStyle = `rgb(${rDark},${gDark},${bDark})`;

      if (!leftPressed) {
        ctx.fillText(this.num.toString(), this.x, this.y + 25);
      } else if (mouseX > this.x && mouseX < this.x + 25 &&
                 mouseY > this.y && mouseY < this.y + 25) {
        ctx.fillText(round(this.R).toString(), this.x, this.y + 8);
        ctx.fillText(round(this.G).toString(), this.x, this.y + 16);
        ctx.fillText(round(this.B).toString(), this.x, this.y + 25);
      }
    }
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
