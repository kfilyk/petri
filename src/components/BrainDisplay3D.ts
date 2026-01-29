// BrainDisplay3D - 3D visualization of neural network using Three.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NUM_INPUT_NEURONS, NUM_OUTPUT_NEURONS } from '../constants';
import type { Amoeb } from '../entities/Amoeb';
import { state } from '../state';

// Labels
const INPUT_LABELS = [
  'VELX', 'VELY', 'ROT', 'EATN', 'SIZE', 'ECHG',
  'MR', 'MG', 'MB', 'MS',
  'E1R', 'E1G', 'E1B', 'E1S',
  'E2R', 'E2G', 'E2B', 'E2S',
  'E3R', 'E3G', 'E3B', 'E3S',
  'E4R', 'E4G', 'E4B', 'E4S',
  'E5R', 'E5G', 'E5B', 'E5S',
  'B+', 'B-',
];

const OUTPUT_LABELS = [
  'VELX', 'VELY', 'ROT',
  'EATR', 'EATG', 'EATB',
  'REPR', 'MUT',
  'MX', 'MY',
  'E1X', 'E1Y', 'E2X', 'E2Y', 'E3X', 'E3Y', 'E4X', 'E4Y', 'E5X', 'E5Y',
];

// Scene objects
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let brainGroup: THREE.Group | null = null;
let synapseMesh: THREE.Mesh | null = null;

// Neuron meshes for raycasting
const inputNeuronMeshes: THREE.Mesh[] = [];
const outputNeuronMeshes: THREE.Mesh[] = [];

// Neuron label sprites
const inputLabelSprites: THREE.Sprite[] = [];
const outputLabelSprites: THREE.Sprite[] = [];

// Neuron positions on sphere
const inputPositions: THREE.Vector3[] = [];
const outputPositions: THREE.Vector3[] = [];

// Selected neurons for weight display
const selectedNeurons: { type: 'input' | 'output'; index: number }[] = [];

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Container and overlay elements
let container: HTMLElement | null = null;
let labelsOverlay: HTMLElement | null = null;

// Sphere parameters
const BRAIN_RADIUS = 2;
const NEURON_RADIUS = 0.08;
const LABEL_OFFSET = 0.1; // How far above neuron the label floats

// Current animal reference
let currentAnimal: Amoeb | null = null;

interface WeightDeltas {
  advW1: number[];
  advW2: number[];
  disW1: number[];
  disW2: number[];
  advCount: number;
  disCount: number;
}

/**
 * Calculate weight deltas from descendants (matches Amoeb.ts mitosis logic)
 * Uses: Immediate Parent + Children weighting
 */
function calculateWeightDeltas(amoeb: Amoeb, neuronType: 'input' | 'output', neuronIndex: number): WeightDeltas {
  const numWeights = NUM_OUTPUT_NEURONS;
  const advW1 = new Array(numWeights).fill(0);
  const advW2 = new Array(numWeights).fill(0);
  const disW1 = new Array(numWeights).fill(0);
  const disW2 = new Array(numWeights).fill(0);

  if (amoeb.parent === null) {
    return { advW1, advW2, disW1, disW2, advCount: 0, disCount: 0 };
  }

  // Get all descendants of the parent (siblings, nephews, etc.)
  const descendants = getDescendantIndices(amoeb.parent, amoeb.parent);

  let advCount = 0;
  let disCount = 0;

  for (const idx of descendants) {
    const desc = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
    if (!desc) continue;

    // Get descendant's IMMEDIATE parent (not the original ancestor)
    if (desc.parent === null) continue;
    const immediateParent = desc.parent >= 0
      ? state.amoebs[desc.parent]
      : state.graveyard[-(desc.parent + 1)];
    if (!immediateParent) continue;

    const descNeuron = neuronType === 'input' ? desc.inputs[neuronIndex] : desc.outputs[neuronIndex];
    const immParentNeuron = neuronType === 'input' ? immediateParent.inputs[neuronIndex] : immediateParent.outputs[neuronIndex];

    if (desc.children.length > 0) {
      // Advantageous: has children - weight by children.length
      for (let c = 0; c < desc.children.length; c++) {
        for (let j = 0; j < numWeights; j++) {
          advW1[j] += descNeuron.weights1[j] - immParentNeuron.weights1[j];
          advW2[j] += descNeuron.weights2[j] - immParentNeuron.weights2[j];
        }
        advCount++;
      }
    } else if (idx < 0) {
      // Disadvantageous: dead without children
      for (let j = 0; j < numWeights; j++) {
        disW1[j] += descNeuron.weights1[j] - immParentNeuron.weights1[j];
        disW2[j] += descNeuron.weights2[j] - immParentNeuron.weights2[j];
      }
      disCount++;
    }
    // Living without children = ignored (too early to judge)
  }

  // Average the deltas
  if (advCount > 0) {
    for (let j = 0; j < numWeights; j++) {
      advW1[j] /= advCount;
      advW2[j] /= advCount;
    }
  }
  if (disCount > 0) {
    for (let j = 0; j < numWeights; j++) {
      disW1[j] /= disCount;
      disW2[j] /= disCount;
    }
  }

  return { advW1, advW2, disW1, disW2, advCount, disCount };
}



function getDescendantIndices(idx: number, orig: number): number[] {
  const indices: number[] = [];
  const current = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];
  if (!current) return indices;

  for (const childIdx of current.children) {
    indices.push(...getDescendantIndices(childIdx, orig));
  }

  // Exclude the original starting node from results
  if (idx !== orig) {
    indices.push(idx);
  }

  return indices;
}

// Store canvases to prevent garbage collection
const spriteCanvases: HTMLCanvasElement[] = [];

/**
 * Create a text sprite for a neuron label
 */
function createTextSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // Fallback: create empty sprite if canvas context fails
    const material = new THREE.SpriteMaterial({ color: 0xffffff });
    return new THREE.Sprite(material);
  }

  // Keep reference to prevent GC
  spriteCanvases.push(canvas);

  // Canvas size (power of 2 for GPU efficiency)
  canvas.width = 128;
  canvas.height = 64;

  // Clear with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  const padding = 4;
  const radius = 8;
  roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, radius);
  ctx.fill();

  // Draw text
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Create sprite material
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false, // Always render on top
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.25, 1); // Adjust size in 3D space

  // Store canvas reference for updates
  sprite.userData.canvas = canvas;
  sprite.userData.ctx = ctx;

  return sprite;
}

/**
 * Update sprite text
 */
function updateSpriteText(sprite: THREE.Sprite, label: string, value: number): void {
  if (!sprite || !sprite.userData) return;

  const canvas = sprite.userData.canvas as HTMLCanvasElement;
  const ctx = sprite.userData.ctx as CanvasRenderingContext2D;

  if (!canvas || !ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  // const padding = 4;
  // const radius = 8;
  // roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, radius);
  // ctx.fill();

  // Draw label on top line
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000000';
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 - 12);

  // Draw value on bottom line
  ctx.font = '14px monospace';
  ctx.fillText(value.toFixed(2), canvas.width / 2, canvas.height / 2 + 12);

  // Update texture
  const material = sprite.material as THREE.SpriteMaterial;
  if (material.map) {
    material.map.needsUpdate = true;
  }
}

/**
 * Create a larger section label sprite (for "INPUTS" / "OUTPUTS")
 */
function createSectionSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const material = new THREE.SpriteMaterial({ color: 0xffffff });
    return new THREE.Sprite(material);
  }

  spriteCanvases.push(canvas);

  canvas.width = 256;
  canvas.height = 64;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw text (no background for section labels)
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00000020';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.2, 0.3, 1);

  return sprite;
}

/**
 * Draw rounded rectangle helper
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Initialize the 3D brain display
 */
export function initBrain3D(canvasContainer: HTMLElement): void {
  container = canvasContainer;

  // Create scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xf8f8f8);

  // Create camera
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
  camera.position.set(0, 0, 6);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, precision: 'lowp'});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 15;

  // Create brain group
  brainGroup = new THREE.Group();
  scene.add(brainGroup);

  // Create transparent brain sphere
  const sphereGeometry = new THREE.SphereGeometry(BRAIN_RADIUS, 16, 12); // Lower poly wireframe
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.1,
    wireframe: true,
  });
  const brainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  brainGroup.add(brainSphere);

  // Calculate neuron positions on sphere surface
  calculateNeuronPositions();

  // Create neuron meshes
  createNeuronMeshes();

  // Create labels overlay
  // createLabelsOverlay();

  // Add click listener
  renderer.domElement.addEventListener('click', onCanvasClick);

  // Start render loop
  animate();
}

/**
 * Calculate positions for neurons on sphere surface
 * Inputs on left hemisphere, outputs on right
 */
function calculateNeuronPositions(): void {
  inputPositions.length = 0;
  outputPositions.length = 0;

  // Input neurons on left hemisphere (-x side)
  const inputRows = Math.ceil(Math.sqrt(NUM_INPUT_NEURONS));
  const inputCols = Math.ceil(NUM_INPUT_NEURONS / inputRows);

  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const row = Math.floor(i / inputCols);
    const col = i % inputCols;

    // Map to spherical coordinates on left hemisphere
    const phi = (Math.PI / 4) + (row / inputRows) * (Math.PI / 2); // vertical angle
    const theta = Math.PI + (col / inputCols) * (Math.PI / 2) - (Math.PI / 4); // horizontal angle (left side)

    const x = BRAIN_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = BRAIN_RADIUS * Math.cos(phi);
    const z = BRAIN_RADIUS * Math.sin(phi) * Math.sin(theta);

    inputPositions.push(new THREE.Vector3(x, y, z));
  }

  // Output neurons on right hemisphere (+x side) - spread more across surface
  const outputRows = Math.ceil(Math.sqrt(NUM_OUTPUT_NEURONS));
  const outputCols = Math.ceil(NUM_OUTPUT_NEURONS / outputRows);

  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const row = Math.floor(o / outputCols);
    const col = o % outputCols;

    // Map to spherical coordinates on right hemisphere - wider spread
    const phi = (Math.PI / 4) + (row / outputRows) * (Math.PI * 2 / 3); // more vertical spread
    const theta = (col / outputCols) * (Math.PI) - (Math.PI / 2); // wider horizontal spread

    const x = BRAIN_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = BRAIN_RADIUS * Math.cos(phi);
    const z = BRAIN_RADIUS * Math.sin(phi) * Math.sin(theta);

    outputPositions.push(new THREE.Vector3(x, y, z));
  }
}

/**
 * Create neuron mesh objects and label sprites
 */
function createNeuronMeshes(): void {
  if (!brainGroup) return;

  const neuronGeometry = new THREE.SphereGeometry(NEURON_RADIUS, 6, 4); // Low poly for performance

  // Input neurons (green tint)
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const material = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true });
    const mesh = new THREE.Mesh(neuronGeometry, material);
    mesh.position.copy(inputPositions[i]);
    mesh.userData = { type: 'input', index: i };
    brainGroup.add(mesh);
    inputNeuronMeshes.push(mesh);

    // Create label sprite
    const label = INPUT_LABELS[i] || `I${i}`;
    const sprite = createTextSprite(label);
    // Position slightly outside the sphere (outward from center)
    const pos = inputPositions[i].clone();
    const outward = pos.clone().normalize().multiplyScalar(LABEL_OFFSET);
    sprite.position.copy(pos).add(outward);
    brainGroup.add(sprite);
    inputLabelSprites.push(sprite);
  }

  // Output neurons (blue tint)
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const material = new THREE.MeshBasicMaterial({ color: 0x0000FF, transparent: true });
    const mesh = new THREE.Mesh(neuronGeometry, material);
    mesh.position.copy(outputPositions[o]);
    mesh.userData = { type: 'output', index: o };
    brainGroup.add(mesh);
    outputNeuronMeshes.push(mesh);

    // Create label sprite
    const label = OUTPUT_LABELS[o] || `O${o}`;
    const sprite = createTextSprite(label);
    // Position slightly outside the sphere (outward from center)
    const pos = outputPositions[o].clone();
    const outward = pos.clone().normalize().multiplyScalar(LABEL_OFFSET);
    sprite.position.copy(pos).add(outward);
    brainGroup.add(sprite);
    outputLabelSprites.push(sprite);
  }

  // Add section label sprites
  const sectionLabelOffset = BRAIN_RADIUS + 0.25;

  // "INPUTS" label on left side
  const inputsLabel = createSectionSprite('INPUTS');
  inputsLabel.position.set(-sectionLabelOffset, BRAIN_RADIUS, 0);
  brainGroup.add(inputsLabel);

  // "OUTPUTS" label on right side
  const outputsLabel = createSectionSprite('OUTPUTS');
  outputsLabel.position.set(sectionLabelOffset, BRAIN_RADIUS, 0);
  brainGroup.add(outputsLabel);
}

// Pre-allocated buffers for synapse quads (variable-width ribbons)
const MAX_CONNECTIONS = NUM_INPUT_NEURONS * NUM_OUTPUT_NEURONS + NUM_OUTPUT_NEURONS * (NUM_OUTPUT_NEURONS - 1);
const SYNAPSE_MAX_WIDTH = 0.02; // World units at |weight| = 1 (~100px at default zoom)

const quadPositions = new Float32Array(MAX_CONNECTIONS * 4 * 3); // 4 vertices * 3 coords per quad
const quadColors = new Float32Array(MAX_CONNECTIONS * 4 * 4);    // 4 vertices * 4 RGBA per quad
const quadIndices = new Uint16Array(MAX_CONNECTIONS * 6);         // 6 indices per quad (2 triangles)

// Pre-fill index buffer (each quad: 2 triangles → 6 indices)
for (let qi = 0; qi < MAX_CONNECTIONS; qi++) {
  const base = qi * 4;
  const idx = qi * 6;
  quadIndices[idx]     = base;
  quadIndices[idx + 1] = base + 1;
  quadIndices[idx + 2] = base + 2;
  quadIndices[idx + 3] = base + 2;
  quadIndices[idx + 4] = base + 1;
  quadIndices[idx + 5] = base + 3;
}

// Temp vectors for quad vertex calculations (avoid per-frame allocations)
const _dir = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _right = new THREE.Vector3(1, 0, 0);

let synapseGeometry: THREE.BufferGeometry | null = null;
let synapseMaterial: THREE.MeshBasicMaterial | null = null;

/**
 * Create synapse quads between neurons with width = |weight| (reuses buffers)
 * Uses weight1 when neuron activation > 0, weight2 otherwise (mirrors synapse() logic)
 */
function updateSynapseLines(animal: Amoeb): void {
  if (!brainGroup) return;

  // Create geometry and material once
  if (!synapseGeometry) {
    synapseGeometry = new THREE.BufferGeometry();
    synapseGeometry.setAttribute('position', new THREE.BufferAttribute(quadPositions, 3));
    synapseGeometry.setAttribute('color', new THREE.BufferAttribute(quadColors, 4));
    synapseGeometry.setIndex(new THREE.BufferAttribute(quadIndices, 1));

    synapseMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    synapseMesh = new THREE.Mesh(synapseGeometry, synapseMaterial);
    brainGroup.add(synapseMesh);
  }

  let quadIndex = 0;

  // Input to output connections
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const neuron = animal.inputs[i];
    for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
      // Pick weight1 or weight2 based on neuron activation (same logic as synapse())
      const rawWeight = neuron.in > 0 ? neuron.weights1[o] : neuron.weights2[o];

      // Skip very weak connections for performance
      if (Math.abs(rawWeight) < 0.05) continue;

      const startPos = inputPositions[i];
      const endPos = outputPositions[o];

      // Compute perpendicular direction for quad width
      _dir.subVectors(endPos, startPos).normalize();
      _perp.crossVectors(_dir, _up);
      if (_perp.lengthSq() < 0.001) _perp.crossVectors(_dir, _right);
      _perp.normalize();

      const halfWidth = (Math.abs(rawWeight) * SYNAPSE_MAX_WIDTH) / 2;

      // Quad vertices: start±perp, end±perp
      const posIdx = quadIndex * 12;
      quadPositions[posIdx]      = startPos.x + _perp.x * halfWidth;
      quadPositions[posIdx + 1]  = startPos.y + _perp.y * halfWidth;
      quadPositions[posIdx + 2]  = startPos.z + _perp.z * halfWidth;
      quadPositions[posIdx + 3]  = startPos.x - _perp.x * halfWidth;
      quadPositions[posIdx + 4]  = startPos.y - _perp.y * halfWidth;
      quadPositions[posIdx + 5]  = startPos.z - _perp.z * halfWidth;
      quadPositions[posIdx + 6]  = endPos.x + _perp.x * halfWidth;
      quadPositions[posIdx + 7]  = endPos.y + _perp.y * halfWidth;
      quadPositions[posIdx + 8]  = endPos.z + _perp.z * halfWidth;
      quadPositions[posIdx + 9]  = endPos.x - _perp.x * halfWidth;
      quadPositions[posIdx + 10] = endPos.y - _perp.y * halfWidth;
      quadPositions[posIdx + 11] = endPos.z - _perp.z * halfWidth;

      // Color: red for negative, green for positive (input→output)
      const absW = Math.min(Math.abs(rawWeight), 1);
      const r = rawWeight < 0 ? 1.0 : 0;
      const g = rawWeight > 0 ? absW : 0;
      const b = 0;
      const alpha = absW;

      const colIdx = quadIndex * 16;
      for (let v = 0; v < 4; v++) {
        quadColors[colIdx + v * 4]     = r;
        quadColors[colIdx + v * 4 + 1] = g;
        quadColors[colIdx + v * 4 + 2] = b;
        quadColors[colIdx + v * 4 + 3] = alpha;
      }

      quadIndex++;
    }
  }

  // Output to output connections (recurrent)
  for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
    const neuron = animal.outputs[i];
    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      if (i === j) continue; // Skip self-connections

      const rawWeight = neuron.in > 0 ? neuron.weights1[j] : neuron.weights2[j];

      if (Math.abs(rawWeight) < 0.05) continue;

      const startPos = outputPositions[i];
      const endPos = outputPositions[j];

      _dir.subVectors(endPos, startPos).normalize();
      _perp.crossVectors(_dir, _up);
      if (_perp.lengthSq() < 0.001) _perp.crossVectors(_dir, _right);
      _perp.normalize();

      const halfWidth = (Math.abs(rawWeight) * SYNAPSE_MAX_WIDTH) / 2;

      const posIdx = quadIndex * 12;
      quadPositions[posIdx]      = startPos.x + _perp.x * halfWidth;
      quadPositions[posIdx + 1]  = startPos.y + _perp.y * halfWidth;
      quadPositions[posIdx + 2]  = startPos.z + _perp.z * halfWidth;
      quadPositions[posIdx + 3]  = startPos.x - _perp.x * halfWidth;
      quadPositions[posIdx + 4]  = startPos.y - _perp.y * halfWidth;
      quadPositions[posIdx + 5]  = startPos.z - _perp.z * halfWidth;
      quadPositions[posIdx + 6]  = endPos.x + _perp.x * halfWidth;
      quadPositions[posIdx + 7]  = endPos.y + _perp.y * halfWidth;
      quadPositions[posIdx + 8]  = endPos.z + _perp.z * halfWidth;
      quadPositions[posIdx + 9]  = endPos.x - _perp.x * halfWidth;
      quadPositions[posIdx + 10] = endPos.y - _perp.y * halfWidth;
      quadPositions[posIdx + 11] = endPos.z - _perp.z * halfWidth;

      // Color: red for negative, blue for positive (output→output)
      const absW = Math.min(Math.abs(rawWeight), 1);
      const r = rawWeight < 0 ? 1.0 : 0;
      const g = 0;
      const b2 = rawWeight > 0 ? absW : 0;
      const alpha = absW;

      const colIdx = quadIndex * 16;
      for (let v = 0; v < 4; v++) {
        quadColors[colIdx + v * 4]     = r;
        quadColors[colIdx + v * 4 + 1] = g;
        quadColors[colIdx + v * 4 + 2] = b2;
        quadColors[colIdx + v * 4 + 3] = alpha;
      }

      quadIndex++;
    }
  }

  // Update geometry draw range and mark buffers dirty
  synapseGeometry.setDrawRange(0, quadIndex * 6); // 6 indices per quad
  (synapseGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  (synapseGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
}

/**
 * Update neuron colors and label sprites based on activation
 */
function updateNeuronColors(animal: Amoeb): void {
  // Update input neurons
  for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
    const activation = animal.inputs[i].in;
    const mesh = inputNeuronMeshes[i];
    const material = mesh.material as THREE.MeshBasicMaterial;

    // Intensity determines opacity (0 = transparent, 1 = opaque)
    const intensity = Math.min(Math.abs(activation), 1);
    const hue = activation >= 0 ? 0.3333 : 0.0; // green for positive, red for negative
    material.color.setHSL(hue, 1, 0.5);
    material.transparent = true;
    material.opacity = intensity; // 0.1 to 1.0

    // Update label sprite
    const label = INPUT_LABELS[i] || `I${i}`;
    if (inputLabelSprites[i]) {
      updateSpriteText(inputLabelSprites[i], label, activation);
    }
  }

  // Update output neurons
  for (let o = 0; o < NUM_OUTPUT_NEURONS; o++) {
    const activation = o < 30 ? animal.outputs[o].out : animal.outputs[o].in;
    const mesh = outputNeuronMeshes[o];
    const material = mesh.material as THREE.MeshBasicMaterial;

    const intensity = Math.min(Math.abs(activation), 1);
    const hue = activation >= 0 ? 0.6666 : 0.0; // blue for positive, red for negative
    material.color.setHSL(hue, 1, 0.5);
    material.transparent = true;
    material.opacity = intensity; // 0.1 to 1.0

    // Update label sprite
    const label = OUTPUT_LABELS[o] || `O${o}`;
    if (outputLabelSprites[o]) {
      updateSpriteText(outputLabelSprites[o], label, activation);
    }
  }
}

/**
 * Handle canvas click for neuron selection
 */
function onCanvasClick(event: MouseEvent): void {
  if (!camera || !renderer || !scene) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const allNeurons = [...inputNeuronMeshes, ...outputNeuronMeshes];
  const intersects = raycaster.intersectObjects(allNeurons);

  if (intersects.length > 0) {
    const clicked = intersects[0].object as THREE.Mesh;
    const { type, index } = clicked.userData as { type: 'input' | 'output'; index: number };

    // Toggle selection
    const existingIdx = selectedNeurons.findIndex(n => n.type === type && n.index === index);
    if (existingIdx >= 0) {
      selectedNeurons.splice(existingIdx, 1);
      // Reset to original color based on type
      const material = clicked.material as THREE.MeshBasicMaterial;
      material.color.setHex(type === 'input' ? 0x44aa44 : 0x4444aa);
    } else {
      selectedNeurons.push({ type, index });
      // Highlight selected (yellow)
      const material = clicked.material as THREE.MeshBasicMaterial;
      material.color.setHex(0xffff00);
    }

    // Update weight display
    updateWeightDisplay();
  } else {
    // Clicked empty space - deselect all and close table
    for (const sel of selectedNeurons) {
      const mesh = sel.type === 'input' ? inputNeuronMeshes[sel.index] : outputNeuronMeshes[sel.index];
      if (mesh) {
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.color.setHex(sel.type === 'input' ? 0x44aa44 : 0x4444aa);
      }
    }
    selectedNeurons.length = 0;
    updateWeightDisplay();
  }
}

/**
 * Update weight display for selected neurons
 */
function updateWeightDisplay(): void {
  if (!currentAnimal) return;

  const weightsDiv = document.getElementById('brain3d-weights');
  if (!weightsDiv) return;

  if (selectedNeurons.length === 0) {
    weightsDiv.style.display = 'none';
    return;
  }

  weightsDiv.style.display = 'block';
  let html = '';

  for (const sel of selectedNeurons) {
    const neuron = sel.type === 'input'
      ? currentAnimal.inputs[sel.index]
      : currentAnimal.outputs[sel.index];
    const label = sel.type === 'input'
      ? (INPUT_LABELS[sel.index] || `I${sel.index}`)
      : (OUTPUT_LABELS[sel.index] || `O${sel.index}`);

    // Calculate weight deltas
    const { advW1, advW2, disW1, disW2, advCount, disCount } = calculateWeightDeltas(currentAnimal, sel.type, sel.index);

    html += `<b>${sel.type.toUpperCase()} ${label}</b><br>`;
    html += '<table class="neuron-weights-table" style="width:100%; border-collapse:collapse; font-size:8px;">';
    html += `<tr>
      <th>Target</th>
      <th>W1</th>
      <th>σ1</th>
      <th style="color:green">Adv(${advCount})</th>
      <th style="color:red">Dis(${disCount})</th>
      <th>W1'</th>
      <th style="border-left:1px solid #ccc"></th>
      <th>W2</th>
      <th>σ2</th>
      <th style="color:green">Adv(${advCount})</th>
      <th style="color:red">Dis(${disCount})</th>
      <th>W2'</th>
    </tr>`;

    for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
      const targetLabel = OUTPUT_LABELS[j] || `O${j}`;
      const w1 = neuron.weights1[j];
      const w2 = neuron.weights2[j];
      const s1 = neuron.sigmas1[j];
      const s2 = neuron.sigmas2[j];
      const finalW1 = w1 + advW1[j] - disW1[j];
      const finalW2 = w2 + advW2[j] - disW2[j];

      html += `<tr>
        <td>${targetLabel}</td>
        <td>${w1.toFixed(3)}</td>
        <td style="color:#888">${s1.toFixed(3)}</td>
        <td style="color:green">${advW1[j].toFixed(3)}</td>
        <td style="color:red">${disW1[j].toFixed(3)}</td>
        <td><b>${finalW1.toFixed(3)}</b></td>
        <td style="border-left:1px solid #ccc"></td>
        <td>${w2.toFixed(3)}</td>
        <td style="color:#888">${s2.toFixed(3)}</td>
        <td style="color:green">${advW2[j].toFixed(3)}</td>
        <td style="color:red">${disW2[j].toFixed(3)}</td>
        <td><b>${finalW2.toFixed(3)}</b></td>
      </tr>`;
    }
    html += '</table><br>';
  }

  weightsDiv.innerHTML = html;
}

/**
 * Animation loop
 */
function animate(): void {
  requestAnimationFrame(animate);

  // Skip rendering when the brain display is hidden
  if (container && container.style.display === 'none') return;

  if (controls) {
    controls.update();
  }

  if (renderer && scene && camera) {
    try {
      renderer.render(scene, camera);
    } catch (e) {
      // Ignore render errors (can happen during disposal/transition)
    }
  }
}

/**
 * Update the 3D brain display for an animal
 */
export function drawBrain3D(animal: Amoeb): void {
  if (!scene || !brainGroup) return;

  currentAnimal = animal;

  updateSynapseLines(animal);
  updateNeuronColors(animal);
  // updateLabelsOverlay(animal);

  // Update weight display if neurons are selected
  if (selectedNeurons.length > 0) {
    updateWeightDisplay();
  }
}

/**
 * Resize handler - maintains proportional height based on width
 */
export function resizeBrain3D(): void {
  if (!container || !camera || !renderer) return;

  const width = container.clientWidth;

  // Calculate proportional height (use 4:3 aspect ratio)
  const aspectRatio = 1;
  const newHeight = Math.max(250, Math.min(width * aspectRatio, 600)); // Clamp between 250-600px

  // Update container height
  container.style.height = newHeight + 'px';

  const height = newHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/**
 * Cleanup
 */
export function disposeBrain3D(): void {
  if (renderer) {
    renderer.domElement.removeEventListener('click', onCanvasClick);
    renderer.dispose();
  }

  // Dispose sprite textures
  for (const sprite of inputLabelSprites) {
    const material = sprite.material as THREE.SpriteMaterial;
    material.map?.dispose();
    material.dispose();
  }
  for (const sprite of outputLabelSprites) {
    const material = sprite.material as THREE.SpriteMaterial;
    material.map?.dispose();
    material.dispose();
  }

  // Dispose synapse geometry and material
  if (synapseGeometry) {
    synapseGeometry.dispose();
    synapseGeometry = null;
  }
  if (synapseMaterial) {
    synapseMaterial.dispose();
    synapseMaterial = null;
  }

  if (scene) {
    scene.clear();
  }

  inputNeuronMeshes.length = 0;
  outputNeuronMeshes.length = 0;
  inputLabelSprites.length = 0;
  outputLabelSprites.length = 0;
  selectedNeurons.length = 0;
  spriteCanvases.length = 0;

  scene = null;
  camera = null;
  renderer = null;
  controls = null;
  brainGroup = null;
  synapseMesh = null;
  currentAnimal = null;
}

/**
 * Clear selection
 */
export function clearBrain3DSelection(): void {
  selectedNeurons.length = 0;
  const container = document.getElementById('brain3d-weights');
  if (container) {
    container.style.display = 'none';
  }
}
