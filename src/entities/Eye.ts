// Eye creature component - Sensor for detecting tiles and other amoebs

import { GRID_W } from '@/managers/TileSystem';
import { DEG_TO_RAD, FIELDX, FIELDY, TILE_SIZE } from '../constants';
import { state } from '../state';

export class Eye {
  x: number;
  y: number;
  tile: number | null = null;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  s: number = 0;
  detected: number = -1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Update eye position based on amoeba direction and eye offset
   *
   * Note: eyeY is forward, eyeX is strafe (matches original polar method)
   */
  move(animalDir: number, animalX: number, animalY: number, eyeX: number, eyeY: number): void {
    // Rotation matrix: eyeY is forward (+X at dir=0), eyeX is strafe right (+Y at dir=0)
    const rad = animalDir * DEG_TO_RAD;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    this.x = animalX + eyeY * cos - eyeX * sin;
    this.y = animalY + eyeY * sin + eyeX * cos;
  }

  /**
   * Sense what the eye can see at its current position
   * Sets RGB values from tile or -1 if out of bounds
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
