// StatSystem - Handles simulation statistics collection

import { TILENUMBER } from '../constants';
import { state } from '../state';
import uPlot from 'uplot';

/**
 * Format large numbers with K/M/B suffixes
 */
function formatNumber(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1_000_000_000) {
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (abs >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (abs >= 1_000) {
    return (val / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  if (abs < 1 && abs > 0) {  
    return val.toFixed(4);  
  }

  return val.toFixed(0);
}

// Chart references
let foodPopChart: uPlot | null = null;
let optimizationChart: uPlot | null = null;
let lifespanChart: uPlot | null = null;

// Data arrays (columnar format for uPlot)
// foodPopData: [time, red, green, blue, population]
let foodPopData: number[][] = [[], [], [], [], []];
// optimizationData: [time, avgDescendants, eatingEfficiency]
let optimizationData: number[][] = [[], [], []];
// lifespanData: [time, avgLifespan]
let lifespanData: number[][] = [[], []];

/**
 * Stack data for stacked area chart
 * Transforms [time, r, g, b, pop] to [time, r, r+g, r+g+b, pop]
 */
function stackFoodData(data: number[][]): number[][] {
  const stacked: number[][] = [data[0], [], [], [], data[4]];
  for (let i = 0; i < data[0].length; i++) {
    const r = data[1][i] || 0;
    const g = data[2][i] || 0;
    const b = data[3][i] || 0;
    stacked[1][i] = r;
    stacked[2][i] = r + g;
    stacked[3][i] = r + g + b;
  }
  return stacked;
}

/**
 * Initialize the food/population chart
 */
export function initFoodPopChart(container: HTMLElement): uPlot {
  const opts: uPlot.Options = {
    width: container.clientWidth || 300,
    height: 150,
    scales: {
      x: { time: false },
      y: { auto: true },
      pop: { auto: true },
    },
    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'y', size: 32, font: '10px sans-serif', side: 3, gap: 2, ticks: { show: false }, values: (_, vals) => vals.map(formatNumber) },
      { scale: 'pop', size: 32, font: '10px sans-serif', side: 1, gap: 2, ticks: { show: false }, values: (_, vals) => vals.map(formatNumber) },
    ],
    series: [
      {},
      {
        label: 'Red',
        stroke: 'rgb(200, 0, 0)',
        fill: 'rgba(255, 80, 80, 0.8)',
        scale: 'y',
        width: 1,
        points: { show: false },
      },
      {
        label: 'Green',
        stroke: 'rgb(0, 180, 0)',
        scale: 'y',
        width: 1,
        points: { show: false },
      },
      {
        label: 'Blue',
        stroke: 'rgb(0, 0, 200)',
        scale: 'y',
        width: 1,
        points: { show: false },
      },
      {
        label: 'Pop',
        stroke: 'rgb(50, 50, 50)',
        scale: 'pop',
        width: 2,
        points: { show: false },
      },
    ],
    bands: [
      { series: [2, 1], fill: 'rgba(80, 220, 80, 0.8)' },
      { series: [3, 2], fill: 'rgba(80, 80, 255, 0.8)' },
    ],
    legend: { show: false },
  };

  foodPopChart = new uPlot(opts, foodPopData, container);
  return foodPopChart;
}

/**
 * Initialize the optimization chart
 */
export function initOptimizationChart(container: HTMLElement): uPlot {
  const opts: uPlot.Options = {
    width: container.clientWidth || 300,
    height: 150,
    scales: {
      x: { time: false },
      desc: { auto: true },
      eat: { auto: true },
    },
    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'desc', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(formatNumber) },
      { scale: 'eat', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 1, values: (_, vals) => vals.map(formatNumber) },
    ],
    series: [
      {},
      { label: 'Descendants', stroke: 'rgb(50, 50, 50)', scale: 'desc', width: 1, points: { show: false } },
      { label: 'Eating', stroke: 'rgb(0, 196, 0)', scale: 'eat', width: 1, points: { show: false } },
    ],
    legend: { show: false },
  };

  optimizationChart = new uPlot(opts, optimizationData, container);
  return optimizationChart;
}

/**
 * Initialize the lifespan chart
 */
export function initLifespanChart(container: HTMLElement): uPlot {
  const opts: uPlot.Options = {
    width: container.clientWidth || 300,
    height: 150,
    scales: {
      x: { time: false },
      life: { auto: true },
    },
    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'life', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(formatNumber) },
    ],
    series: [
      {},
      { label: 'Avg Lifespan', stroke: 'rgb(196, 0, 196)', scale: 'life', width: 1, points: { show: false } },
    ],
    legend: { show: false },
  };

  lifespanChart = new uPlot(opts, lifespanData, container);
  return lifespanChart;
}

/**
 * Reset chart data
 */
export function resetChartData(): void {
  foodPopData = [[], [], [], [], []];
  optimizationData = [[], [], []];
  lifespanData = [[], []];

  if (foodPopChart) {
    foodPopChart.setData(stackFoodData(foodPopData));
  }
  if (optimizationChart) {
    optimizationChart.setData(optimizationData);
  }
  if (lifespanChart) {
    lifespanChart.setData(lifespanData);
  }
}

/**
 * Resize charts to fit their containers
 */
export function resizeCharts(): void {
  const foodPopContainer = document.getElementById('foodPopChart');
  const optimizationContainer = document.getElementById('optimizationChart');
  const lifespanContainer = document.getElementById('lifespanChart');

  if (foodPopChart && foodPopContainer) {
    foodPopChart.setSize({ width: foodPopContainer.clientWidth, height: 150 });
  }
  if (optimizationChart && optimizationContainer) {
    optimizationChart.setSize({ width: optimizationContainer.clientWidth, height: 150 });
  }
  if (lifespanChart && lifespanContainer) {
    lifespanChart.setSize({ width: lifespanContainer.clientWidth, height: 150 });
  }
}

export const statSystem = {
  /**
   * Collect and update statistics
   */
  update(): void {
    // Update history
    state.history.aveChildren.push(state.stats.aveChildren);
    if (state.stats.aveChildren > state.stats.maxAveChildren) {
      state.stats.maxAveChildren = state.stats.aveChildren;
    }
    state.stats.aveChildren = 0;

    state.history.aveLifespan.push(state.stats.aveLifespan);
    state.history.avePosNRG.push(state.stats.avePosNRG);

    // Collect animal stats
    let totalDescendants = 0;
    if (state.stats.livePop !== 0) {
      for (let i = 0; i <= state.HIGHESTINDEX; i++) {
        const a = state.amoebs[i];
        if (a.alive) {
          state.stats.netEatenRatio += (a.redEaten + a.greenEaten + a.blueEaten) / a.netEaten;
          totalDescendants += a.descendants;
        }
      }
      state.stats.netEatenRatio /= state.stats.livePop;
    } else {
      state.stats.netEatenRatio = 0;
    }
    const avgDescendants = state.stats.livePop > 0 ? totalDescendants / state.stats.livePop : 0;

    // Collect tile stats
    for (let i = 0; i < TILENUMBER; i++) {
      if (!state.pause) {
        state.stats.redAgarOnMap += state.tiles[i].R;
        state.stats.greenAgarOnMap += state.tiles[i].G;
        state.stats.blueAgarOnMap += state.tiles[i].B;
      }
    }

    // Update food/population chart
    const timeLabel = state.stats.time / 100;
    foodPopData[0].push(timeLabel);
    foodPopData[1].push(state.stats.redAgarOnMap);
    foodPopData[2].push(state.stats.greenAgarOnMap);
    foodPopData[3].push(state.stats.blueAgarOnMap);
    foodPopData[4].push(state.stats.livePop);

    if (foodPopChart) {
      foodPopChart.setData(stackFoodData(foodPopData));
    }

    // Calculate average lifespan
    if (state.stats.deathCount > 0) {
      state.stats.aveLifespan = state.stats.netLifespan / state.stats.deathCount;
    }

    // Update optimization chart
    optimizationData[0].push(timeLabel);
    optimizationData[1].push(avgDescendants);
    optimizationData[2].push(state.stats.netEatenRatio);

    if (optimizationChart) {
      optimizationChart.setData(optimizationData);
    }

    // Update lifespan chart
    lifespanData[0].push(timeLabel);
    lifespanData[1].push(state.stats.aveLifespan);

    if (lifespanChart) {
      lifespanChart.setData(lifespanData);
    }

    // Reset per-frame stats
    state.stats.netEatenRatio = 0;
    state.stats.redAgarOnMap = 0;
    state.stats.greenAgarOnMap = 0;
    state.stats.blueAgarOnMap = 0;

    if (state.stats.aveLifespan > state.stats.maxAveLifespan) {
      state.stats.maxAveLifespan = state.stats.aveLifespan;
    }
    if (state.stats.avePosNRG > state.stats.maxAvePosNRG) {
      state.stats.maxAvePosNRG = state.stats.avePosNRG;
    }
  },
};
