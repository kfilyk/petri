// Save/Load utilities for simulation state
// Uses generic serialization — no per-field interfaces needed.
// Adding a new field to any entity class automatically includes it in saves.

import { state } from '../state';
import { Amoeba } from '../entities/Amoeba';
import { Tile } from '../entities/Tile';
import { Neuron } from '../entities/Neuron';
import { Eye } from '../entities/Eye';
import { Mouth } from '../entities/Mouth';
import { NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS, TILENUMBER } from '../constants';

/**
 * Top-level save format — only this interface is maintained manually.
 */
interface SaveData {
  version: number;
  timestamp: number;
  stats: typeof state.stats;
  history: typeof state.history;
  HIGHESTINDEX: number;
  highlighted: number | null;
  newest: number | null;
  tiles: Record<string, any>[];
  amoebs: (Record<string, any> | null)[];
  graveyard: Record<string, any>[];
}

// ─── Generic helpers ────────────────────────────────────────────────

/**
 * Deep-serialize any entity instance to a plain JSON-safe object.
 * Handles Float32Array/Uint8ClampedArray → regular arrays,
 * plain arrays → shallow copy, and nested objects with serialize().
 */
function serialize(obj: any): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val instanceof Float32Array || val instanceof Uint8ClampedArray) {
      out[key] = Array.from(val);
    } else if (Array.isArray(val)) {
      // Array of objects that have their own fields (Eye, Neuron, etc.)
      out[key] = val.map((item: any) =>
        item !== null && typeof item === 'object' && !(item instanceof Float32Array)
          ? serialize(item)
          : item
      );
    } else if (val !== null && typeof val === 'object') {
      out[key] = serialize(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

/**
 * Copy all serialized fields onto a target instance.
 * Reconstructs Float32Arrays from plain arrays based on what the target already has.
 */
function deserializeInto(target: any, data: Record<string, any>): void {
  for (const key of Object.keys(data)) {
    if (!(key in target)) continue; // skip unknown keys from old saves
    const val = data[key];
    const existing = target[key];

    if (existing instanceof Float32Array) {
      target[key] = new Float32Array(val);
    } else if (existing instanceof Uint8ClampedArray) {
      target[key] = new Uint8ClampedArray(val);
    } else if (Array.isArray(val) && Array.isArray(existing)) {
      // For primitive arrays (children, neighbors, cols), shallow copy
      // For object arrays (eyes, inputs, outputs), handled specially by caller
      target[key] = [...val];
    } else {
      target[key] = val;
    }
  }
}

// ─── Neuron ─────────────────────────────────────────────────────────

function serializeNeuron(neuron: Neuron): Record<string, any> {
  return serialize(neuron);
}

function deserializeNeuron(data: Record<string, any>): Neuron {
  const neuron = new Neuron();
  // Float32Arrays need reconstruction from plain arrays
  neuron.weights1 = new Float32Array(data.weights1 || []);
  neuron.weights2 = new Float32Array(data.weights2 || []);
  neuron.in = data.in ?? 0;
  neuron.out = data.out ?? 0;
  return neuron;
}

// ─── Eye / Mouth ────────────────────────────────────────────────────

function deserializeEye(data: Record<string, any>): Eye {
  const eye = new Eye(data.x, data.y);
  deserializeInto(eye, data);
  return eye;
}

function deserializeMouth(data: Record<string, any>): Mouth {
  const mouth = new Mouth(data.x, data.y);
  deserializeInto(mouth, data);
  return mouth;
}

// ─── Tile ───────────────────────────────────────────────────────────

function serializeTile(tile: Tile): Record<string, any> {
  return serialize(tile);
}

function deserializeTile(data: Record<string, any>): Tile {
  const tile = new Tile(data.x, data.y, data.num, data.neighbors || []);
  deserializeInto(tile, data);
  return tile;
}

// ─── Amoeba ─────────────────────────────────────────────────────────

function serializeAmoeb(amoeba: Amoeba): Record<string, any> {
  return serialize(amoeba);
}

function deserializeAmoeb(data: Record<string, any>): Amoeba {
  const amoeba = new Amoeba(data.x, data.y, data.index);

  // Deserialize all primitive/array fields generically
  deserializeInto(amoeba, data);

  // Rebuild complex nested objects that need their constructors
  amoeba.eyes = (data.eyes || []).map(deserializeEye);
  amoeba.mouth = deserializeMouth(data.mouth);
  amoeba.inputs = (data.inputs || []).map(deserializeNeuron);
  amoeba.outputs = (data.outputs || []).map(deserializeNeuron);

  return amoeba;
}

// ─── Public API ─────────────────────────────────────────────────────

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

  if (saveData.version !== 1) {
    console.warn(`Save version ${saveData.version} may not be compatible`);
  }

  Object.assign(state.stats, saveData.stats);

  state.history.aveChildren = [...saveData.history.aveChildren];
  state.history.avePosNRG = [...saveData.history.avePosNRG];

  state.HIGHESTINDEX = saveData.HIGHESTINDEX;
  state.highlighted = saveData.highlighted;
  state.newest = saveData.newest;

  for (let i = 0; i < saveData.tiles.length && i < TILENUMBER; i++) {
    state.tiles[i] = deserializeTile(saveData.tiles[i]);
  }

  for (let i = 0; i < saveData.amoebs.length; i++) {
    const data = saveData.amoebs[i];
    state.amoebs[i] = data ? deserializeAmoeb(data) : null as any;
  }

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
