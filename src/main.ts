// Main entry point for Petri simulation
// Wires together all modules and starts the simulation loop

import { BRAINX, BRAINY, FIELDX, FIELDY, POPCAP, SCORESCAP } from './constants';
import { round } from './utils/math';
import { state } from './state';
import { Amoeb } from './entities/Amoeb';
import {
  tileSystem,
  amoebSystem,
  statSystem,
  inputHandler,
  dashboard,
  initAmoebSystemDom,
  initInputHandlerDom,
  initDashboardDom,
  handleMouseEvent,
  handleMouseWheel,
  handleKeyDown,
  handleKeyUp,
  initFoodPopChart,
  initOptimizationChart,
  initLifespanChart,
  resetChartData,
  resizeCharts,
} from './managers';
import { accelerateMutations } from './genetics/mutations';
import { initFPSCounter, updateFPS } from './components/FPSCounter';
import { getNeuronAtPosition, displayNeuronWeights, updateBrainCursor } from './components/BrainDisplay';
import { initFamilyDisplay, toggleFamilyDisplay, updateFamilyDisplay } from './components/FamilyDisplay';

// Import uPlot CSS
import 'uplot/dist/uPlot.min.css';

/**
 * Initialize the simulation
 */
function init(): void {
  // Get canvas elements
  const mapCanvas = document.getElementById('map') as HTMLCanvasElement;
  const brainCanvas = document.getElementById('brain') as HTMLCanvasElement;

  if (!mapCanvas || !brainCanvas) {
    console.error('Canvas elements not found');
    return;
  }

  // Set canvas dimensions
  mapCanvas.width = window.innerWidth;
  mapCanvas.height = 1000;
  brainCanvas.width = BRAINX;
  brainCanvas.height = BRAINY;

  // Get rendering contexts
  state.ctx.map = mapCanvas.getContext('2d');
  state.ctx.stats = brainCanvas.getContext('2d');

  if (!state.ctx.map || !state.ctx.stats) {
    console.error('Could not get canvas contexts');
    return;
  }

  // Set fonts
  state.ctx.map.font = '10px Arial';
  state.ctx.stats.font = '10px Arial';

  // Initialize uPlot charts
  initCharts();

  // Initialize FPS counter
  const fpsEl = document.getElementById('fps-counter');
  if (fpsEl) initFPSCounter(fpsEl);

  // Initialize family display
  initFamilyDisplay();

  // Initialize cached DOM elements
  initAmoebSystemDom();
  initInputHandlerDom();
  initDashboardDom();

  // Set up event listeners
  setupEventListeners(mapCanvas, brainCanvas);

  // Generate terrain and start simulation
  tileSystem.generate();
  dashboard.setup();
  cycle();

  // Initial zoom
  state.canvas.scale = 3;
  state.ctx.map.scale(3, 3);
}

/**
 * Initialize uPlot charts
 */
function initCharts(): void {
  const foodPopContainer = document.getElementById('foodPopChart');
  const optimizationContainer = document.getElementById('optimizationChart');
  const lifespanContainer = document.getElementById('lifespanChart');

  if (foodPopContainer) {
    initFoodPopChart(foodPopContainer);
  }

  if (optimizationContainer) {
    initOptimizationChart(optimizationContainer);
  }

  if (lifespanContainer) {
    initLifespanChart(lifespanContainer);
  }
}

/**
 * Set up all event listeners
 */
function setupEventListeners(mapCanvas: HTMLCanvasElement, brainCanvas: HTMLCanvasElement): void {
  // Stats canvas events
  // brainCanvas.addEventListener('mouseover', (e) => {
  //   handleMouseEvent('over', e, mapCanvas);
  //   state.mouse.overConsole = true;
  // });
  // brainCanvas.addEventListener('mousemove', (e) => handleMouseEvent('move', e, mapCanvas));
  // brainCanvas.addEventListener('mousedown', (e) => handleMouseEvent('down', e, mapCanvas));
  // brainCanvas.addEventListener('mouseup', (e) => handleMouseEvent('up', e, mapCanvas));
  // brainCanvas.addEventListener('mouseout', (e) => {
  //   handleMouseEvent('out', e, mapCanvas);
  //   state.mouse.overConsole = false;
  // });

  // Brain canvas click - show neuron weights
  brainCanvas.addEventListener('click', (e) => {
    if (state.highlighted === null) return;

    const rect = brainCanvas.getBoundingClientRect();
    const scaleX = brainCanvas.width / rect.width;
    const scaleY = brainCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const neuron = getNeuronAtPosition(x, y);
    if (neuron) {
      const amoeb = state.highlighted >= 0
        ? state.amoebs[state.highlighted]
        : state.graveyard[-(state.highlighted + 1)];
      if (amoeb) {
        displayNeuronWeights(amoeb, neuron.type, neuron.index);
      }
    }
  });

  // Brain canvas mouse tracking - show cursor position
  brainCanvas.addEventListener('mousemove', (e) => {
    const rect = brainCanvas.getBoundingClientRect();
    const scaleX = brainCanvas.width / rect.width;
    const scaleY = brainCanvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    updateBrainCursor(x, y);
  });

  brainCanvas.addEventListener('mouseleave', () => {
    updateBrainCursor(null, null);
  });

  // Map canvas events
  mapCanvas.addEventListener('mouseover', (e) => {
    handleMouseEvent('over', e, mapCanvas);
    state.mouse.overMap = true;
  });
  mapCanvas.addEventListener('mousemove', (e) => handleMouseEvent('move', e, mapCanvas));
  mapCanvas.addEventListener('mousedown', (e) => handleMouseEvent('down', e, mapCanvas));
  mapCanvas.addEventListener('mouseup', (e) => handleMouseEvent('up', e, mapCanvas));
  mapCanvas.addEventListener('mouseout', (e) => {
    handleMouseEvent('out', e, mapCanvas);
    state.mouse.overMap = false;
  });
  mapCanvas.addEventListener('wheel', (e) => handleMouseWheel(e, mapCanvas), { passive: false });

  // Keyboard events
  document.addEventListener('keydown', (e) => handleKeyDown(e, pauseSimulation));
  document.addEventListener('keyup', (e) => handleKeyUp(e));

  // Dashboard resize handle
  setupDashboardResize();
}

/**
 * Set up dashboard resize functionality
 */
function setupDashboardResize(): void {
  const dashboard = document.getElementById('dashboard');
  const handle = document.getElementById('dashboard-resize-handle');

  if (!dashboard || !handle) return;

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
      dashboard.style.width = newWidth + 'px';
      resizeCharts();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      handle.classList.remove('dragging');
      resizeCharts();
    }
  });
}

/**
 * Main simulation loop
 */
function cycle(): void {
  updateFPS();
  tileSystem.update();
  amoebSystem.update();
  inputHandler.update();

  // Update camera to follow tracked animal
  updateTracking();

  if (!state.pause && state.stats.time % 1000 === 0) {
    statSystem.update();
  }

  dashboard.update();

  if (!state.pause) {
    state.stats.time++;
  }

  requestAnimationFrame(cycle);
}

/**
 * Update camera position to follow tracked animal
 */
function updateTracking(): void {
  if (state.tracking === null) return;

  const ctx = state.ctx.map;
  if (!ctx) return;

  if(state.highlighted && state.highlighted > 0 && state.tracking !== null) {
    state.tracking = state.highlighted;
  }
  // Get the tracked animal
  const animal = state.tracking >= 0 ? state.amoebs[state.tracking] : state.graveyard[-(state.tracking + 1)];

  if (!animal || !animal.alive) {
    state.tracking = null;
    return;
  }

  // Get canvas dimensions
  const canvas = ctx.canvas;
  const centerX = canvas.width / 2 / state.canvas.scale;
  const centerY = canvas.height / 2 / state.canvas.scale;

  // Calculate translation needed to center the animal
  const dx = centerX - animal.x - state.mouse.originalX / state.canvas.scale;
  const dy = centerY - animal.y - state.mouse.originalY / state.canvas.scale;

  // Apply translation
  ctx.translate(dx, dy);
  state.mouse.originalX += dx * state.canvas.scale;
  state.mouse.originalY += dy * state.canvas.scale;
}

/**
 * Toggle simulation pause state
 */
function pauseSimulation(): void {
  if (state.pause) {
    state.pause = false;
    const btn = document.getElementById('play-button') as HTMLImageElement;
    if (btn) btn.src = 'icons/play.png';
  } else {
    state.pause = true;
    const btn = document.getElementById('play-button') as HTMLImageElement;
    if (btn) btn.src = 'icons/pause.png';
  }
}

/**
 * Start a new simulation
 */
function newSimulation(): void {
  state.highlighted = null;
  state.newest = null;
  state.scores = new Array(SCORESCAP);
  state.amoebs = new Array(POPCAP);
  state.graveyard = [];

  // Create initial population
  for (let i = 0; i < 100; i++) {
    state.amoebs[i] = new Amoeb(
      round(Math.random() * FIELDX),
      round(Math.random() * FIELDY),
      i
    );
  }

  state.resetStats();
  resetChartData();

  dashboard.setup();
  tileSystem.generate();

  const el = document.getElementById('dash-live-info');
  if (el) {
    el.innerHTML = 'LIVE: ' + state.stats.livePop + '     DEAD: ' + state.graveyard.length;
  }
}

/**
 * Show the correct display panel based on current display mode
 */
function showCurrentDisplay(): void {
  const statsEl = document.getElementById('amoeb-stats');
  const brainEl = document.getElementById('brain');
  const familyEl = document.getElementById('family-tree');

  if (statsEl) statsEl.style.display = 'block';

  if (state.display === 'brain' && brainEl) {
    brainEl.style.display = 'block';
    if (familyEl) familyEl.style.display = 'none';
  } else if (state.display === 'family' && familyEl) {
    familyEl.style.display = 'block';
    if (brainEl) brainEl.style.display = 'none';
    updateFamilyDisplay(true); // Force update when highlighting new amoeb
  }
}

/**
 * Highlight newest creature
 */
function highlightNewest(): void {
  state.highlighted = state.newest;
  showCurrentDisplay();
}

/**
 * Highlight gold medal holder
 */
function highlightGold(): void {
  state.highlighted = state.gold;
  showCurrentDisplay();
}

/**
 * Highlight silver medal holder
 */
function highlightSilver(): void {
  state.highlighted = state.silver;
  showCurrentDisplay();
}

/**
 * Highlight bronze medal holder
 */
function highlightBronze(): void {
  state.highlighted = state.bronze;
  showCurrentDisplay();
}

/**
 * Save simulation to file
 */
function save(): void {
  const animalString = JSON.stringify(state.amoebs);
  const tileString = JSON.stringify(state.tiles);

  const data = new Blob(
    [`var amoebs= '${animalString}'; \n\nvar tiles= '${tileString}'; `],
    { type: 'application/javascript' }
  );

  const url = window.URL.createObjectURL(data);
  console.log('SAVING...');

  const link = document.getElementById('save-button') as HTMLAnchorElement;
  if (link) {
    link.href = url;
    link.download = 'save.p3';
  }
}

/**
 * Load simulation (placeholder)
 */
function load(): void {
  // Load functionality to be implemented
  console.log('Load functionality not yet implemented');
}

/**
 * Toggle between stats display and brain display
 */
function toggleBrainDisplay(): void {
  if (state.highlighted === null) return;

  const brainCanvas = document.getElementById('brain');
  const familyTree = document.getElementById('family-tree');

  if (state.display === 'brain') {
    state.display = 'default'; // Switch back to stats
    if (brainCanvas) brainCanvas.style.display = 'none';
  } else {
    state.display = 'brain'; // Switch to brain display
    if (brainCanvas) brainCanvas.style.display = 'block';
    if (familyTree) familyTree.style.display = 'none';
  }
}

/**
 * Toggle tracking of highlighted animal
 */
function toggleTracking(): void {
  if (state.tracking !== null) {
    // Turn off tracking
    state.tracking = null;
  } else if (state.highlighted !== null) {
    // Start tracking highlighted animal
    state.tracking = state.highlighted;
  }
}

/**
 * Stop tracking (called on ESC or canvas click)
 */
function stopTracking(): void {
  state.tracking = null;
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
    highlight_gold: typeof highlightGold;
    highlight_silver: typeof highlightSilver;
    highlight_bronze: typeof highlightBronze;
    toggleBrainDisplay: typeof toggleBrainDisplay;
    toggleFamilyDisplay: typeof toggleFamilyDisplay;
    toggleTracking: typeof toggleTracking;
    stopTracking: typeof stopTracking;
    highlighted: number | null;
    leftPressed: boolean;
    graveyard: Amoeb[];
    amoebs: Amoeb[];
  }
}

window.init = init;
window.newSimulation = newSimulation;
window.pauseSimulation = pauseSimulation;
window.accelerateMutations = accelerateMutations;
window.save = save;
window.load = load;
window.highlight_newest = highlightNewest;
window.highlight_gold = highlightGold;
window.highlight_silver = highlightSilver;
window.highlight_bronze = highlightBronze;
window.toggleBrainDisplay = toggleBrainDisplay;
window.toggleFamilyDisplay = toggleFamilyDisplay;
window.toggleTracking = toggleTracking;
window.stopTracking = stopTracking;

// Expose state for inline script handlers
Object.defineProperty(window, 'highlighted', {
  get: () => state.highlighted,
  set: (v) => { state.highlighted = v; },
});
Object.defineProperty(window, 'leftPressed', {
  get: () => state.mouse.leftPressed,
  set: (v) => { state.mouse.leftPressed = v; },
});
Object.defineProperty(window, 'graveyard', {
  get: () => state.graveyard,
});
Object.defineProperty(window, 'amoebs', {
  get: () => state.amoebs,
});

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
