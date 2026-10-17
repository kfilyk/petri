// Mouth creature component - Used for eating tiles and other amoebs

import { DEG_TO_RAD, FIELDX, FIELDY, TILE_SIZE, GRID_W } from '../constants';
import { state } from '../state';

export class Mouth {
  x: number;
  y: number;
  tile: number | null = null;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  s: number = 0;
  detected: number = -1; // stores id of possible detected amoeba

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Update mouth position based on amoeba direction and mouth offset
   *
   * Note: mouthY is forward, mouthX is strafe (matches original polar method)
   */
  move(animalDir: number, animalX: number, animalY: number, mouthX: number, mouthY: number): void {
    // Rotation matrix: mouthY is forward (+X at dir=0), mouthX is strafe right (+Y at dir=0)
    const rad = animalDir * DEG_TO_RAD;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    this.x = animalX + mouthY * cos - mouthX * sin;
    this.y = animalY + mouthY * sin + mouthX * cos;
  }

  /**
   * Sense what the mouth can see at its current position
   * Sets RGB values from tile or -1 if out of bounds (poisonous)
   */
  sense(): void {
    this.detected = -1;
    this.s = 0;

    if (this.x >= 0 && this.y >= 0 && this.x < FIELDX && this.y < FIELDY) {
      // Calculate tile index using bitwise floor for performance
      this.tile = (~~(this.y / TILE_SIZE) * GRID_W) + (~~(this.x / TILE_SIZE));
      const tile = state.tiles[this.tile];
      this.r = tile.R / 150;
      this.g = tile.G / 200;
      this.b = tile.B / 100;
    } else {
      // Out of bounds - signal poison/danger
      this.tile = null;
      this.r = -1;
      this.g = -1;
      this.b = -1;
      this.s = 0;
    }
  }
}
