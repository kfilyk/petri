// Mouth creature component - Used for eating tiles and other amoebs

import { GRID_W } from '@/managers/TileSystem';
import { DEG_TO_RAD, FIELDX, FIELDY, TILE_SIZE } from '../constants';
import { state } from '../state';

export class Mouth {
  x: number;
  y: number;
  tile: number | null = null;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  s: number = 0;
  detected: number = -1; // stores id of possible detected amoeb

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Update mouth position based on amoeb direction and mouth offset
   * Uses polar to cartesian conversion
   */
  move(animalDir: number, animalX: number, animalY: number, mouthX: number, mouthY: number): void {
    const angle = Math.atan(mouthX / (mouthY + 0.001)) / DEG_TO_RAD;
    const dist = Math.sqrt(mouthX ** 2 + mouthY ** 2);
    const adjustedAngle = mouthX < 0 ? angle + 180 : angle;

    this.x = animalX + dist * Math.cos(DEG_TO_RAD * (adjustedAngle + animalDir));
    this.y = animalY + dist * Math.sin(DEG_TO_RAD * (adjustedAngle + animalDir));
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
      this.s = -1;
    }
  }
}
