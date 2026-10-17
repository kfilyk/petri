// Main entry point for Petri — the render/UI thread.
//
// The simulation itself runs in a Web Worker (src/sim/worker.ts). This file
// owns the canvas, camera, input, dashboard and charts, and talks to the
// worker through SimClient. Each animation frame it draws the newest snapshot
// the worker has published; the worker ticks on its own clock.

import { DEFAULT_TPS } from './constants';
import { H, F } from './sim/protocol';
import { SimClient } from './ui/simClient';
import { view } from './ui/viewState';
import { drawFrame } from './ui/renderer';
import { downloadJson, pickTextFile } from './ui/files';
import { type Frame, header, highlightedIdx, newestIdx, medalIdx, hasFocus, focus, hasBrain } from './ui/frame';
import {
  inputHandler,
  handleSelection,
  dashboard,
  initDashboardDom,
  handleMouseEvent,
  handleMouseWheel,
  handleKeyDown,
  handleKeyUp,
  initFoodPopChart,
  initOptimizationChart,
  initLifespanChart,
  initMutationStratChart,
  initGenDemoChart,
  resetChartData,
  resizeCharts,
  pushStatsSample,
} from './managers';
import { initFPSCounter, updateFPS } from './components/FPSCounter';
import {
  initFamilyDisplay,
  toggleFamilyDisplay,
  updateFamilyDisplay,
  handleFamilyMessage,
  handleAlikenessMessage,
} from './components/FamilyDisplay';
import {
  initBrain3D,
  drawBrain3D,
  resizeBrain3D,
  clearBrain3DSelection,
  renderKinTable,
  refreshKinTable,
} from './components/BrainDisplay3D';

// Import uPlot CSS
import 'uplot/dist/uPlot.min.css';

const client = new SimClient();

// Change detection for the detail panels (brain kin table, family tree)
let lastDetailHighlighted: number | null = null;
let lastDetailDescendants = -1;

/**
 * Initialize the UI and start the simulation worker
 */
function init(): void {
  const mapCanvas = document.getElementById('map') as HTMLCanvasElement;
  if (!mapCanvas) {
    console.error('Map canvas not found');
    return;
  }

  mapCanvas.width = window.innerWidth;
  mapCanvas.height = 1000;

  view.ctx = mapCanvas.getContext('2d', { alpha: false });
  if (!view.ctx) {
    console.error('Could not get map canvas context');
    return;
  }
  view.ctx.font = '10px Arial';

  // 3D brain display; neuron clicks ask the worker for kin-delta data
  const brain3dContainer = document.getElementById('brain3d-container');
  if (brain3dContainer) {
    initBrain3D(brain3dContainer, (neurons) => {
      if (view.highlighted !== null) client.requestKinTable(view.highlighted, neurons);
    });
  }

  initCharts();

  const fpsEl = document.getElementById('fps-counter');
  if (fpsEl) initFPSCounter(fpsEl);

  initFamilyDisplay(client);
  initDashboardDom();
  setupEventListeners(mapCanvas);

  // Worker replies
  client.on('stats', (m) => pushStatsSample(m.sample));
  client.on('kinTable', (m) => renderKinTable(m.table));
  client.on('family', (m) => handleFamilyMessage(m.idx, m.tree));
  client.on('alikeness', (m) => handleAlikenessMessage(m.a, m.b, m.value));
  client.on('save', (m) => downloadJson(m.json, `petri-save-${Date.now()}.json`));
  client.on('loaded', (m) => {
    if (m.ok) {
      console.log('Load complete!');
      resetChartData();
    } else {
      console.error('Failed to load:', m.error);
    }
  });

  client.start(DEFAULT_TPS);
  cycle();

  // Initial zoom
  view.canvas.scale = 3;
  view.ctx.scale(3, 3);
}

/**
 * Initialize uPlot charts
 */
function initCharts(): void {
  const byId = (id: string) => document.getElementById(id);
  const foodPop = byId('foodPopChart');
  const optimization = byId('optimizationChart');
  const lifespan = byId('lifespanChart');
  const mutationStrat = byId('mutationStratChart');
  const genDemo = byId('genDemoChart');

  if (foodPop) initFoodPopChart(foodPop);
  if (optimization) initOptimizationChart(optimization);
  if (lifespan) initLifespanChart(lifespan);
  if (mutationStrat) initMutationStratChart(mutationStrat);
  if (genDemo) initGenDemoChart(genDemo);
}

/**
 * Set up all event listeners
 */
function setupEventListeners(mapCanvas: HTMLCanvasElement): void {
  mapCanvas.addEventListener('mouseover', (e) => {
    handleMouseEvent('over', e, mapCanvas);
    view.mouse.overMap = true;
  });
  mapCanvas.addEventListener('mousemove', (e) => handleMouseEvent('move', e, mapCanvas));
  mapCanvas.addEventListener('mousedown', (e) => handleMouseEvent('down', e, mapCanvas));
  mapCanvas.addEventListener('mouseup', (e) => handleMouseEvent('up', e, mapCanvas));
  mapCanvas.addEventListener('mouseout', (e) => {
    handleMouseEvent('out', e, mapCanvas);
    view.mouse.overMap = false;
  });
  mapCanvas.addEventListener('wheel', (e) => handleMouseWheel(e, mapCanvas), { passive: false });

  document.addEventListener('keydown', (e) => handleKeyDown(e, pauseSimulation));
  document.addEventListener('keyup', (e) => handleKeyUp(e));

  // Window resize — update canvas size and restore transform
  window.addEventListener('resize', () => {
    const ctx = view.ctx;
    if (!ctx) return;
    mapCanvas.width = window.innerWidth;
    mapCanvas.height = 1000;
    ctx.font = '10px Arial';
    ctx.setTransform(view.canvas.scale, 0, 0, view.canvas.scale, view.mouse.originalX, view.mouse.originalY);
    resizeCharts();
    resizeBrain3D();
  });

  setupDashboardResize();
}

/**
 * Set up dashboard resize functionality
 */
function setupDashboardResize(): void {
  const dashboardEl = document.getElementById('dashboard');
  const handle = document.getElementById('dashboard-resize-handle');
  if (!dashboardEl || !handle) return;

  let isResizing = false;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    handle.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.8;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      dashboardEl.style.width = newWidth + 'px';
      resizeCharts();
      resizeBrain3D();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      handle.classList.remove('dragging');
      resizeCharts();
      resizeBrain3D();
    }
  });
}

/**
 * Render loop. Runs at display refresh regardless of the simulation tick rate.
 */
function cycle(): void {
  client.swapFrame();
  const f = client.frame;

  updateFPS(f ? header(f, H.TPS_MEASURED) : 0);

  if (f) {
    view.highlighted = highlightedIdx(f);
    handleSelection(f, client);
  }
  inputHandler.update(client);
  updateTracking(f);

  drawFrame(f);

  if (f) {
    dashboard.update(f);
    updateDetailPanels(f);
  }

  requestAnimationFrame(cycle);
}

/**
 * Keep the brain / family panels in sync with the highlighted amoeba
 */
function updateDetailPanels(f: Frame): void {
  if (!hasFocus(f)) {
    lastDetailHighlighted = null;
    lastDetailDescendants = -1;
    return;
  }

  const descendants = focus(f, F.DESCENDANTS);
  const kinChanged = view.highlighted !== lastDetailHighlighted || descendants !== lastDetailDescendants;

  if (view.display === 'brain') {
    if (hasBrain(f)) drawBrain3D(f);
    if (kinChanged) refreshKinTable();
  } else if (view.display === 'family') {
    updateFamilyDisplay(false, view.highlighted, descendants);
  }

  lastDetailHighlighted = view.highlighted;
  lastDetailDescendants = descendants;
}

/**
 * Update camera position to follow the highlighted amoeba
 */
function updateTracking(f: Frame | null): void {
  if (!view.tracking) return;
  const ctx = view.ctx;
  if (!ctx || !f || !hasFocus(f)) return;

  if (focus(f, F.STATUS) !== 0) {
    view.tracking = false;
    return;
  }

  const canvas = ctx.canvas;
  const centerX = canvas.width / 2 / view.canvas.scale;
  const centerY = canvas.height / 2 / view.canvas.scale;

  const dx = centerX - focus(f, F.X) - view.mouse.originalX / view.canvas.scale;
  const dy = centerY - focus(f, F.Y) - view.mouse.originalY / view.canvas.scale;

  ctx.translate(dx, dy);
  view.mouse.originalX += dx * view.canvas.scale;
  view.mouse.originalY += dy * view.canvas.scale;
}

// ─── Actions wired to the HTML buttons ──────────────────────────────────────

function pauseSimulation(): void {
  view.paused = !view.paused;
  client.setPaused(view.paused);
  const btn = document.getElementById('play-button') as HTMLImageElement | null;
  if (btn) btn.src = view.paused ? 'icons/pause.png' : 'icons/play.png';
}

/** Fast-forward: run the simulation as fast as the worker can tick */
function accelerateMutations(): void {
  view.fastForward = !view.fastForward;
  client.setTps(view.fastForward ? 0 : DEFAULT_TPS);
}

function newSimulation(): void {
  view.tracking = false;
  client.newSimulation();
  resetChartData();
}

function showCurrentDisplay(): void {
  const brain3dEl = document.getElementById('brain3d-container');
  const familyEl = document.getElementById('family-tree');

  if (view.display === 'brain' && brain3dEl) {
    brain3dEl.style.display = 'block';
    resizeBrain3D();
    if (familyEl) familyEl.style.display = 'none';
  } else if (view.display === 'family' && familyEl) {
    familyEl.style.display = 'block';
    if (brain3dEl) brain3dEl.style.display = 'none';
  }
}

function highlightNewest(): void {
  const f = client.frame;
  if (!f) return;
  client.highlight(newestIdx(f));
  showCurrentDisplay();
}

function highlightMedal(key: number): void {
  const f = client.frame;
  if (!f) return;
  const idx = medalIdx(f, key);
  if (idx === null) return;
  client.highlight(idx);
  showCurrentDisplay();
}

function save(): void {
  console.log('SAVING...');
  client.save();
}

function load(): void {
  pickTextFile('.json')
    .then((json) => {
      if (json) {
        console.log('LOADING...');
        client.load(json);
      }
    })
    .catch((err) => console.error('Failed to read file:', err));
}

function toggleBrainDisplay(): void {
  if (view.highlighted === null) return;

  const brain3dContainer = document.getElementById('brain3d-container');
  const familyTree = document.getElementById('family-tree');

  if (view.display === 'brain') {
    view.display = 'default';
    if (brain3dContainer) brain3dContainer.style.display = 'none';
    clearBrain3DSelection();
  } else {
    view.display = 'brain';
    if (brain3dContainer) {
      brain3dContainer.style.display = 'block';
      resizeBrain3D();
    }
    if (familyTree) familyTree.style.display = 'none';
  }
  client.setDisplay(view.display);
}

function toggleTracking(): void {
  if (view.tracking) {
    view.tracking = false;
  } else if (view.highlighted !== null) {
    view.tracking = true;
  }
}

function stopTracking(): void {
  view.tracking = false;
}

/** The X button on the stats panel */
function closeHighlight(): void {
  view.tracking = false;
  view.mouse.leftPressed = false;
  client.highlight(null);

  const brain3dContainer = document.getElementById('brain3d-container');
  const familyTree = document.getElementById('family-tree');
  if (brain3dContainer) brain3dContainer.style.display = 'none';
  if (familyTree) familyTree.style.display = 'none';
  if (view.display === 'brain') clearBrain3DSelection();
  view.display = 'default';
  client.setDisplay('default');
}

// Expose functions to window for HTML onclick handlers
declare global {
  interface Window {
    init: typeof init;
    newSimulation: typeof newSimulation;
    pauseSimulation: typeof pauseSimulation;
    accelerateMutations: typeof accelerateMutations;
    save: typeof save;
    load: typeof load;
    highlight_newest: typeof highlightNewest;
    highlight_gold: () => void;
    highlight_silver: () => void;
    highlight_bronze: () => void;
    toggleBrainDisplay: typeof toggleBrainDisplay;
    toggleFamilyDisplay: typeof toggleFamilyDisplay;
    toggleTracking: typeof toggleTracking;
    stopTracking: typeof stopTracking;
    closeHighlight: typeof closeHighlight;
  }
}

window.init = init;
window.newSimulation = newSimulation;
window.pauseSimulation = pauseSimulation;
window.accelerateMutations = accelerateMutations;
window.save = save;
window.load = load;
window.highlight_newest = highlightNewest;
window.highlight_gold = () => highlightMedal(H.GOLD);
window.highlight_silver = () => highlightMedal(H.SILVER);
window.highlight_bronze = () => highlightMedal(H.BRONZE);
window.toggleBrainDisplay = toggleBrainDisplay;
window.toggleFamilyDisplay = toggleFamilyDisplay;
window.toggleTracking = toggleTracking;
window.stopTracking = stopTracking;
window.closeHighlight = closeHighlight;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
