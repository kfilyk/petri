// Amoeba class - Core entity for the simulation

import {
  MIN_SIZE,
  MAX_SIZE,
  MAX_EYE_DISTANCE,
  MAX_MOUTH_DISTANCE,
  NUM_INPUT_NEURONS,
  NUM_OUTPUT_NEURONS,
  DEG_TO_RAD,
  TWOPI,
  FIELDX,
  FIELDY,
  POPCAP,
  ALPH,
  TILE_SIZE,
  HUSK_DECAY_RATE,
  HUSK_ENERGY_FACTOR,
  MUTATION_RATE,
  EROSION_RATE,
} from '../constants';
import { round, generateName, collectKinDeltas, getBrainWeight } from '../utils/math';
import { state } from '../state';
import { Neuron } from './Neuron';
import { Eye } from './Eye';
import { Mouth } from './Mouth';
// Old 2D brain display (deprecated)
// import { drawBrain } from '../components/BrainDisplay';
import { drawBrain3D } from '../components/BrainDisplay3D';
import { updateFamilyDisplay } from '../components/FamilyDisplay';
import type { RenderContext } from '../types';
import { GRID_H, GRID_TILES, GRID_W } from '@/managers/TileSystem';

export class Amoeba {
  index: number;
  grave?: number;
  x: number;
  y: number;
  status: 'alive' | 'decaying' | 'dead' = 'alive';
  tile: number | null = null;
  size: number = MIN_SIZE;
  gen: number = 0;
  born: number = 0;
  age: number = 0;
  parent: number | null = null;
  sibling_idx: number | null = null;
  children: number[] = [];
  descendants: number = 0;
  proGenes: number = 0;
  conGenes: number = 0;
  name: string;
  velocityX: number = 0;
  velocityY: number = 0;
  rotation: number = 0;
  direction: number;

  eyes: Eye[];
  mouth: Mouth;

  redEaten: number = 0.003;
  greenEaten: number = 0.003;
  blueEaten: number = 0.003;
  currEaten: number = 0;
  netEaten: number = 0.01;

  inputs: Neuron[];
  outputs: Neuron[];

  energy: number;
  maxEnergy: number;
  energyChange: number = 0;
  totalEnergyGain: number = 0;
  totalEnergyCost: number = 0;

  currDamage: number = 0;
  damageReceived: number = 0;
  damageCaused: number = 0;


  // Pre-allocated color array for drawing
  cols: Uint8ClampedArray = new Uint8ClampedArray(9);
  lr: number = 0;

  // Brain array for display purposes
  brain: Neuron[] = [];

  constructor(x: number, y: number, index: number) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.name = generateName(ALPH);
    this.direction = round(Math.random() * 360);
    this.born = state.stats.time;

    // Initialize eyes
    this.eyes = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.eyes[i] = new Eye(this.x, this.y);
    }

    // Initialize mouth
    this.mouth = new Mouth(this.x, this.y);

    // Initialize neurons
    this.inputs = new Array(NUM_INPUT_NEURONS);
    this.outputs = new Array(NUM_OUTPUT_NEURONS);

    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      this.inputs[i] = new Neuron();
      if (i === 30 || i === 31) {
        // Bias neurons (30, 31) - start WITHOUT weights
        this.inputs[i].init(NUM_OUTPUT_NEURONS, 0);
      } else {
        // Sensory inputs (0-29) and energy ratio (32) - start with 8 weights
        this.inputs[i].init(NUM_OUTPUT_NEURONS, 8);
      }
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      this.outputs[i] = new Neuron();
      this.outputs[i].init(NUM_OUTPUT_NEURONS, 0);
    }

    // Initialize energy
    this.energy = MIN_SIZE * 1000;
    this.maxEnergy = this.energy;
  }



  /**
   * Move the amoeba based on neural network outputs
   */
  move(): void {
    this.velocityX = (this.velocityX/2) + (this.outputs[0].out) / (1+this.currDamage);
    this.velocityY = (this.velocityY/2) + (this.outputs[1].out) / (1+this.currDamage);

    // console.log("VEL: ", this.velocity)
    this.rotation = this.rotation/2 + ((this.outputs[2].out * 8) / (1+this.currDamage));
    // console.log("ROT: ", this.rotation)

    this.direction += this.rotation;

    if (this.direction < 0) {
      this.direction += 360;
    } else if (this.direction > 359) {
      this.direction -= 360;
    }

    // velocityX is forward/backward, velocityY is strafe left/right
    const dirRad = this.direction * DEG_TO_RAD;
    this.x += (this.velocityX * Math.cos(dirRad) + this.velocityY * Math.sin(dirRad));
    this.y += (this.velocityX * Math.sin(dirRad) - this.velocityY * Math.cos(dirRad));

    // Boundary collision
    if (this.x < 0 || this.x >= FIELDX) {
      this.x = this.x < 0 ? 0 : FIELDX - 1;
      this.velocityX = 0;
      this.velocityY = 0;
    }
    if (this.y < 0 || this.y >= FIELDY) {
      this.y = this.y < 0 ? 0 : FIELDY - 1;
      this.velocityX = 0;
      this.velocityY = 0;
    }

    // Update current tile using bitwise floor for performance
    let ct = (~~(this.y / TILE_SIZE) * GRID_W) + (~~(this.x / TILE_SIZE));
    if (ct >= GRID_W*GRID_H) {
      this.tile = GRID_TILES-1;
    } else if (ct < 0) {
      this.tile = 0;
    }
    this.tile = ct;

    // Move mouth and eyes
    this.mouth.move(
      this.direction,
      this.x,
      this.y,
      this.outputs[8].out * MAX_MOUTH_DISTANCE, // distance should only be CAPPED as a function of size
      this.outputs[9].out * MAX_MOUTH_DISTANCE
      // this.outputs[8].out * this.size,
      // this.outputs[9].out * this.size
    );

    for (let i = 0; i < 5; i++) {
      this.eyes[i].move(
        this.direction,
        this.x,
        this.y,
        this.outputs[i * 2 + 10].out * MAX_EYE_DISTANCE,
        this.outputs[i * 2 + 11].out * MAX_EYE_DISTANCE
        // this.outputs[i * 2 + 10].out * 4 * this.size,
        // this.outputs[i * 2 + 11].out * 4 * this.size
      );
    }
  }


  /**
   * Sense map and other amoebs in vicinity of mouth and eyes
   */
  sense(): void {
    const size = this.size;
    const mouth = this.mouth;
    const eyes = this.eyes;

    mouth.sense();
    for (let i = 0; i < 5; i++) {
      eyes[i].sense();
    }

    // Check for amoeba collisions
    for (let j = 0; j <= state.HIGHESTINDEX; j++) {
      const other = state.amoebs[j];
      if (other.status !== 'dead' && j !== this.index) {
        const otherSize = (other.size / 2) + (size / 4);
        const isHusk = other.status === 'decaying' ? -1 : 1;
        // Check mouth collision
        if (mouth.detected === -1) {
          if ( Math.abs(mouth.x - other.x) <= otherSize && Math.abs(mouth.y - other.y) <= otherSize) {
            mouth.s = isHusk * (other.size - MIN_SIZE) / (MAX_SIZE-MIN_SIZE);   // (-1 , 0): reserved for 'husks': (0, 1): reserved for living
            // reserve (-1, 0) range for DEAD creatures
            mouth.r = other.outputs[3].out;
            mouth.g = other.outputs[4].out;
            mouth.b = other.outputs[5].out;
            mouth.detected = j;
          }
        }

        // Check eye collisions
        for (let i = 0; i < 5; i++) {
          if (eyes[i].detected === -1) {
            if (
              Math.abs(eyes[i].x - other.x) <= otherSize && Math.abs(eyes[i].y - other.y) <= otherSize ) {
              eyes[i].s = isHusk * (other.size - MIN_SIZE) / (MAX_SIZE-MIN_SIZE);  // (-1 , 0): reserved for 'husks': (0, 1): reserved for living
              eyes[i].r = other.outputs[3].out;
              eyes[i].g = other.outputs[4].out;
              eyes[i].b = other.outputs[5].out;
              eyes[i].detected =  j;
            }
          }
        }
      }
    }
  }



  /**
   * Eat from tiles or other creatures
   */
  eat(): void {
    const size = this.size;
    this.currEaten = 0;
    let r = 0;
    let g = 0;
    let b = 0;

    if (this.mouth.detected !== -1) {
      // Interacting with (feeding/attacking) another animal
      const other = state.amoebs[this.mouth.detected];
      if (other.status === 'alive') {

        // IMPORTANT!! size ratio : note that including this feature INDUCES growth over generations! 
        // which is a GOOD thing because typical randomly seeded species start very small

        const sizeRatio = size/other.size;

        r = this.outputs[3].out > 0 ? 0 : (1 - Math.abs(-this.outputs[3].out - Math.abs(other.outputs[3].out))) * sizeRatio;
        g = this.outputs[4].out > 0 ? 0 : (1 - Math.abs(-this.outputs[4].out - Math.abs(other.outputs[4].out))) * sizeRatio;
        b = this.outputs[5].out > 0 ? 0 : (1 - Math.abs(-this.outputs[5].out - Math.abs(other.outputs[5].out))) * sizeRatio;

        this.redEaten += r;
        this.greenEaten += g;
        this.blueEaten += b;
        this.currEaten = r + g + b;
        this.netEaten += this.currEaten;
        other.currDamage += this.currEaten;
        other.damageReceived += this.currEaten;
        this.damageCaused += this.currEaten;
      } else if (other.status === 'decaying') {
        // r = Math.abs(this.outputs[3].out) * _size;
        // g = Math.abs(this.outputs[4].out) * _size;
        // b = Math.abs(this.outputs[5].out) * _size;

        r = this.outputs[3].out > 0 ? 0 : (1 - Math.abs(-this.outputs[3].out - Math.abs(other.outputs[3].out))) * size;
        g = this.outputs[4].out > 0 ? 0 : (1 - Math.abs(-this.outputs[4].out - Math.abs(other.outputs[4].out))) * size;
        b = this.outputs[5].out > 0 ? 0 : (1 - Math.abs(-this.outputs[5].out - Math.abs(other.outputs[5].out))) * size;


        // console.log("R: ", r)
        // console.log("G: ", g)
        // console.log("B: ", b)
        // console.log("NAME / SIZE: ", this.name + " | " + _size)

        const totalEat = r + g + b;
        // console.log("TOTAL EAT: ", totalEat)

        const available = Math.min(totalEat, other.size * HUSK_ENERGY_FACTOR);
        // console.log("AVAILABLE: ", available)

        const ratio = totalEat > 0 ? available / totalEat : 0;
        r *= ratio;
        g *= ratio;
        b *= ratio;
        // console.log("HUSK SIZE BEFORE SCAVENGE: ", other.size)
        other.size -= available / HUSK_ENERGY_FACTOR;
        other.size = Math.max(other.size, 0); 
        // console.log("HUSK SIZE AFTER SCAVENGE: ", other.size)
        this.redEaten += r;
        this.greenEaten += g;
        this.blueEaten += b;
        this.currEaten = r + g + b;
        // console.log("EATEN: ", this.currEaten)

        this.netEaten += this.currEaten;
      }
    } else if (this.mouth.tile !== null) {
      // Herbivore: eating from tile
      const t = this.mouth.tile;
      const tile = state.tiles[t];

      // logic: grass tiles are not really nutritious... so why should large sized amoebas be able to feast? the answer is, they shouldn't: limit amount of nutrients gained from grass tiles for everyone
      r = this.outputs[3].out < 0 ? 0 : this.outputs[3].out * size;
      g = this.outputs[4].out < 0 ? 0 : this.outputs[4].out * size;
      b = this.outputs[5].out < 0 ? 0 : this.outputs[5].out * size;

      // Tile decreases by all possible r/g/b
      tile.rDelta -= r / 1.5;
      tile.gDelta -= g;
      tile.bDelta -= b / 2;

      r = r * Math.sign(tile.R);
      g = g * Math.sign(tile.G);      
      b = b * Math.sign(tile.B);


      if (r > 0) this.redEaten += r;
      if (g > 0) this.greenEaten += g;
      if (b > 0) this.blueEaten += b;

      this.netEaten += Math.abs(r) + Math.abs(g) + Math.abs(b);
      this.currEaten = r + g + b;
    } else {
      // Not on tile - edge of map penalty
      this.currEaten = -1;
    }
  }

  /**
   * Draw the animal on the canvas
   */
  draw(c: Uint8ClampedArray): void {
    const ctx = state.ctx.map;
    if (!ctx) return;

    // Calculate colors based on outputs
    c[0] = 50 + round(Math.abs(this.outputs[3].out) * 205);
    c[1] = 50 + round(Math.abs(this.outputs[4].out) * 205);
    c[2] = 50 + round(Math.abs(this.outputs[5].out) * 205);
    c[3] = c[0] + 40;
    c[4] = c[1] + 40;
    c[5] = c[2] + 40;
    c[6] = c[0] + 80;
    c[7] = c[1] + 80;
    c[8] = c[2] + 80;

    // Draw eyes
    const er = this.size / 4;                                                                                                                                                                         
    ctx.fillStyle = `rgb(${c[6]},${c[7]},${c[8]})`;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(this.eyes[i].x, this.eyes[i].y, er, 0, TWOPI);
      ctx.fill();
    }

    // Draw body
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, TWOPI);
    ctx.fill();

    // Draw mouth
    ctx.fillStyle = `rgb(${c[3]},${c[4]},${c[5]})`;
    ctx.beginPath();
    ctx.arc(this.mouth.x, this.mouth.y, this.size / 2, 0, TWOPI);
    ctx.fill();

    // Show name on hover
    if (
      state.mouse.overMap &&
      state.mouse.x >= this.x - 50 &&
      state.mouse.x < this.x + 50 &&
      state.mouse.y >= this.y - 50 &&
      state.mouse.y < this.y + 50 &&
      state.highlighted !== this.index
    ) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        this.name + '-' + this.gen + (this.status === 'alive' ? 'A' : 'D') + this.descendants,
        this.x + 2 * this.size,
        this.y - 2 * this.size + 2
      );
    }
  }

  /**
   * Process energy decay and death
   */
  metabolize(): void {
    // Calculate energy change
    const outputCost =

      (1+this.size/10) *
      (Math.abs(this.outputs[0].out) + // velocity x
      Math.abs(this.outputs[1].out) + // velocity y    
      Math.abs(this.outputs[2].out)); // rotation   
      // Math.abs(this.outputs[3].out) + // eat r
      // Math.abs(this.outputs[4].out) + // eat g
      // Math.abs(this.outputs[5].out)); // eat b
    
     



    this.energyChange = this.currEaten - this.currDamage - outputCost;

    // this was MESSING with the INPUTS of the BRAINS!!! it JUMPS suddenly when pop changes!!! HERE AS A REMINDER TO NEVER DO AGAIN!!
    // if (state.stats.livePop > 100) {
    //   this.energyChange = this.currEaten - this.currDamage - outputCost;
    // } else if (state.stats.livePop > 50) {
    //   this.energyChange = this.currEaten - this.currDamage - outputCost / 2;
    // } else {
    //   this.energyChange = this.currEaten - this.currDamage - outputCost / 4;
    // }

    this.energy += this.energyChange;

    this.totalEnergyCost += outputCost + this.currDamage;
    if (this.energyChange > 0) {
      this.totalEnergyGain += this.energyChange;
    }

    if (this.energy > this.maxEnergy) {
      this.maxEnergy = this.energy;
    }

    // Check for death — begin decaying as a husk
    if (this.energy <= 0) {
      this.status = 'decaying';
      state.stats.livePop--;

      // Don't roll back HIGHESTINDEX — slot still occupied by decaying husk

      // Clone to graveyard immediately for genealogy tracking
      const dead = this.clone();
      dead.index = -(state.graveyard.length + 1);
      this.grave = dead.index;
      // Update parent references
      if (this.parent !== null) {
        if (this.parent < 0) {
          state.graveyard[-(this.parent + 1)].children[this.sibling_idx!] = dead.index;
        } else {
          state.amoebs[this.parent].children[this.sibling_idx!] = dead.index;
        }

        // Update ancestor descendants
        let anc: number | null = this.parent;
        while (anc !== null) {
          if (anc >= 0) {
            state.amoebs[anc].descendants--;
            anc = state.amoebs[anc].parent;
          } else {
            state.graveyard[-(anc + 1)].descendants--;
            anc = state.graveyard[-(anc + 1)].parent;
          }
        }
      }

      // Update children references
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i] < 0) {
          state.graveyard[-(this.children[i] + 1)].parent = dead.index;
        } else {
          state.amoebs[this.children[i]].parent = dead.index;
        }
      }

      // Update highlighted/newest
      if (state.highlighted === this.index) {
        state.highlighted = dead.index;
      }
      if (state.newest === this.index) {
        state.newest = dead.index;
      }

      state.graveyard.push(dead);

      this.updateLiveInfoDisplay();
    } else {
      this.age++;
    }
  }

  /**
   * Decay a dead husk — bleed size into surrounding tiles as nutrients
   */
  decay(): void {
    if(Math.random() * 100 < 1) {
      this.size = round((this.size - HUSK_DECAY_RATE)*10)/10;

      // Distribute lost nutrients to surrounding tiles
      const tile = state.tiles[this.tile!];
      if (tile) {
        const neighbors = tile.neighbors;
        const tileCount = neighbors.length + 1;
        const perTile = 10 / tileCount;
        tile.R = Math.min(tile.R + perTile, tile.RCap);
        tile.G = Math.min(tile.G + perTile, tile.GCap);
        tile.B = Math.min(tile.B + perTile, tile.BCap);
        for (const n of neighbors) {
          const nt = state.tiles[n];
          nt.R = Math.min(nt.R + perTile, nt.RCap);
          nt.G = Math.min(nt.G + perTile, nt.GCap);
          nt.B = Math.min(nt.B + perTile, nt.BCap);
        }
      }

      this.updateLiveInfoDisplay();

      if (this.size <= 0) {
        this.cleanup();
      }
    }
  }

  /**
   * Finalize death — move to graveyard, roll back HIGHESTINDEX, free slot
   */
  cleanup(): void {
    this.status = 'dead';

    // Roll back highest index if this was the highest
    if (this.index === state.HIGHESTINDEX) {
      let i = this.index;
      while (i > -1 && (state.amoebs[i] == null || state.amoebs[i].status === 'dead')) {
        i--;
      }
      state.HIGHESTINDEX = i;
    }
  }

  /**
   * Grow and potentially reproduce
   */
  grow(): void {
    // forced to grow as energy consumed; can only shrink via mitosis
    const sizeCeiling = round(this.energy / 100) / 10;
    if(sizeCeiling > this.size) {
      this.size = sizeCeiling;
    }
    if (this.size > MAX_SIZE) {
      this.size = MAX_SIZE;
    } else if (this.size < 1) {
      this.size = 1;
    }

    // outputs[6] (-1, 1) maps to desired offspring energy (1000, 10000)
    //   = (outputs[6] + 1) / 2  → normalizes (-1,1) to (0,1)
    //   * 9000 + 1000            → scales to range (1000, 10000)
    
    // Reproduction triggers when:
    //   1. Parent energy >= 2x desired offspring energy
    //      (parent must be big enough to give the child that much AND keep the same for itself)
    //   2. Population is below cap
    const desiredOffspringEnergy = (this.outputs[6].out + 1) / 2 * 9000 + 1000;

    if ( this.energy >= desiredOffspringEnergy * 2 && state.stats.livePop < POPCAP ) {
      // Find empty slot (skip alive and decaying — only reuse 'dead' slots)
      let i = 0;
      while (state.amoebs[i] != null) {
        if (state.amoebs[i].status !== 'dead') {
          i++;
        } else {
          break;
        }
      }

      if (i > state.HIGHESTINDEX) {
        state.HIGHESTINDEX = i;
      }

      // Parent gives desiredOffspringEnergy to the child, keeps the rest
      // Clone FIRST (copies current energy), then fix both energies after
      const mutant = this.clone();
      mutant.mitosis(this);

      // Child gets exactly the desired amount; parent keeps the remainder
      mutant.energy = desiredOffspringEnergy;
      this.energy -= desiredOffspringEnergy;

      // Update sizes to match new energies (energy / 100 / 10 = energy / 1000)
      mutant.size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, round(mutant.energy / 100) / 10));
      this.size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, round(this.energy / 100) / 10));

      this.descendants++;
      this.children.push(i);

      mutant.index = i;
      state.amoebs[i] = mutant;
      state.newest = i;
      state.stats.livePop++;

      // Update ancestor descendants
      let ancestor: number | null = this.parent;
      while (ancestor !== null) {
        if (ancestor >= 0) {
          state.amoebs[ancestor].descendants++;
          ancestor = state.amoebs[ancestor].parent;
        } else {
          state.graveyard[-(ancestor + 1)].descendants++;
          ancestor = state.graveyard[-(ancestor + 1)].parent;
        }
      }
    }


    // if ( this.outputs[6].out > 0 && this.energy >= 2000 && state.stats.livePop < POPCAP ) {
    //   // Find empty slot (skip alive and decaying — only reuse 'dead' slots)
    //   let i = 0;
    //   while (state.amoebs[i] != null) {
    //     if (state.amoebs[i].status !== 'dead') {
    //       i++;
    //     } else {
    //       break;
    //     }
    //   }

    //   if (i > state.HIGHESTINDEX) {
    //     state.HIGHESTINDEX = i;
    //   }

    //   // Parent gives desiredOffspringEnergy to the child, keeps the rest
    //   // Clone FIRST (copies current energy), then fix both energies after
    //   const mutant = this.clone();
    //   mutant.mitosis(this);

    //   // Child gets exactly the desired amount; parent keeps the remainder
    //   this.energy /= 2;
    //   mutant.energy = this.energy;

    //   // Update sizes to match new energies (energy / 100 / 10 = energy / 1000)
    //   mutant.size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, round(mutant.energy / 100) / 10));
    //   this.size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, round(this.energy / 100) / 10));

    //   this.descendants++;
    //   this.children.push(i);

    //   mutant.index = i;
    //   state.amoebs[i] = mutant;
    //   state.newest = i;
    //   state.stats.livePop++;

    //   // Update ancestor descendants
    //   let ancestor: number | null = this.parent;
    //   while (ancestor !== null) {
    //     if (ancestor >= 0) {
    //       state.amoebs[ancestor].descendants++;
    //       ancestor = state.amoebs[ancestor].parent;
    //     } else {
    //       state.graveyard[-(ancestor + 1)].descendants++;
    //       ancestor = state.graveyard[-(ancestor + 1)].parent;
    //     }
    //   }
    // }
  }

  /**
   * Process neural network thinking
   */
  think(): void {
    let idx = 0;
    this.inputs[idx++].in = this.velocityX/2;
    this.inputs[idx++].in = this.velocityY/2;
    this.inputs[idx++].in = this.rotation / 16;
    this.inputs[idx++].in = this.currEaten / (this.size * 3);// 3 colour channels
    this.inputs[idx++].in = (2 * (this.size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE))-1;
    this.inputs[idx++].in = 0;
    // this.inputs[idx++].in = this.energyChange / (this.size * 3); // CONVERT THIS TO DAMAGE INDICATOR? 
    
    this.inputs[idx++].in = this.mouth.r;
    this.inputs[idx++].in = this.mouth.g;
    this.inputs[idx++].in = this.mouth.b;
    this.inputs[idx++].in = this.mouth.s;

    for (let eye = 0; eye < 5; eye++) {
      this.inputs[idx++].in = this.eyes[eye].r;
      this.inputs[idx++].in = this.eyes[eye].g;
      this.inputs[idx++].in = this.eyes[eye].b;
      this.inputs[idx++].in = this.eyes[eye].s;
    }

    // Bias neurons - always on
    this.inputs[idx++].in = 1.0;   // Positive bias
    this.inputs[idx++].in = -1.0;  // Negative bias

    // Energy ratio: -1 (empty) to +1 (full)
    this.inputs[idx++].in = (2 * this.energy / this.maxEnergy) - 1;

    // Calculate output neuron activations
    //
    // Each neuron has two weight arrays: weights1 (used when input > 0) and weights2 (used when input < 0).
    // The naive approach calls synapse() per connection, branching inside each call — that's ~3000 branches/tick.
    //
    // Optimization: since a neuron's input sign doesn't change across its connections,
    // we pick the weight array ONCE per source neuron ("preselect"), then just do in * w[o].
    // Same result, ~26% faster (benchmarked). One branch per neuron instead of per synapse.
    //
    let sum = 0;
    for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
      // Input → output connections
      for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
        const n = this.inputs[j];
        const w = n.in > 0 ? n.weights1 : n.weights2; // pick once per source neuron
        sum += n.in * w[o];
      }

      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          const n = this.outputs[j];
          const w = n.out > 0 ? n.weights1 : n.weights2;
          sum += n.out * w[o];
      }

      this.outputs[o].in = Math.min(Math.max(sum, -1), 1);
      sum = 0;
    }

    // this HAS to run like after the previous dble for loop: the first-pass is a staging buffer where the next iteration '.out' value is prepared for every neuron...
    // ...but out is NOT overwritten until all inter-neuron synapses from the prev iteration have been computed
    for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
      this.outputs[o].out = this.outputs[o].in;

      // this.outputs[o].out = this.outputs[o].out * (1-this.outputs[o].sustain) + this.outputs[o].in * this.outputs[o].sustain;
    }

  }




  // "STRENGTHENING" a neuron/connections: means you prevent it from BUDGING! 

  /**
   * Perform mitosis (reproduction with mutation)
   */
  mitosis(parent: Amoeba): void {
    this.descendants = 0;
    this.children = [];
    this.gen = parent.gen + 1;
    this.parent = parent.index;
    this.sibling_idx = parent.children.length;
    this.name = parent.name;
    this.maxEnergy = parent.energy;
    this.born = state.stats.time;
    this.age = 0;
    this.redEaten = 0.003;
    this.greenEaten = 0.003;
    this.blueEaten = 0.003;
    this.netEaten = 0.01;
    this.currDamage = 0;
    this.damageCaused = 0;
    this.damageReceived = 0;

    // Possibly mutate name
    if (round(Math.random() * 2) === 2) {
      if (round(Math.random() * 2) === 2) {
        if (round(Math.random() * 2) === 2) {
          if (round(Math.random() * 2) === 2) {
            this.name = ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(1) + this.name.charAt(2) + this.name.charAt(3);
          } else {
            this.name = this.name.charAt(0) + ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(2) + this.name.charAt(3);
          }
        } else {
          this.name = this.name.charAt(0) + this.name.charAt(1) + ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(3);
        }
      } else {
        this.name = this.name.charAt(0) + this.name.charAt(1) + this.name.charAt(2) + ALPH.charAt(round(Math.random() * 25));
      }
    }      

    state.stats.mitoses += 1; 
    // const advWeight = parent.outputs[20].out;
    // const disWeight = parent.outputs[21].out;
    const advWeight = 1;
    const disWeight = 1;

    state.stats.advWeight += advWeight; // if advWeight becomes negative, indicates that NOTHING about this mutation strategy is actually being effective
    state.stats.disWeight += disWeight;

    // Per-edge kin deltas: each relative measured from its own parent,
    // labelled by its own outcome (see collectKinDeltas).
    const { advantageous, disadvantageous } = collectKinDeltas(this.parent!);

    // Add average of advantageous deltas
    const advCount = advantageous.length;
    const disCount = disadvantageous.length;

    // ===================================================================================
    // WEIGHT MUTATION WITH DECOUPLED NOISE AND EROSION
    // ===================================================================================
    //
    // Formula: Δw = m * random(-1,1) / (adv+1) - m * w / (adv+1)²
    //               \_________NOISE__________/   \____EROSION____/
    //
    // Two competing forces:
    //   1. NOISE:   Random exploration, enables discovering new behaviors
    //   2. EROSION: Pull toward zero, prevents unbounded drift and prunes unused weights
    //
    // Both are scaled by the fixed MUTATION_RATE (m).
    //
    // THE KEY INSIGHT: Erosion is dampened MORE than noise as success increases.
    //
    //   - Noise scales with     1 / (advCount + 1)
    //   - Erosion scales with   1 / (advCount + 1)²
    //
    //   advCount | Noise  | Erosion | Ratio (noise:erosion)
    //   ---------|--------|---------|----------------------
    //      0     |  1.0   |  1.0    |  1:1   (equal)
    //      3     |  0.25  |  0.0625 |  4:1   (noise dominates)
    //      9     |  0.1   |  0.01   | 10:1   (noise strongly dominates)
    //
    // WHY THIS MATTERS:
    //
    //   Problem: Simple "noise - erosion" would erode beneficial weights.
    //   A weight that's been working well (high advCount) shouldn't be eaten away.
    //
    //   Solution: As a lineage becomes successful (advCount grows), erosion
    //   decays FASTER than noise. Beneficial weights are protected from erosion
    //   while still allowing slow exploration. The weight can still change,
    //   but it won't drift toward zero just because time passed.
    //
    //   Meanwhile, unsuccessful lineages (low advCount) experience strong erosion,
    //   which clears out ineffective weights and returns them to neutral (zero),
    //   ready to be re-explored.
    //
    // ===================================================================================


      //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         this.inputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas1[j]) * sigma / (advCount + 1);
  //         this.inputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas2[j]) * sigma / (advCount + 1);
  //       }
  //     }

  
    const noiseScale = MUTATION_RATE / (advCount + 1);
    const erosionScale = EROSION_RATE / (advCount + 1);

    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        this.inputs[i].weights1[j] += noiseScale * (2 * Math.random() - 1) - erosionScale * this.inputs[i].weights1[j]; // erosion increases as weights saturate
        this.inputs[i].weights2[j] += noiseScale * (2 * Math.random() - 1) - erosionScale * this.inputs[i].weights2[j];
      }
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        this.outputs[i].weights1[j] += noiseScale * (2 * Math.random() - 1) - erosionScale * this.outputs[i].weights1[j];
        this.outputs[i].weights2[j] += noiseScale * (2 * Math.random() - 1) - erosionScale * this.outputs[i].weights2[j];
      }
    }
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

    // ===================================================================================
    // KIN-GUIDED UPDATE: Δw = mean(adv deltas) - mean(dis deltas)
    // ===================================================================================
    //
    // The advantageous mean says "this is how relatives that reproduced moved."
    // The disadvantageous mean is a BASELINE: how relatives that died childless moved.
    // Shared drift (erosion, common luck) appears in both and cancels. What remains
    // is the component that separated the survivors from the dead. On a synapse
    // where both groups moved the same way, the update is ~0.
    // ===================================================================================

    // 4a. Add mean of advantageous deltas
    for (let a = 0; a < advCount; a++) {
      const adv = advantageous[a];
      for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.inputs[i].weights1[j] += adv.in_weights1_deltas[i][j] / advCount;
          this.inputs[i].weights2[j] += adv.in_weights2_deltas[i][j] / advCount;
        }
      }

      for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.outputs[i].weights1[j] += adv.out_weights1_deltas[i][j] / advCount;
          this.outputs[i].weights2[j] += adv.out_weights2_deltas[i][j] / advCount;
        }
      }
    }

    // 4b. Subtract mean of disadvantageous deltas
    // for (let d = 0; d < disCount; d++) {
    //   const dis = disadvantageous[d];
    //   for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
    //       this.inputs[i].weights1[j] -= dis.in_weights1_deltas[i][j] / disCount;
    //       this.inputs[i].weights2[j] -= dis.in_weights2_deltas[i][j] / disCount;
    //     }
    //   }

    //   for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
    //       this.outputs[i].weights1[j] -= dis.out_weights1_deltas[i][j] / disCount;
    //       this.outputs[i].weights2[j] -= dis.out_weights2_deltas[i][j] / disCount;
    //     }
    //   }
    // }






    this.updateLiveInfoDisplay();
  }

  /**
   * Approach A mitosis: GP-consensus correction + sigma-gated noise.
   * Uses grandparent as common reference frame for all relatives.
   * Computes consensus "good direction" from GP across all GP descendants,
   * then nudges this child toward that consensus.
   * Falls back to parent-only sigma noise if no grandparent exists.
   */
  // mitosis(parent: Amoeba): void {
  //   this.descendants = 0;
  //   this.children = [];
  //   this.gen = parent.gen + 1;
  //   this.parent = parent.index;
  //   this.sibling_idx = parent.children.length;
  //   this.name = parent.name;
  //   this.maxEnergy = parent.energy;
  //   this.born = state.stats.time;
  //   this.age = 0;
  //   this.redEaten = 0.003;
  //   this.greenEaten = 0.003;
  //   this.blueEaten = 0.003;
  //   this.netEaten = 0.01;
  //   this.currDamage = 0;
  //   this.damageCaused = 0;
  //   this.damageReceived = 0;

  //   // Possibly mutate name
  //   if (round(Math.random() * 2) === 2) {
  //     if (round(Math.random() * 2) === 2) {
  //       if (round(Math.random() * 2) === 2) {
  //         if (round(Math.random() * 2) === 2) {
  //           this.name = ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(1) + this.name.charAt(2) + this.name.charAt(3);
  //         } else {
  //           this.name = this.name.charAt(0) + ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(2) + this.name.charAt(3);
  //         }
  //       } else {
  //         this.name = this.name.charAt(0) + this.name.charAt(1) + ALPH.charAt(round(Math.random() * 25)) + this.name.charAt(3);
  //       }
  //     } else {
  //       this.name = this.name.charAt(0) + this.name.charAt(1) + this.name.charAt(2) + ALPH.charAt(round(Math.random() * 25));
  //     }
  //   }

  //   state.stats.mitoses += 1;
  //   const sigma = Math.abs(parent.outputs[7].out) * 0.01;
  //   this.sigma = sigma;

  //   // Resolve grandparent
  //   let gp: Amoeba | null = null;
  //   let gpIdx: number | null = parent.parent;
  //   if (gpIdx !== null) {
  //     gp = gpIdx >= 0 ? state.amoebs[gpIdx] : state.graveyard[-(gpIdx + 1)];
  //   }

  //   // GP-consensus correction: use all GP descendants to find the "good direction"
  //   if (gp && gpIdx !== null) {
  //     const gpDescendants = getDescendantIndices(gpIdx, gpIdx);

  //     // Build adv/dis arrays from GP descendants (deltas relative to GP)
  //     const advantageous: WeightDeltas[] = [];
  //     const disadvantageous: WeightDeltas[] = [];

  //     for (let i = 0; i < gpDescendants.length; i++) {
  //       const idx = gpDescendants[i];
  //       const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
  //       if (!current) continue;

  //       if (current.children.length > 0) {
  //         const weightDeltas = getWeightDeltas(current, gp);
  //         for (let c = 0; c < current.children.length; c++) {
  //           advantageous.push(weightDeltas);
  //         }
  //       } else if (idx < 0) {
  //         disadvantageous.push(getWeightDeltas(current, gp));
  //       }
  //     }

  //     const advCount = advantageous.length;
  //     const disCount = disadvantageous.length;

  //     // Adv consensus: pull toward where successful descendants ended up (relative to GP)
  //     // consensus = avg(adv deltas from GP), myPos = this - GP, correction = consensus - myPos
  //     for (let a = 0; a < advCount; a++) {
  //       const adv = advantageous[a];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           const myPos1 = this.inputs[i].weights1[j] - gp.inputs[i].weights1[j];
  //           const myPos2 = this.inputs[i].weights2[j] - gp.inputs[i].weights2[j];
  //           this.inputs[i].weights1[j] += (adv.in_weights1_deltas[i][j] - myPos1) / (advCount + 1);
  //           this.inputs[i].weights2[j] += (adv.in_weights2_deltas[i][j] - myPos2) / (advCount + 1);
  //         }
  //       }
  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           const myPos1 = this.outputs[i].weights1[j] - gp.outputs[i].weights1[j];
  //           const myPos2 = this.outputs[i].weights2[j] - gp.outputs[i].weights2[j];
  //           this.outputs[i].weights1[j] += (adv.out_weights1_deltas[i][j] - myPos1) / (advCount + 1);
  //           this.outputs[i].weights2[j] += (adv.out_weights2_deltas[i][j] - myPos2) / (advCount + 1);
  //         }
  //       }
  //     }

  //     // Dis consensus: push AWAY from where failures ended up (relative to GP)
  //     // for (let d = 0; d < disCount; d++) {
  //     //   const dis = disadvantageous[d];
  //     //   for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //     //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //     //       const myPos1 = this.inputs[i].weights1[j] - gp.inputs[i].weights1[j];
  //     //       const myPos2 = this.inputs[i].weights2[j] - gp.inputs[i].weights2[j];
  //     //       this.inputs[i].weights1[j] -= (dis.in_weights1_deltas[i][j] - myPos1) / disCount;
  //     //       this.inputs[i].weights2[j] -= (dis.in_weights2_deltas[i][j] - myPos2) / disCount;
  //     //     }
  //     //   }
  //     //   for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //     //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //     //       const myPos1 = this.outputs[i].weights1[j] - gp.outputs[i].weights1[j];
  //     //       const myPos2 = this.outputs[i].weights2[j] - gp.outputs[i].weights2[j];
  //     //       this.outputs[i].weights1[j] -= (dis.out_weights1_deltas[i][j] - myPos1) / disCount;
  //     //       this.outputs[i].weights2[j] -= (dis.out_weights2_deltas[i][j] - myPos2) / disCount;
  //     //     }
  //     //   }
  //     // }








      

  //     // Mutate sigmas: random noise (dampened by advCount)
  //     for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         this.inputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas1[j]) * sigma / (advCount + 1);
  //         this.inputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas2[j]) * sigma / (advCount + 1);
  //       }
  //     }
  //     for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         this.outputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas1[j]) * sigma / (advCount + 1);
  //         this.outputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas2[j]) * sigma / (advCount + 1);
  //       }
  //     }

  //     // Sigma adv feedback: pull sigmas toward what successful GP descendants had
  //     for (let a = 0; a < advCount; a++) {
  //       const adv = advantageous[a];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.inputs[i].sigmas1[j] += adv.in_sigmas1_deltas[i][j] / (advCount + 1);
  //           this.inputs[i].sigmas2[j] += adv.in_sigmas2_deltas[i][j] / (advCount + 1);
  //         }
  //       }
  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.outputs[i].sigmas1[j] += adv.out_sigmas1_deltas[i][j] / (advCount + 1);
  //           this.outputs[i].sigmas2[j] += adv.out_sigmas2_deltas[i][j] / (advCount + 1);
  //         }
  //       }
  //     }

  //     // Sigma dis feedback: push sigmas away from what failed GP descendants had
  //     for (let d = 0; d < disCount; d++) {
  //       const dis = disadvantageous[d];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.inputs[i].sigmas1[j] -= dis.in_sigmas1_deltas[i][j] / disCount;
  //           this.inputs[i].sigmas2[j] -= dis.in_sigmas2_deltas[i][j] / disCount;
  //         }
  //       }
  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.outputs[i].sigmas1[j] -= dis.out_sigmas1_deltas[i][j] / disCount;
  //           this.outputs[i].sigmas2[j] -= dis.out_sigmas2_deltas[i][j] / disCount;
  //         }
  //       }
  //     }

  //     // Sigma-gated noise (mean-reverting)
  //     for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         const s1 = Math.max(this.inputs[i].sigmas1[j], 0);
  //         const s2 = Math.max(this.inputs[i].sigmas2[j], 0);
  //         // this.inputs[i].weights1[j] += s1 * (2 * Math.random() - 1 - this.inputs[i].weights1[j]) / (advCount + 1);
  //         // this.inputs[i].weights2[j] += s2 * (2 * Math.random() - 1 - this.inputs[i].weights2[j]) / (advCount + 1);
  //         this.inputs[i].weights1[j] += s1 * (2 * Math.random() - 1) / (advCount+1) - s1 * this.inputs[i].weights1[j] / ((advCount+1) * (advCount+1));
  //         this.inputs[i].weights2[j] += s2 * (2 * Math.random() - 1) / (advCount+1) - s2 * this.inputs[i].weights2[j] / ((advCount+1) * (advCount+1));
  //       }
  //     }
  //     for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         const s1 = Math.max(this.outputs[i].sigmas1[j], 0);
  //         const s2 = Math.max(this.outputs[i].sigmas2[j], 0);
  //         // this.outputs[i].weights1[j] += s1 * (2 * Math.random() - 1 - this.outputs[i].weights1[j]) / (advCount + 1);
  //         // this.outputs[i].weights2[j] += s2 * (2 * Math.random() - 1 - this.outputs[i].weights2[j]) / (advCount + 1);
  //         this.outputs[i].weights1[j] += s1 * (2 * Math.random() - 1) / (advCount+1) - s1 * this.outputs[i].weights1[j] / ((advCount+1) * (advCount+1));
  //         this.outputs[i].weights2[j] += s2 * (2 * Math.random() - 1) / (advCount+1) - s2 * this.outputs[i].weights2[j] / ((advCount+1) * (advCount+1));
  //       }
  //     }




  //   } else {

  //     const _descendants = getDescendantIndices(this.parent!, this.parent!);

  //     // Calculate advantageous mutations
  //     const advantageous: WeightDeltas[] = [];
  //     const disadvantageous: WeightDeltas[] = [];


  //     for (let i = 0; i < _descendants.length; i++) {                                                                                                  
  //       const idx = _descendants[i];                                                                                                                   
  //       const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];                                                                    
                                                                                                                                                                                                                                                                                            
  //       if (current.children.length > 0) {                                                                    
  //         const weightDeltas = getWeightDeltas(current, parent);                                                                         
  //         for (let c = 0; c < current.children.length; c++) {    
  //           advantageous.push(weightDeltas);       
  //         }                                                                                                                                            
  //       } else if (idx < 0) {                                                                                                                          
  //         disadvantageous.push(getWeightDeltas(current, parent));                                                                        
  //       }                                                                                                                                              
  //     }     



  //     // Add average of advantageous deltas
  //     const advCount = advantageous.length;
  //     const disCount = disadvantageous.length;


  //     // 1. Mutate per-synapse sigmas first (they gate everything else)
  //     //    Uses same bias-toward-zero formula: sigma tends toward 0 unless selection maintains it
  //     for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         this.inputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas1[j]) * sigma / (advCount+1);
  //         this.inputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas2[j]) * sigma / (advCount+1);

  //       }
  //     }

  //     for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         this.outputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas1[j]) * sigma / (advCount+1);
  //         this.outputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas2[j]) * sigma / (advCount+1);

  //       }
  //     }

    
  //     for (let a = 0; a < advCount; a++) {
  //       const adv = advantageous[a];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.inputs[i].sigmas1[j] += adv.in_sigmas1_deltas[i][j] / (advCount+1);
  //           this.inputs[i].sigmas2[j] += adv.in_sigmas2_deltas[i][j] / (advCount+1);
  //         }
  //       }
  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.outputs[i].sigmas1[j] += adv.out_sigmas1_deltas[i][j] / (advCount+1);
  //           this.outputs[i].sigmas2[j] += adv.out_sigmas2_deltas[i][j] / (advCount+1);
  //         }
  //       }
  //     }



  //     for (let d = 0; d < disCount; d++) {
  //       const dis = disadvantageous[d];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.inputs[i].sigmas1[j] -= dis.in_sigmas1_deltas[i][j] / disCount;
  //           this.inputs[i].sigmas2[j] -= dis.in_sigmas2_deltas[i][j] / disCount;
  //         }
  //       }
  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.outputs[i].sigmas1[j] -= dis.out_sigmas1_deltas[i][j] / disCount;
  //           this.outputs[i].sigmas2[j] -= dis.out_sigmas2_deltas[i][j] / disCount;
  //         }
  //       }
  //     }


      
  //     for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         // const s1 = Math.abs(this.inputs[i].sigmas1[j]);
  //         // const s2 = Math.abs(this.inputs[i].sigmas2[j]);
  //         const s1 = Math.max(this.inputs[i].sigmas1[j], 0);
  //         const s2 = Math.max(this.inputs[i].sigmas2[j], 0);
  //         this.inputs[i].weights1[j] += s1 * (2 * Math.random() - 1) / (advCount+1) - s1 * this.inputs[i].weights1[j] / ((advCount+1) * (advCount+1));
  //         this.inputs[i].weights2[j] += s2 * (2 * Math.random() - 1) / (advCount+1) - s2 * this.inputs[i].weights2[j] / ((advCount+1) * (advCount+1));
  //       }
  //     }

  //     for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //       for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //         // const s1 = Math.abs(this.outputs[i].sigmas1[j]);
  //         // const s2 = Math.abs(this.outputs[i].sigmas2[j]);
  //         const s1 = Math.max(this.outputs[i].sigmas1[j], 0);
  //         const s2 = Math.max(this.outputs[i].sigmas2[j], 0);
  //         this.outputs[i].weights1[j] += s1 * (2 * Math.random() - 1) / (advCount+1) - s1 * this.outputs[i].weights1[j] / ((advCount+1) * (advCount+1));
  //         this.outputs[i].weights2[j] += s2 * (2 * Math.random() - 1) / (advCount+1) - s2 * this.outputs[i].weights2[j] / ((advCount+1) * (advCount+1));
  //       }
  //     }      
  //     /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

  //     /* OLD SIMPLE RELIABLE */

  //     // 4. Apply advantageous weight deltas
  //     for (let a = 0; a < advCount; a++) {
  //       const adv = advantageous[a];
  //       for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.inputs[i].weights1[j] += adv.in_weights1_deltas[i][j] / advCount;
  //           this.inputs[i].weights2[j] += adv.in_weights2_deltas[i][j] / advCount;
  //         }
  //       }

  //       for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
  //         for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
  //           this.outputs[i].weights1[j] += adv.out_weights1_deltas[i][j] / advCount;
  //           this.outputs[i].weights2[j] += adv.out_weights2_deltas[i][j] / advCount;
  //         }
  //       }
  //     }
  //   }

  //   this.updateLiveInfoDisplay();
  // }

































  /**
   * Kill this animal
   */
  kill(): void {
    if (this.status === 'alive') {
      this.energy = -1;
    }
  }

  /**
   * Reincarnate a dead animal
   */
  reincarnate(): void {
    if (this.status !== 'alive' && state.stats.livePop < POPCAP) {
      let i = 0;
      while (state.amoebs[i] != null) {
        if (state.amoebs[i].status !== 'dead') {
          i++;
        } else {
          break;
        }
      }

      if (i > state.HIGHESTINDEX) {
        state.HIGHESTINDEX = i;
      }

      const clone = this.clone();
      this.descendants++;
      this.children.push(i);
      state.amoebs[i] = clone;

      state.newest = i;
      state.stats.livePop++;

      let ancestor: number | null = this.parent;
      while (ancestor !== null) {
        if (ancestor >= 0) {
          state.amoebs[ancestor].descendants++;
          ancestor = state.amoebs[ancestor].parent;
        } else {
          state.graveyard[-(ancestor + 1)].descendants++;
          ancestor = state.graveyard[-(ancestor + 1)].parent;
        }
      }

      state.highlighted = clone.index;
    }
  }

  /**
   * Show stats and tracking for a selected animal
   */
  highlight(): void {
    const ctx = state.ctx.map;
    if (!ctx) return;

    if (this.status !== 'alive') {
      this.draw(this.cols);
    }

    const s = this.size;

    // Draw highlight box
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(this.x - 2 * s, this.y - 2 * s, s * 4, s * 4);

    const dirRad = this.direction * DEG_TO_RAD;

    // Draw velocityX as red line (forward/backward)
    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    const velXEndX = this.x + this.outputs[0].out * 10 * Math.cos(dirRad);
    const velXEndY = this.y + this.outputs[0].out * 10 * Math.sin(dirRad);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(velXEndX, velXEndY);
    ctx.stroke();

    // Draw velocityY as blue line (strafe left/right)
    ctx.beginPath();
    ctx.strokeStyle = '#0088FF';
    const velYEndX = this.x + this.outputs[1].out * 10 * Math.sin(dirRad);
    const velYEndY = this.y - this.outputs[1].out * 10 * Math.cos(dirRad);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(velYEndX, velYEndY);
    ctx.stroke();


    // Draw rotation indicator (white, from end of direction arrow)
    ctx.beginPath();
    ctx.strokeStyle = '#FFFFFF';
    let rotX: number, rotY: number;
    if (this.velocityX > 0) {
      rotX = velXEndX - this.outputs[2].out * 10 * Math.cos((this.direction - 90) * DEG_TO_RAD);
      rotY = velXEndY - this.outputs[2].out * 10 * Math.sin((this.direction - 90) * DEG_TO_RAD);
    } else {
      rotX = velXEndX + this.outputs[2].out * 10 * Math.cos((this.direction - 90) * DEG_TO_RAD);
      rotY = velXEndY + this.outputs[2].out * 10 * Math.sin((this.direction - 90) * DEG_TO_RAD);
    }

    ctx.moveTo(velXEndX, velXEndY);
    ctx.lineTo(rotX, rotY);
    ctx.stroke();

    ctx.lineWidth = 0.25;
    // Draw eye circles on hover
    ctx.strokeStyle = '#FFFFFF';
    if (
      state.mouse.overMap &&
      state.mouse.x >= this.x - 50 &&
      state.mouse.x < this.x + 50 &&
      state.mouse.y >= this.y - 50 &&
      state.mouse.y < this.y + 50
    ) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(this.eyes[i].x, this.eyes[i].y, this.size / 4, 0, TWOPI);
        ctx.stroke();
      }
    }

    ctx.lineWidth = 1;

    // Draw name
    const posx = this.x + 2 * s;
    let posy = this.y - 2 * s;
    if (this.status === 'alive') {
      ctx.fillText(this.name + '-' + this.gen + 'A' + this.descendants, posx, posy + 2);
    }
    posy += 10;

    this.updateMainStatsDisplay();
    // Update stats display based on display mode
    if (state.display === 'default') {

    } else if (state.display === 'brain') {
      this.drawBrainDisplay();
    } else if (state.display === 'family') {
      updateFamilyDisplay(false, this.descendants);
    }
  }

  /**
   * Update main stats display panel
   */
  private updateMainStatsDisplay(): void {
    const nameEl = document.getElementById('stats-name');
    if (nameEl) {
      nameEl.innerHTML = this.name + '-' + this.gen + (this.status === 'alive' ? 'A' : 'D') + this.descendants;
    }

    const idxEl = document.getElementById('stats-idx');
    if (idxEl) idxEl.innerHTML = 'IDX ' + this.index;

    // const parentEl = document.getElementById('stats-parent');
    // if (parentEl) {
    //   if (this.parent !== null) {
    //     if (this.parent < 0) {
    //       const p = state.graveyard[-(this.parent + 1)];
    //       parentEl.innerHTML = 'PARENT: ' + p.name + '-' + p.gen + 'D' + p.children.length;
    //     } else {
    //       const p = state.amoebs[this.parent];
    //       parentEl.innerHTML = 'PARENT: ' + p.name + '-' + p.gen + 'A' + p.children.length;
    //     }
    //   } else {
    //     parentEl.innerHTML = '';
    //   }
    // }

    const siblingEl = document.getElementById('stats-sibling-idx');
    if (siblingEl && this.sibling_idx !== null) {
      siblingEl.innerHTML = 'SIBLING: ' + this.sibling_idx;
    }


    const ageEl = document.getElementById('stats-age');
    if (ageEl) ageEl.innerHTML = 'BORN/AGE: <b>' + this.born + '/' + this.age +  '</b>';

    // const descendantsEl = document.getElementById('stats-descendants');
    // if (descendantsEl) descendantsEl.innerHTML = 'DESCENDANTS: ' + this.descendants;

    // Energy stat
    const stat = round((5 * this.energyChange) / (this.size * 10 + 5));
    let statString = '';
    if (stat > 0) {
      for (let i = 0; i < stat; i++) statString += '+';
    } else {
      for (let i = 0; i < -stat; i++) statString += '-';
    }

    const energyEl = document.getElementById('stats-energy');
    if (energyEl) energyEl.innerHTML = 'NRG: ' + round(this.energy) + '/' + round(this.maxEnergy) + '   ' + statString;

    const sizeEl = document.getElementById('stats-size');
    if (sizeEl) sizeEl.innerHTML = 'SIZE: ' + this.size;

    const brainWeightEl = document.getElementById('stats-brain-weight');
    if (brainWeightEl) brainWeightEl.innerHTML = 'BRAIN: ' + getBrainWeight(this).toFixed(1);

    const damageEl = document.getElementById('stats-damage');
    if (damageEl) damageEl.innerHTML = round(this.damageReceived) + ' >> DMG >> ' + round(this.damageCaused);

    const sensorsEl = document.getElementById('stats-sensors');
    if (sensorsEl) {
      sensorsEl.innerHTML =
        (this.mouth.detected === 1 ? 'M ' : '') +
        (this.eyes[0].detected === 1 ? 'E1 ' : '') +
        (this.eyes[1].detected === 1 ? 'E2 ' : '') +
        (this.eyes[2].detected === 1 ? 'E3 ' : '') +
        (this.eyes[3].detected === 1 ? 'E4 ' : '') +
        (this.eyes[4].detected === 1 ? 'E5 ' : '');
    }

    this.positiveGauge('stats-energy', 'ϟ&nbsp;', this.energy, this.maxEnergy);

    // RGB stats
    this.signedGauge('stats-red', 'R&nbsp;', this.outputs[3].out);
    this.signedGauge('stats-green', 'G&nbsp;', this.outputs[4].out);
    this.signedGauge('stats-blue', 'B&nbsp;', this.outputs[5].out);

    this.signedGauge('stats-velocity', '∆X', this.outputs[0].out); // velocity x
    this.signedGauge('stats-rotation', '∆Y', this.outputs[1].out); // velocity y
    this.signedGauge('stats-mutation', '∆°', this.outputs[2].out); // rotation
  }

  /**
   * Render a -1 to 1 gauge 
   */
  private signedGauge(elementId: string, prefix: string, value: number): void {
    const FILLED = '█';
    // const FILLED = '◼︎';

    const EMPTY = '&nbsp;';

    // Clamp value to -1 to 1 range
    const sign = value > 0 ? '&nbsp;' : ''
    const clamped = Math.max(-1, Math.min(1, value));
    const magnitude = Math.round(Math.abs(clamped) * 10); // 0-10 blocks

    let left = EMPTY.repeat(10);
    let right = EMPTY.repeat(10);

    if (clamped < 0) {
      // Negative: fill left side from center outward (right to left)
      left = EMPTY.repeat(10 - magnitude) + FILLED.repeat(magnitude);
    } else {
      // Positive: fill right side from center outward (left to right)
      right = FILLED.repeat(magnitude) + EMPTY.repeat(10 - magnitude);
    }

    const bar = left + ' ' +sign+value.toFixed(2)+' ' + right;
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `${prefix} ${bar}`;
  }

  /**
   * Render a 0-1 gauge (e.g., for energy)
   */
  private positiveGauge(elementId: string, prefix: string, current: number, max: number): void {
    const FILLED = '█';
    const EMPTY = '&nbsp;';

    const ratio = Math.max(0, Math.min(1, current / max));
    const filled = Math.round(ratio * 20);

    const bar = FILLED.repeat(filled) + EMPTY.repeat(20 - filled);
    const label = `${round(current)}/${round(max)}`;

    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `${prefix} ${bar} ${label}`;
  }

  /**
   * Initialize brain display
   */
  // private drawBrainSetup(): void {
  //   drawBrain(this);
  // }

  /**
   * Draw brain visualization
   */
  private drawBrainDisplay(): void {
    drawBrain3D(this);
  }

  /**
   * Create a deep clone of this amoeba
   * Uses structuredClone where possible, falls back to manual copy
   */
  clone(): Amoeba {
    const clone = new Amoeba(this.x, this.y, this.index);

    // Copy all primitive and array fields generically
    for (const key of Object.keys(this) as (keyof Amoeba)[]) {
      const val = (this as any)[key];
      if (val instanceof Float32Array) {
        (clone as any)[key] = new Float32Array(val);
      } else if (val instanceof Uint8ClampedArray) {
        (clone as any)[key] = new Uint8ClampedArray(val);
      } else if (Array.isArray(val)) {
        (clone as any)[key] = [...val]; // shallow copy for primitive arrays (children, etc.)
      } else if (typeof val !== 'object' || val === null) {
        (clone as any)[key] = val;
      }
      // Skip complex objects (eyes, mouth, inputs, outputs, brain) — handled below
    }

    // Deep clone eyes
    clone.eyes = this.eyes.map(eye => {
      const e = new Eye(eye.x, eye.y);
      e.tile = eye.tile; e.r = eye.r; e.g = eye.g; e.b = eye.b;
      e.s = eye.s; e.detected = eye.detected;
      return e;
    });

    // Deep clone mouth
    const m = new Mouth(this.mouth.x, this.mouth.y);
    m.tile = this.mouth.tile; m.r = this.mouth.r; m.g = this.mouth.g; m.b = this.mouth.b;
    m.s = this.mouth.s; m.detected = this.mouth.detected;
    clone.mouth = m;

    // Deep clone neurons (Float32Arrays must be copied, not shared)
    const cloneNeuron = (n: Neuron): Neuron => {
      const c = new Neuron();
      c.weights1 = new Float32Array(n.weights1);
      c.weights2 = new Float32Array(n.weights2);
      c.in = n.in; c.out = n.out;
      return c;
    };
    clone.inputs = this.inputs.map(cloneNeuron);
    clone.outputs = this.outputs.map(cloneNeuron);
    clone.brain = [...clone.inputs, ...clone.outputs];

    return clone;
  }

  /**
   * Update live info display
   */
  private updateLiveInfoDisplay(): void {
    const el = document.getElementById('dash-live-info');
    if (el) {
      el.innerHTML = 'LIVE: ' + state.stats.livePop + '     DEAD: ' + state.graveyard.length;
    }
  }
}


