// Eye creature component - Sensor for detecting tiles and other amoebs

import { DEG_TO_RAD, FIELDX, FIELDY } from '../constants';
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
   * Update eye position based on amoeb direction and eye offset
   * Uses polar to cartesian conversion
   */
  move(animalDir: number, animalX: number, animalY: number, eyeX: number, eyeY: number): void {
    const angle = Math.atan(eyeX / (eyeY + 0.001)) / DEG_TO_RAD;
    const dist = Math.sqrt(eyeX ** 2 + eyeY ** 2);
    const adjustedAngle = eyeX < 0 ? angle + 180 : angle;

    this.x = animalX + dist * Math.cos(DEG_TO_RAD * (adjustedAngle + animalDir));
    this.y = animalY + dist * Math.sin(DEG_TO_RAD * (adjustedAngle + animalDir));
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
      this.tile = (~~(this.y / 25) * 40) + (~~(this.x / 25));
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
