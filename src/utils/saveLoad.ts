// Save/Load utilities for simulation state

import { state } from '../state';
import { Amoeb } from '../entities/Amoeb';
import { Tile } from '../entities/Tile';
import { Neuron } from '../entities/Neuron';
import { Eye } from '../entities/Eye';
import { Mouth } from '../entities/Mouth';
import { NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS, TILENUMBER } from '../constants';

/**
 * Serializable representation of the simulation state
 */
interface SaveData {
  version: number;
  timestamp: number;
  stats: typeof state.stats;
  history: typeof state.history;
  HIGHESTINDEX: number;
  highlighted: number | null;
  newest: number | null;
  tiles: SerializedTile[];
  amoebs: (SerializedAmoeb | null)[];
  graveyard: SerializedAmoeb[];
}

interface SerializedTile {
  x: number;
  y: number;
  num: number;
  neighbors: number[];
  regenRate: number;
  RCap: number;
  GCap: number;
  BCap: number;
  R: number;
  G: number;
  B: number;
}

interface SerializedNeuron {
  weights1: number[];
  weights2: number[];
  sigmas1?: number[];
  sigmas2?: number[];
  in: number;
  out: number;
}

interface SerializedEye {
  x: number;
  y: number;
  tile: number | null;
  r: number;
  g: number;
  b: number;
  s: number;
  detected: number;
}

interface SerializedMouth {
  x: number;
  y: number;
  tile: number | null;
  r: number;
  g: number;
  b: number;
  s: number;
  detected: number;
}

interface SerializedAmoeb {
  index: number;
  x: number;
  y: number;
  status: 'alive' | 'decaying' | 'dead';
  tile: number | null;
  size: number;
  health: number;
  gen: number;
  birthTime: number;
  parent: number | null;
  sibling_idx: number | null;
  children: number[];
  descendants: number;
  proGenes: number;
  conGenes: number;
  name: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  direction: number;
  redEaten: number;
  greenEaten: number;
  blueEaten: number;
  currEaten: number;
  netEaten: number;
  energy: number;
  maxEnergy: number;
  energyChange: number;
  totalEnergyGain: number;
  currDamage: number;
  damageReceived: number;
  damageCaused: number;
  eyes: SerializedEye[];
  mouth: SerializedMouth;
  inputs: SerializedNeuron[];
  outputs: SerializedNeuron[];
}

/**
 * Serialize a Neuron to plain object
 */
function serializeNeuron(neuron: Neuron): SerializedNeuron {
  return {
    weights1: Array.from(neuron.weights1),
    weights2: Array.from(neuron.weights2),
    sigmas1: Array.from(neuron.sigmas1),
    sigmas2: Array.from(neuron.sigmas2),
    in: neuron.in,
    out: neuron.out,
  };
}

/**
 * Deserialize a Neuron from plain object
 */
function deserializeNeuron(data: SerializedNeuron): Neuron {
  const neuron = new Neuron();
  neuron.weights1 = new Float32Array(data.weights1);
  neuron.weights2 = new Float32Array(data.weights2);
  neuron.sigmas1 = data.sigmas1 ? new Float32Array(data.sigmas1) : new Float32Array(data.weights1.length).fill(0);
  neuron.sigmas2 = data.sigmas2 ? new Float32Array(data.sigmas2) : new Float32Array(data.weights2.length).fill(0);
  neuron.in = data.in;
  neuron.out = data.out;
  return neuron;
}

/**
 * Serialize an Eye to plain object
 */
function serializeEye(eye: Eye): SerializedEye {
  return {
    x: eye.x,
    y: eye.y,
    tile: eye.tile,
    r: eye.r,
    g: eye.g,
    b: eye.b,
    s: eye.s,
    detected: eye.detected,
  };
}

/**
 * Deserialize an Eye from plain object
 */
function deserializeEye(data: SerializedEye): Eye {
  const eye = new Eye(data.x, data.y);
  eye.tile = data.tile;
  eye.r = data.r;
  eye.g = data.g;
  eye.b = data.b;
  eye.s = data.s;
  eye.detected = data.detected;
  return eye;
}

/**
 * Serialize a Mouth to plain object
 */
function serializeMouth(mouth: Mouth): SerializedMouth {
  return {
    x: mouth.x,
    y: mouth.y,
    tile: mouth.tile,
    r: mouth.r,
    g: mouth.g,
    b: mouth.b,
    s: mouth.s,
    detected: mouth.detected,
  };
}

/**
 * Deserialize a Mouth from plain object
 */
function deserializeMouth(data: SerializedMouth): Mouth {
  const mouth = new Mouth(data.x, data.y);
  mouth.tile = data.tile;
  mouth.r = data.r;
  mouth.g = data.g;
  mouth.b = data.b;
  mouth.s = data.s;
  mouth.detected = data.detected;
  return mouth;
}

/**
 * Serialize a Tile to plain object
 */
function serializeTile(tile: Tile): SerializedTile {
  return {
    x: tile.x,
    y: tile.y,
    num: tile.num,
    neighbors: [...tile.neighbors],
    regenRate: tile.regenRate,
    RCap: tile.RCap,
    GCap: tile.GCap,
    BCap: tile.BCap,
    R: tile.R,
    G: tile.G,
    B: tile.B,
  };
}

/**
 * Deserialize a Tile from plain object
 */
function deserializeTile(data: SerializedTile): Tile {
  const tile = new Tile(data.x, data.y, data.num, data.neighbors);
  tile.regenRate = data.regenRate;
  tile.RCap = data.RCap;
  tile.GCap = data.GCap;
  tile.BCap = data.BCap;
  tile.R = data.R;
  tile.G = data.G;
  tile.B = data.B;
  return tile;
}

/**
 * Serialize an Amoeb to plain object
 */
function serializeAmoeb(amoeb: Amoeb): SerializedAmoeb {
  return {
    index: amoeb.index,
    x: amoeb.x,
    y: amoeb.y,
    status: amoeb.status,
    tile: amoeb.tile,
    size: amoeb.size,
    health: amoeb.health,
    gen: amoeb.gen,
    birthTime: amoeb.born,
    parent: amoeb.parent,
    sibling_idx: amoeb.sibling_idx,
    children: [...amoeb.children],
    descendants: amoeb.descendants,
    proGenes: amoeb.proGenes,
    conGenes: amoeb.conGenes,
    name: amoeb.name,
    velocityX: amoeb.velocityX,
    velocityY: amoeb.velocityY,
    rotation: amoeb.rotation,
    direction: amoeb.direction,
    redEaten: amoeb.redEaten,
    greenEaten: amoeb.greenEaten,
    blueEaten: amoeb.blueEaten,
    currEaten: amoeb.currEaten,
    netEaten: amoeb.netEaten,
    energy: amoeb.energy,
    maxEnergy: amoeb.maxEnergy,
    energyChange: amoeb.energyChange,
    totalEnergyGain: amoeb.totalEnergyGain,
    currDamage: amoeb.currDamage,
    damageReceived: amoeb.damageReceived,
    damageCaused: amoeb.damageCaused,
    eyes: amoeb.eyes.map(serializeEye),
    mouth: serializeMouth(amoeb.mouth),
    inputs: amoeb.inputs.map(serializeNeuron),
    outputs: amoeb.outputs.map(serializeNeuron),
  };
}

/**
 * Deserialize an Amoeb from plain object
 */
function deserializeAmoeb(data: SerializedAmoeb): Amoeb {
  const amoeb = new Amoeb(data.x, data.y, data.index);

  amoeb.status = data.status;
  amoeb.tile = data.tile;
  amoeb.size = data.size;
  amoeb.health = data.health;
  amoeb.gen = data.gen;
  amoeb.born = data.birthTime;
  amoeb.parent = data.parent;
  amoeb.sibling_idx = data.sibling_idx;
  amoeb.children = [...data.children];
  amoeb.descendants = data.descendants;
  amoeb.proGenes = data.proGenes;
  amoeb.conGenes = data.conGenes;
  amoeb.name = data.name;
  amoeb.velocityX = data.velocityX;
  amoeb.velocityY = data.velocityY;
  amoeb.rotation = data.rotation;
  amoeb.direction = data.direction;
  amoeb.redEaten = data.redEaten;
  amoeb.greenEaten = data.greenEaten;
  amoeb.blueEaten = data.blueEaten;
  amoeb.currEaten = data.currEaten;
  amoeb.netEaten = data.netEaten;
  amoeb.energy = data.energy;
  amoeb.maxEnergy = data.maxEnergy;
  amoeb.energyChange = data.energyChange;
  amoeb.totalEnergyGain = data.totalEnergyGain;
  amoeb.currDamage = data.currDamage;
  amoeb.damageReceived = data.damageReceived;
  amoeb.damageCaused = data.damageCaused;

  // Deserialize eyes
  amoeb.eyes = data.eyes.map(deserializeEye);

  // Deserialize mouth
  amoeb.mouth = deserializeMouth(data.mouth);

  // Deserialize neurons
  amoeb.inputs = data.inputs.map(deserializeNeuron);
  amoeb.outputs = data.outputs.map(deserializeNeuron);

  return amoeb;
}

/**
 * Save the current simulation state to a JSON string
 */
export function saveState(): string {
  const saveData: SaveData = {
    version: 1,
    timestamp: Date.now(),
    stats: { ...state.stats },
    history: {
      aveChildren: [...state.history.aveChildren],
      aveLifespan: [...state.history.aveLifespan],
      avePosNRG: [...state.history.avePosNRG],
    },
    HIGHESTINDEX: state.HIGHESTINDEX,
    highlighted: state.highlighted,
    newest: state.newest,
    tiles: state.tiles.map(serializeTile),
    amoebs: state.amoebs.map(a => a ? serializeAmoeb(a) : null),
    graveyard: state.graveyard.map(serializeAmoeb),
  };

  return JSON.stringify(saveData);
}

/**
 * Load simulation state from a JSON string
 */
export function loadState(jsonString: string): void {
  const saveData: SaveData = JSON.parse(jsonString);

  // Version check for future compatibility
  if (saveData.version !== 1) {
    console.warn(`Save version ${saveData.version} may not be compatible`);
  }

  // Restore stats
  Object.assign(state.stats, saveData.stats);

  // Restore history
  state.history.aveChildren = [...saveData.history.aveChildren];
  state.history.aveLifespan = [...saveData.history.aveLifespan];
  state.history.avePosNRG = [...saveData.history.avePosNRG];

  // Restore indices
  state.HIGHESTINDEX = saveData.HIGHESTINDEX;
  state.highlighted = saveData.highlighted;
  state.newest = saveData.newest;

  // Restore tiles
  for (let i = 0; i < saveData.tiles.length && i < TILENUMBER; i++) {
    state.tiles[i] = deserializeTile(saveData.tiles[i]);
  }

  // Restore amoebs
  for (let i = 0; i < saveData.amoebs.length; i++) {
    const data = saveData.amoebs[i];
    state.amoebs[i] = data ? deserializeAmoeb(data) : null as any;
  }

  // Restore graveyard
  state.graveyard = saveData.graveyard.map(deserializeAmoeb);

  console.log(`Loaded save from ${new Date(saveData.timestamp).toLocaleString()}`);
}

/**
 * Download the current state as a JSON file
 */
export function downloadState(filename?: string): void {
  const json = saveState();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `petri-save-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Load state from a file input
 */
export function loadStateFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        loadState(json);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
