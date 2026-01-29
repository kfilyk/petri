// Amoeb class - Core entity for the simulation

import {
  START_SIZE,
  MAX_SIZE,
  NUM_INPUT_NEURONS,
  NUM_OUTPUT_NEURONS,
  EATING_CONSTANT,
  DEG_TO_RAD,
  TWOPI,
  FIELDX,
  FIELDY,
  POPCAP,
  ALPH,
  TILE_SIZE,
} from '../constants';
import { round, abs, generateName } from '../utils/math';
import { state } from '../state';
import { Neuron } from './Neuron';
import { Eye } from './Eye';
import { Mouth } from './Mouth';
// Old 2D brain display (deprecated)
// import { drawBrain } from '../components/BrainDisplay';
import { drawBrain3D } from '../components/BrainDisplay3D';
import { updateFamilyDisplay } from '../components/FamilyDisplay';
import type { RenderContext, WeightDeltas } from '../types';
import { GRID_H, GRID_TILES, GRID_W } from '@/managers/TileSystem';

export class Amoeb {
  index: number;
  x: number;
  y: number;
  alive: boolean = true;
  tile: number | null = null;
  size: number = START_SIZE;
  health: number = 0;
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
      if(i < 30) { // BIAS neurons (i 30, 31) start WITHOUT weights !!
        this.inputs[i].init(NUM_OUTPUT_NEURONS, 8);
      } else {
        this.inputs[i].init(NUM_OUTPUT_NEURONS, 0);
      }
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      this.outputs[i] = new Neuron();
      this.outputs[i].init(NUM_OUTPUT_NEURONS, 0);
    }

    // Initialize energy
    this.energy = START_SIZE * 1000;
    this.maxEnergy = this.energy;
  }



  /**
   * Move the animal based on neural network outputs
   */
  move(): void {
    this.velocityX = (this.outputs[0].out * 2) / (1 + this.currDamage / this.size);
    this.velocityY = (this.outputs[1].out * 2) / (1 + this.currDamage / this.size);

    // console.log("VEL: ", this.velocity)
    this.rotation = (this.outputs[2].out * 10) / (1 + this.currDamage / this.size);
    // console.log("ROT: ", this.rotation)

    this.direction += this.rotation;

    if (this.direction < 0) {
      this.direction += 360;
    } else if (this.direction > 359) {
      this.direction -= 360;
    }

    // velocityX is forward/backward, velocityY is strafe left/right
    const dirRad = this.direction * DEG_TO_RAD;
    this.x += this.velocityX * Math.cos(dirRad) + this.velocityY * Math.sin(dirRad);
    this.y += this.velocityX * Math.sin(dirRad) - this.velocityY * Math.cos(dirRad);

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
      this.outputs[8].out * 2 * this.size,
      this.outputs[9].out * 2 * this.size
    );

    for (let i = 0; i < 5; i++) {
      this.eyes[i].move(
        this.direction,
        this.x,
        this.y,
        this.outputs[i * 2 + 10].out * 5 * this.size,
        this.outputs[i * 2 + 11].out * 5 * this.size
      );
    }
  }


  /**
   * Sense map and other amoebs in vicinity of mouth and eyes
   */
  sense(): void {
    const s1 = this.size;
    this.mouth.sense();

    for (let i = 0; i < 5; i++) {
      this.eyes[i].sense();
    }

    // Check for animal collisions
    for (let j = 0; j <= state.HIGHESTINDEX; j++) {
      if (state.amoebs[j].alive && j !== this.index) {
        const other = state.amoebs[j];

        // Check mouth collision
        if (this.mouth.detected === -1) {
          if (
            abs(this.mouth.x - other.x) <= (other.size / 2) + (s1 / 4) &&
            abs(this.mouth.y - other.y) <= (other.size / 2) + (s1 / 4)
          ) {
            this.mouth.s = ((2 * other.size) / MAX_SIZE) - 1;
            this.mouth.r = other.outputs[3].out;
            this.mouth.g = other.outputs[4].out;
            this.mouth.b = other.outputs[5].out;
            this.mouth.detected = j;
          }
        }

        // Check eye collisions
        for (let i = 0; i < 5; i++) {
          if (this.eyes[i].detected === -1) {
            if (
              abs(this.eyes[i].x - other.x) <= (s1 / 4) + other.size / 2 &&
              abs(this.eyes[i].y - other.y) <= (s1 / 4) + other.size / 2
            ) {
              this.eyes[i].s = ((2 * other.size) / MAX_SIZE) - 1;
              this.eyes[i].r = other.outputs[3].out;
              this.eyes[i].g = other.outputs[4].out;
              this.eyes[i].b = other.outputs[5].out;
              this.eyes[i].detected = j;
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
    const s1 = this.size;
    this.currEaten = 0;
    let r = 0;
    let g = 0;
    let b = 0;

    if (this.mouth.detected !== -1) {
      // Carnivore: eating another animal
      const prey = state.amoebs[this.mouth.detected];
      if (prey.alive) {
        r = this.outputs[3].out > 0 ? 0 : -this.outputs[3].out * (abs(prey.outputs[3].out) + 1) * s1 * EATING_CONSTANT;
        g = this.outputs[4].out > 0 ? 0 : -this.outputs[4].out * (abs(prey.outputs[4].out) + 1) * s1 * EATING_CONSTANT;
        b = this.outputs[5].out > 0 ? 0 : -this.outputs[5].out * (abs(prey.outputs[5].out) + 1) * s1 * EATING_CONSTANT;

        this.redEaten += r;
        this.greenEaten += g;
        this.blueEaten += b;
        this.currEaten = r + g + b;
        this.netEaten += this.currEaten;
        prey.currDamage += this.currEaten;
        prey.damageReceived += this.currEaten;
        this.damageCaused += this.currEaten;
      }
    } else if (this.mouth.tile !== null) {
      // Herbivore: eating from tile
      const t = this.mouth.tile;
      const tile = state.tiles[t];

      r = this.outputs[3].out < 0 ? 0 : this.outputs[3].out * s1 * EATING_CONSTANT;
      g = this.outputs[4].out < 0 ? 0 : this.outputs[4].out * s1 * EATING_CONSTANT;
      b = this.outputs[5].out < 0 ? 0 : this.outputs[5].out * s1 * EATING_CONSTANT;

      // Remove food from tile - can dip into negative - in which case POISONS creature
      if (tile.R > -tile.RCap) tile.R -= r / 1.5;
      if (tile.G > -tile.GCap) tile.G -= g;
      if (tile.B > -tile.BCap) tile.B -= b / 2;

      // Multiply by food availability
      r *= tile.R / tile.RCap;
      g *= tile.G / tile.GCap;
      b *= tile.B / tile.BCap;



      if (r > 0) this.redEaten += r;
      if (g > 0) this.greenEaten += g;
      if (b > 0) this.blueEaten += b;

      this.netEaten += abs(r) + abs(g) + abs(b);
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
    c[0] = 50 + round(abs(this.outputs[3].out) * 205);
    c[1] = 50 + round(abs(this.outputs[4].out) * 205);
    c[2] = 50 + round(abs(this.outputs[5].out) * 205);
    c[3] = c[0] + 40;
    c[4] = c[1] + 40;
    c[5] = c[2] + 40;
    c[6] = c[0] + 80;
    c[7] = c[1] + 80;
    c[8] = c[2] + 80;

    // Draw eyes
    ctx.fillStyle = `rgb(${c[6]},${c[7]},${c[8]})`;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(this.eyes[i].x, this.eyes[i].y, this.size / 8, 0, TWOPI);
      ctx.fill();
    }

    // Draw body
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, TWOPI);
    ctx.fill();

    // Draw mouth
    ctx.fillStyle = `rgb(${c[3]},${c[4]},${c[5]})`;
    ctx.beginPath();
    ctx.arc(this.mouth.x, this.mouth.y, this.size / 4, 0, TWOPI);
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
        this.name + '-' + this.gen + (this.alive ? 'A' : 'D') + this.descendants,
        this.x + 2 * this.size,
        this.y - 2 * this.size + 2
      );
    }
  }

  /**
   * Process energy decay and death
   */
  decay(): void {
    // Calculate energy change
    const outputCost =
      abs(this.outputs[0].out) + // velocity x
      abs(this.outputs[1].out) + // velocity y    
      abs(this.outputs[2].out) + // rotation    
      abs(this.outputs[3].out) + // red eating     
      abs(this.outputs[4].out) + // green eating    
      abs(this.outputs[5].out); // blue eating    

    this.energyChange = this.currEaten - this.currDamage - outputCost;

    if (state.stats.livePop > 100) {
      this.energyChange = this.currEaten - this.currDamage - outputCost;
    } else if (state.stats.livePop > 50) {
      this.energyChange = this.currEaten - this.currDamage - outputCost / 2;
    } else {
      this.energyChange = this.currEaten - this.currDamage - outputCost / 4;
    }

    this.energy += this.energyChange;

    if (this.energyChange > 0) {
      this.totalEnergyGain += this.energyChange;
    }

    if (this.energy > this.maxEnergy) {
      this.maxEnergy = this.energy;
    }

    this.health = (this.energy - this.maxEnergy / 2) / (this.maxEnergy / 2);

    // Check for death
    if (this.energy <= 0) {
      this.alive = false;
      state.stats.livePop--;

      // Track lifespan
      const lifespan = state.stats.time - this.born;
      state.stats.netLifespan += lifespan;
      state.stats.deathCount++;

      // Roll back highest index
      if (this.index === state.HIGHESTINDEX) {
        let i = this.index;
        while (i > -1 && !state.amoebs[i].alive) {
          i--;
        }
        state.HIGHESTINDEX = i;
      }

      // Create dead copy for graveyard using structuredClone
      const dead = this.clone();
      dead.index = -(state.graveyard.length + 1);

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

      state.stats.globalNetNRG += this.totalEnergyGain;
      state.graveyard.push(dead);

      this.updateLiveInfoDisplay();
    }
  }

  /**
   * Grow and potentially reproduce
   */
  grow(): void {
    this.size = round(this.energy / 100) / 10;
    if (this.size > MAX_SIZE) {
      this.size = MAX_SIZE;
    } else if (this.size < 1) {
      this.size = 1;
    }

    // Check for reproduction
    if (
      this.energy > (this.outputs[6].out + 1) * 18000 + 2000 &&
      state.stats.livePop < POPCAP
    ) {
      // Find empty slot
      let i = 0;
      while (state.amoebs[i] != null) {
        if (state.amoebs[i].alive) {
          i++;
        } else {
          break;
        }
      }

      if (i > state.HIGHESTINDEX) {
        state.HIGHESTINDEX = i;
      }

      // Split energy
      this.size = round((this.size * 10) / 2) / 10;
      this.energy /= 2;

      // Create mutant offspring
      const mutant = this.clone();
      mutant.mitosis(this);

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
  }

  /**
   * Process neural network thinking
   */
  think(): void {
    let idx = 0;
    this.inputs[idx++].in = this.velocityX / 2;
    this.inputs[idx++].in = this.velocityY / 2;
    this.inputs[idx++].in = this.rotation / 10;
    this.inputs[idx++].in = this.currEaten / (this.size * EATING_CONSTANT * 6);
    this.inputs[idx++].in = (2 * this.size) / MAX_SIZE - 1;
    this.inputs[idx++].in = this.energyChange / (this.size * 10);
    
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

    let input = 0;

    // Calculate output neuron activations
    for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
      for (let j = 0; j < NUM_INPUT_NEURONS; j++) {
        input += this.inputs[j].synapse(o);
      }

      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        if (j !== o) {
          input += this.outputs[j].synapse(o);
        }
      }

      this.outputs[o].in = input;
      input = 0;
    }

    // Clamp outputs
    idx = 0;
    this.outputs[idx++].clamp(); // velocity x
    this.outputs[idx++].clamp(); // velocity y
    this.outputs[idx++].clamp(); // rotation
    this.outputs[idx++].clamp(); // interact red
    this.outputs[idx++].clamp(); // interact green
    this.outputs[idx++].clamp(); // interact blue
    this.outputs[idx++].clamp(); // grow/divide
    this.outputs[idx++].clamp(); // mutation rate
    this.outputs[idx++].clamp(); // mouth left/right
    this.outputs[idx++].clamp(); // mouth front/back

    // Eyes
    for (let eye = 0; eye < 5; eye++) {
      this.outputs[idx++].clamp(); // eye left/right
      this.outputs[idx++].clamp(); // eye front/back
    }
    this.outputs[idx++].clamp(); // adv weight
    this.outputs[idx++].clamp(); // dis weight

  }

  /**
   * Perform mitosis (reproduction with mutation)
   */
  mitosis(parent: Amoeb): void {
    this.descendants = 0;
    this.children = [];
    this.gen = parent.gen + 1;
    this.parent = parent.index;
    this.sibling_idx = parent.children.length;
    this.name = parent.name;
    this.maxEnergy = parent.energy;
    this.born = state.stats.time;
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

    //     ---                                                                                                                                              
    // CMA-ES (Covariance Matrix Adaptation)                                                                                                            
                                                                                                                                                    
    // Core idea: Like NES, but also learns correlations between weights.                                                                               
                                                                                                                                                    
    // If weights 3 and 7 should increase together for success, CMA-ES learns this and samples them in a correlated way. It maintains a full covariance 
    // matrix.                                                                                                                                          
                                                                                                                                                    
    // The gold standard for black-box optimization up to ~1000 parameters. Beyond that, the O(n²) covariance matrix becomes impractical.               
                                                                                                                                                    
    // ---                  

    state.stats.mitoses += 1; 
    // const advWeight = parent.outputs[20].out;
    // const disWeight = parent.outputs[21].out;
    const advWeight = 1;
    const disWeight = 1;

    state.stats.advWeight += advWeight; // if advWeight becomes negative, indicates that NOTHING about this mutation strategy is actually being effective
    state.stats.disWeight += disWeight;

    // Get descendants for weighted mutation
    const _descendants = this.getDescendantIndices(this.parent!, this.parent!);

    // Calculate advantageous mutations
    const advantageous: WeightDeltas[] = [];
    const disadvantageous: WeightDeltas[] = [];




    // FIRST PLACE
    for (let i = 0; i < _descendants.length; i++) {                                                                                                  
      const idx = _descendants[i];                                                                                                                   
      const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];                                                                    
                                                                                                                                                                                                                                                                                          
      if (current.children.length > 0) {                                                                    
        const weightDeltas = this.getWeightDeltas(current, parent);                                                                         
        for (let c = 0; c < current.children.length; c++) {    
          advantageous.push(weightDeltas);                                                                                            
        }                                                                                                                                            
      } else if (idx < 0) {                                                                                                                          
        disadvantageous.push(this.getWeightDeltas(current, parent));                                                                        
      }                                                                                                                                              
    }      

    // for (let i = 0; i < _descendants.length; i++) {                                                                                                  
    //   const idx = _descendants[i];                                                                                                                   
    //   const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];                                                                    
                                                                                                                                                    
    //   if (current.parent === null) continue;                                                                                                         
    //   const immediateParent = current.parent >= 0 ? state.amoebs[current.parent] : state.graveyard[-(current.parent + 1)];                                                                                                    
                                                                                                                                                    
    //   if (current.children.length > 0) {                                                                    
    //     const weightDeltas = this.getWeightDeltas(current, immediateParent);                                                                         
    //     for (let c = 0; c < current.children.length; c++) {                                                 
    //       advantageous.push(weightDeltas);                                                                                                           
    //     }                                                                                                                                            
    //   } else if (idx < 0) {                                                                                                                          
    //     disadvantageous.push(this.getWeightDeltas(current, immediateParent));                                                                        
    //   }                                                                                                                                              
    // }         


    // for (let i = 0; i < _descendants.length; i++) {                                                                                                  
    //   const idx = _descendants[i];                                                                                                                   
    //   const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];                                                                    
                                                                                                                                                                                                                                
    //   if (current.parent === null) continue;                                                                                                         
    //   const immediateParent = current.parent >= 0 ? state.amoebs[current.parent] : state.graveyard[-(current.parent + 1)];                                                                                                    
                                                                                                                                                    
    //   if (current.descendants > 0) {                                                                                                                 
    //     const weightDeltas = this.getWeightDeltas(current, immediateParent);                                                        
    //     for(let d = 0; d < current.descendants; d++) {                                                                                               
    //       advantageous.push(weightDeltas);                                                                                                           
    //     }                                                                                                                                            
    //   } else if(idx < 0) {                                                                                                                           
    //     disadvantageous.push(this.getWeightDeltas(current, immediateParent));                                                          
    //   }                                                                                                                                              
    // }  

    // SECOND PLACE
    // for (let i = 0; i < _descendants.length; i++) {
    //   const idx = _descendants[i];
    //   const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
    //   if (current.descendants > 0) {
    //     const weightDeltas = this.getWeightDeltas(current, parent)
    //     for(let d = 0; d < current.descendants; d++ ) {
    //       advantageous.push(weightDeltas);
    //     }
    //   } else if(idx < 0) { // if dead without descendants
    //     disadvantageous.push(this.getWeightDeltas(current, parent));
    //   }
    // }


    // Add average of advantageous deltas
    const advCount = advantageous.length;
    const disCount = disadvantageous.length;

    const SIGMA_RATE = 0.02;

    // 1. Mutate per-synapse sigmas first (they gate everything else)
    //    Uses same bias-toward-zero formula: sigma tends toward 0 unless selection maintains it
    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        this.inputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas1[j]) * SIGMA_RATE / (advCount+1);
        this.inputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.inputs[i].sigmas2[j]) * SIGMA_RATE / (advCount+1);

      }
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        this.outputs[i].sigmas1[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas1[j]) * SIGMA_RATE / (advCount+1);
        this.outputs[i].sigmas2[j] += (2 * Math.random() - 1 - this.outputs[i].sigmas2[j]) * SIGMA_RATE / (advCount+1);

      }
    }

    // 2. Apply adv/dis sigma deltas (learn which sigmas led to success/failure)
    for (let a = 0; a < advCount; a++) {
      const adv = advantageous[a];
      for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.inputs[i].sigmas1[j] += adv.in_sigmas1_deltas[i][j] / (advCount+1);
          this.inputs[i].sigmas2[j] += adv.in_sigmas2_deltas[i][j] / (advCount+1);
        }
      }
      for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.outputs[i].sigmas1[j] += adv.out_sigmas1_deltas[i][j] / (advCount+1);
          this.outputs[i].sigmas2[j] += adv.out_sigmas2_deltas[i][j] / (advCount+1);
        }
      }
    }

    // TEST IDEA: on very negative sigma: try:
    // 1) regressing towards parent's value? like backwards progress
    // 2) Clamp the negative for processing below, but STORE the negative value in neuron.sigmas1/2, and DO NOT FORGET: 
    //    negative value 'debt' is to be removed by slowly adding positive values (mutation above) and trending towards zero, at which point the neuron can be flexible again
    // 3) negative value is an indicator telling us to increase mutation elsewhere?

    for (let d = 0; d < disCount; d++) {
      const dis = disadvantageous[d];
      for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.inputs[i].sigmas1[j] -= dis.in_sigmas1_deltas[i][j] / disCount;
          this.inputs[i].sigmas2[j] -= dis.in_sigmas2_deltas[i][j] / disCount;
        }
      }
      for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.outputs[i].sigmas1[j] -= dis.out_sigmas1_deltas[i][j] / disCount;
          this.outputs[i].sigmas2[j] -= dis.out_sigmas2_deltas[i][j] / disCount;
        }
      }
    }

    // Clamp sigmas to >= 0 - VERY IMPORTANT! tells our weights NOT to move!
    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        if (this.inputs[i].sigmas1[j] < 0) this.inputs[i].sigmas1[j] = 0;
        if (this.inputs[i].sigmas2[j] < 0) this.inputs[i].sigmas2[j] = 0;
      }
    }
    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        if (this.outputs[i].sigmas1[j] < 0) this.outputs[i].sigmas1[j] = 0;
        if (this.outputs[i].sigmas2[j] < 0) this.outputs[i].sigmas2[j] = 0;
      }
    }

    /* * * * * * * * * * * * WORKS DAMN WELL * * * * * * * * * */
    // FIRST PLACE!

    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {                                                                                                                                                     
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {                                                                                                                                                  
        const s1 = this.inputs[i].sigmas1[j];                                                                                                                                                         
        const s2 = this.inputs[i].sigmas2[j];                                                                                                                                                         
        this.inputs[i].weights1[j] += Math.abs(s1) * (2 * Math.random() - 1 - this.inputs[i].weights1[j]) / (advCount+1);                                                                                                                    
        this.inputs[i].weights2[j] += Math.abs(s2) * (2 * Math.random() - 1 - this.inputs[i].weights2[j]) / (advCount+1);                                                                                                                    
      }                                                                                                                                                                                               
    }                                                                                                                                                                                                 
                                                                                                                                                                                                      
    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {                                                                                                                                                    
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {                                                                                                                                                  
        const s1 = this.outputs[i].sigmas1[j];                                                                                                                                                        
        const s2 = this.outputs[i].sigmas2[j];                                                                                                                                                        
        this.outputs[i].weights1[j] += Math.abs(s1) * (2 * Math.random() - 1 - this.outputs[i].weights1[j]) / (advCount+1);                                                                                                                   
        this.outputs[i].weights2[j] += Math.abs(s2) * (2 * Math.random() - 1 - this.outputs[i].weights2[j]) / (advCount+1);                                                                                                                   
      }                                                                                                                                                                                               
    }      
    /* * * * * * * * * * * * WORKS DAMN WELL * * * * * * * * * */ 


    // 4. Apply advantageous weight deltas
    for (let a = 0; a < advCount; a++) {
      const adv = advantageous[a];
      for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.inputs[i].weights1[j] += advWeight * adv.in_weights1_deltas[i][j] / (advCount+1);
          this.inputs[i].weights2[j] += advWeight * adv.in_weights2_deltas[i][j] / (advCount+1);
        }
      }

      for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
        for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
          this.outputs[i].weights1[j] += advWeight * adv.out_weights1_deltas[i][j] / (advCount+1);
          this.outputs[i].weights2[j] += advWeight * adv.out_weights2_deltas[i][j] / (advCount+1);
        }
      }
    }

    
    // THIS MAKES IT PERFORM WORSE:
    // in high-dimensional spaces, "the opposite of wrong" is almost never "right."                                                                                                      
                                                                                                                                                                                                        
    //   There are ~2000 weights... There's a narrow ridge of success and a vast plain of failure surrounding it. Successful descendants cluster near the ridge — average them and you get the ridge. Failed  
    //   descendants are scattered all over the plain — average them and you get the center of nothing useful.     

    //  Adv works because success is specific. A descendant that reproduced had a working weight configuration. Multiple successes likely found similar solutions. Their deltas are coherent — they point 
    // in roughly the same direction. Averaging reinforces the signal.                                                                                                                                   
                                                                                                                                                                                                      
    // Dis fails because failure is diverse. One descendant died because weight #47 was too high. Another died because weight #812 was too low. Another died from bad luck, not weights at all. Their    
    // deltas point in random directions. Averaging them cancels out to near-zero, or worse — points somewhere arbitrary. Subtracting an arbitrary direction damages weights that were fine.             
                                                                                                                                                                                                      
    // The per-weight collateral damage problem. If a descendant died because 1 out of 2000 weights was catastrophic, subtracting its full delta vector "corrects" all 2000 weights — the 1999 that were 
    // fine get pushed in a wrong direction. Adv doesn't suffer this as badly because if something reproduced, most of its weights were at least functional.                                             
                                                                                                                                                                                                      
    // Why dis works for sigma but not weights. Sigma asks "should this synapse keep changing?" — a magnitude question. If descendants with big deltas on synapse X keep dying, that's a clear signal:   
    // stop changing X. You don't need direction, just "movement = bad." Weights need direction, and failure doesn't give you coherent direction.      


    // 5. Apply disadvantageous weight deltas
    // for (let d = 0; d < disCount; d++) {
    //   const dis = disadvantageous[d];
    //   for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
    //       this.inputs[i].weights1[j] -= disWeight * dis.in_weights1_deltas[i][j];
    //       this.inputs[i].weights2[j] -= disWeight * dis.in_weights2_deltas[i][j];
    //     }
    //   }

    //   for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    //     for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
    //       this.outputs[i].weights1[j] -= disWeight * dis.out_weights1_deltas[i][j];
    //       this.outputs[i].weights2[j] -= disWeight * dis.out_weights2_deltas[i][j];
    //     }
    //   }
    // }
    
    this.updateLiveInfoDisplay();
  }






























  
  /**
   * Get all descendants of an animal
   */

  private getDescendantIndices(idx: number, orig: number): number[] {
  const indices: number[] = [];
  const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
  if (!current) return indices;

  for (const childIdx of current.children) {
    indices.push(...this.getDescendantIndices(childIdx, orig));
  }

  // Exclude the original starting node from results
  if (idx !== orig) {
    indices.push(idx);
  }

  return indices;
}
  /**
   * Calculate weight deltas between current and base animal
   */
  private getWeightDeltas(current: Amoeb, base: Amoeb): WeightDeltas {
    const in_weights1_deltas: number[][] = [];
    const in_weights2_deltas: number[][] = [];
    const out_weights1_deltas: number[][] = [];
    const out_weights2_deltas: number[][] = [];
    const in_sigmas1_deltas: number[][] = [];
    const in_sigmas2_deltas: number[][] = [];
    const out_sigmas1_deltas: number[][] = [];
    const out_sigmas2_deltas: number[][] = [];

    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      const w1_deltas: number[] = [];
      const w2_deltas: number[] = [];
      const s1_deltas: number[] = [];
      const s2_deltas: number[] = [];
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        w1_deltas[j] = current.inputs[i].weights1[j] - base.inputs[i].weights1[j];
        w2_deltas[j] = current.inputs[i].weights2[j] - base.inputs[i].weights2[j];
        s1_deltas[j] = (current.inputs[i].sigmas1?.[j] ?? 1) - (base.inputs[i].sigmas1?.[j] ?? 1);
        s2_deltas[j] = (current.inputs[i].sigmas2?.[j] ?? 1) - (base.inputs[i].sigmas2?.[j] ?? 1);
      }
      in_weights1_deltas.push(w1_deltas);
      in_weights2_deltas.push(w2_deltas);
      in_sigmas1_deltas.push(s1_deltas);
      in_sigmas2_deltas.push(s2_deltas);
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      const w1_deltas: number[] = [];
      const w2_deltas: number[] = [];
      const s1_deltas: number[] = [];
      const s2_deltas: number[] = [];
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        w1_deltas[j] = current.outputs[i].weights1[j] - base.outputs[i].weights1[j];
        w2_deltas[j] = current.outputs[i].weights2[j] - base.outputs[i].weights2[j];
        s1_deltas[j] = (current.outputs[i].sigmas1?.[j] ?? 1) - (base.outputs[i].sigmas1?.[j] ?? 1);
        s2_deltas[j] = (current.outputs[i].sigmas2?.[j] ?? 1) - (base.outputs[i].sigmas2?.[j] ?? 1);
      }
      out_weights1_deltas.push(w1_deltas);
      out_weights2_deltas.push(w2_deltas);
      out_sigmas1_deltas.push(s1_deltas);
      out_sigmas2_deltas.push(s2_deltas);
    }

    return {
      in_weights1_deltas, in_weights2_deltas, out_weights1_deltas, out_weights2_deltas,
      in_sigmas1_deltas, in_sigmas2_deltas, out_sigmas1_deltas, out_sigmas2_deltas,
    };
  }

  /**
   * Kill this animal
   */
  kill(): void {
    if (this.alive) {
      this.energy = -1;
    }
  }

  /**
   * Reincarnate a dead animal
   */
  reincarnate(): void {
    if (!this.alive && state.stats.livePop < POPCAP) {
      let i = 0;
      while (state.amoebs[i] != null) {
        if (state.amoebs[i].alive) {
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

    if (!this.alive) {
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
        ctx.arc(round(this.eyes[i].x), round(this.eyes[i].y), round(this.size / 5), 0, TWOPI);
        ctx.stroke();
      }
    }

    // Draw name
    const posx = this.x + 2 * s;
    let posy = this.y - 2 * s;
    if (this.alive) {
      ctx.fillText(this.name + '-' + this.gen + (this.alive ? 'A' : 'D') + this.descendants, posx, posy + 2);
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
      nameEl.innerHTML = this.name + '-' + this.gen + (this.alive ? 'A' : 'D') + this.descendants;
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


    const bornEl = document.getElementById('stats-born');
    if (bornEl) bornEl.innerHTML = '<b>' + this.born + '</b>';

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
   * Create a deep clone of this amoeb
   * Uses structuredClone where possible, falls back to manual copy
   */
  clone(): Amoeb {
    const clone = new Amoeb(this.x, this.y, this.index);

    // Copy primitive properties
    clone.alive = this.alive;
    clone.tile = this.tile;
    clone.size = this.size;
    clone.health = this.health;
    clone.gen = this.gen;
    clone.parent = this.parent;
    clone.sibling_idx = this.sibling_idx;
    clone.children = [...this.children];
    clone.descendants = this.descendants;
    clone.proGenes = this.proGenes;
    clone.conGenes = this.conGenes;
    clone.name = this.name;
    clone.velocityX = this.velocityX;
    clone.velocityY = this.velocityY;
    clone.rotation = this.rotation;
    clone.direction = this.direction;
    clone.currEaten = this.currEaten;
    clone.redEaten = this.redEaten;
    clone.greenEaten = this.greenEaten;
    clone.blueEaten = this.blueEaten;
    clone.netEaten = this.netEaten;
    clone.energy = this.energy;
    clone.maxEnergy = this.maxEnergy;
    clone.energyChange = this.energyChange;
    clone.totalEnergyGain = this.totalEnergyGain;
    clone.currDamage = this.currDamage;
    clone.damageReceived = this.damageReceived;
    clone.damageCaused = this.damageCaused;
    clone.lr = this.lr;

    // Clone eyes
    for (let i = 0; i < 5; i++) {
      clone.eyes[i] = new Eye(this.eyes[i].x, this.eyes[i].y);
      clone.eyes[i].tile = this.eyes[i].tile;
      clone.eyes[i].r = this.eyes[i].r;
      clone.eyes[i].g = this.eyes[i].g;
      clone.eyes[i].b = this.eyes[i].b;
      clone.eyes[i].s = this.eyes[i].s;
      clone.eyes[i].detected = this.eyes[i].detected;
    }

    // Clone mouth
    clone.mouth = new Mouth(this.mouth.x, this.mouth.y);
    clone.mouth.tile = this.mouth.tile;
    clone.mouth.r = this.mouth.r;
    clone.mouth.g = this.mouth.g;
    clone.mouth.b = this.mouth.b;
    clone.mouth.s = this.mouth.s;
    clone.mouth.detected = this.mouth.detected;

    // Clone neurons with Float32Arrays
    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      clone.inputs[i] = new Neuron();
      clone.inputs[i].weights1 = new Float32Array(this.inputs[i].weights1);
      clone.inputs[i].weights2 = new Float32Array(this.inputs[i].weights2);
      clone.inputs[i].sigmas1 = new Float32Array(this.inputs[i].sigmas1);
      clone.inputs[i].sigmas2 = new Float32Array(this.inputs[i].sigmas2);
      clone.inputs[i].in = this.inputs[i].in;
      clone.inputs[i].out = this.inputs[i].out;
    }

    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      clone.outputs[i] = new Neuron();
      clone.outputs[i].weights1 = new Float32Array(this.outputs[i].weights1);
      clone.outputs[i].weights2 = new Float32Array(this.outputs[i].weights2);
      clone.outputs[i].sigmas1 = new Float32Array(this.outputs[i].sigmas1);
      clone.outputs[i].sigmas2 = new Float32Array(this.outputs[i].sigmas2);
      clone.outputs[i].in = this.outputs[i].in;
      clone.outputs[i].out = this.outputs[i].out;
    }

    // Clone color array
    clone.cols = new Uint8ClampedArray(this.cols);

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
