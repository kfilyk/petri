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

/**
 * Format numbers in scientific notation (e.g. 3.2e-5)
 */
function formatSci(val: number): string {
  if (val === 0) return '0';
  return val.toExponential(1);
}

// Chart references
let foodPopChart: uPlot | null = null;
let optimizationChart: uPlot | null = null;
let lifespanChart: uPlot | null = null;
let mutationStratChart: uPlot | null = null;

// Data arrays (columnar format for uPlot)
// foodPopData: [time, red, green, blue, population]
let foodPopData: number[][] = [[], [], [], [], []];
// optimizationData: [time, avgDescendants, eatingEfficiency]
let optimizationData: number[][] = [[], [], []];
// lifespanData: [time, avgLifespan]
let lifespanData: number[][] = [[], []];
// mutationStratData: [time, mutationRate, avgAdvWeight, avgDisWeight]
let mutationStratData: number[][] = [[], [], [], []];

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
    legend: {                                                                                                                                        
      show: true,                                                                                                                                    
      live: true,  // updates on hover (default)                                                                                                     
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
  };

  foodPopChart = new uPlot(opts, foodPopData as uPlot.AlignedData, container);
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
    legend: {                                                                                                                                        
      show: true,                                                                                                                                    
      live: true,  // updates on hover (default)                                                                                                     
    },     
    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'desc', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(formatNumber) },
      { scale: 'eat', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 1, values: (_, vals) => vals },
    ],
    series: [
      {},
      { label: 'Avg Children', stroke: 'rgb(50, 50, 50)', scale: 'desc', width: 1, points: { show: false } },
      { label: 'R Eat Efficiency', stroke: 'rgb(0, 196, 0)', scale: 'eat', width: 1, points: { show: false } },
    ],
  };

  optimizationChart = new uPlot(opts, optimizationData as uPlot.AlignedData, container);
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
    legend: {
      show: true,
      live: true,  // updates on hover (default)
    },

    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'life', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(formatNumber) },
    ],
    series: [
      {},
      { label: 'Avg Lifespan', stroke: 'rgb(196, 0, 196)', scale: 'life', width: 1, points: { show: false } },
    ],
  };

  lifespanChart = new uPlot(opts, lifespanData as uPlot.AlignedData, container);
  return lifespanChart;
}

/**
 * Initialize the mutation strategy chart
 */
export function initMutationStratChart(container: HTMLElement): uPlot {
  const opts: uPlot.Options = {
    width: container.clientWidth || 300,
    height: 150,
    scales: {
      x: { time: false },
      y: { auto: true },
    },
    legend: {
      show: true,
      live: true,
    },
    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'y', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(val => val.toFixed(2)) },
    ],
    series: [
      {},
      // { label: 'Mut Rate', stroke: 'rgb(255, 140, 0)', scale: 'y', width: 1, points: { show: false } },
      { label: 'Adv Weight', stroke: 'rgb(60, 180, 60)', scale: 'y', width: 1, points: { show: false } },
      { label: 'Dis Weight', stroke: 'rgb(220, 60, 60)', scale: 'y', width: 1, points: { show: false } },
    ],
  };

  mutationStratChart = new uPlot(opts, mutationStratData as uPlot.AlignedData, container);
  return mutationStratChart;
}

/**
 * Reset chart data
 */
export function resetChartData(): void {
  foodPopData = [[], [], [], [], []];
  optimizationData = [[], [], []];
  lifespanData = [[], []];
  mutationStratData = [[], [], [], []];

  if (foodPopChart) {
    foodPopChart.setData(stackFoodData(foodPopData) as uPlot.AlignedData);
  }
  if (optimizationChart) {
    optimizationChart.setData(optimizationData as uPlot.AlignedData);
  }
  if (lifespanChart) {
    lifespanChart.setData(lifespanData as uPlot.AlignedData);
  }
  if (mutationStratChart) {
    mutationStratChart.setData(mutationStratData as uPlot.AlignedData);
  }
}

/**
 * Resize charts to fit their containers
 */
export function resizeCharts(): void {
  const foodPopContainer = document.getElementById('foodPopChart');
  const optimizationContainer = document.getElementById('optimizationChart');
  const lifespanContainer = document.getElementById('lifespanChart');
  const mutationStratContainer = document.getElementById('mutationStratChart');

  if (foodPopChart && foodPopContainer) {
    foodPopChart.setSize({ width: foodPopContainer.clientWidth, height: 150 });
  }
  if (optimizationChart && optimizationContainer) {
    optimizationChart.setSize({ width: optimizationContainer.clientWidth, height: 150 });
  }
  if (lifespanChart && lifespanContainer) {
    lifespanChart.setSize({ width: lifespanContainer.clientWidth, height: 150 });
  }
  if (mutationStratChart && mutationStratContainer) {
    mutationStratChart.setSize({ width: mutationStratContainer.clientWidth, height: 150 });
  }
}

export const statSystem = {
  /**
   * Collect and update statistics
   */
  update(): void {
    // Update history
    state.history.aveLifespan.push(state.stats.aveLifespan);
    state.history.avePosNRG.push(state.stats.avePosNRG);

    // Collect animal stats
    let totalDescendants = 0;
    let totalChildren = 0;
    if (state.stats.livePop !== 0) {
      for (let i = 0; i <= state.HIGHESTINDEX; i++) {
        const a = state.amoebs[i];
        if (a.status === 'alive') {
          state.stats.netEatenRatio += (a.redEaten + a.greenEaten + a.blueEaten) / a.netEaten;
          totalDescendants += a.descendants;
          totalChildren += a.children.length;
        }
      }
      state.stats.netEatenRatio /= state.stats.livePop;
    } else {
      state.stats.netEatenRatio = 0;
    }
    state.stats.aveChildren = state.stats.livePop > 0 ? totalChildren / state.stats.livePop : 0;
    state.history.aveChildren.push(state.stats.aveChildren);
    if (state.stats.aveChildren > state.stats.maxAveChildren) {
      state.stats.maxAveChildren = state.stats.aveChildren;
    }

    // Collect tile stats
    let totalFoodCap = 0;
    for (let i = 0; i < TILENUMBER; i++) {
      if (!state.pause) {
        state.stats.redAgarOnMap += state.tiles[i].R;
        state.stats.greenAgarOnMap += state.tiles[i].G;
        state.stats.blueAgarOnMap += state.tiles[i].B;
        totalFoodCap += state.tiles[i].RCap + state.tiles[i].GCap + state.tiles[i].BCap;
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
      foodPopChart.setData(stackFoodData(foodPopData) as uPlot.AlignedData);
    }

    // Calculate average lifespan
    if (state.stats.deathCount > 0) {
      state.stats.aveLifespan = state.stats.netLifespan / state.stats.deathCount;
    }

    // Update optimization chart
    const totalFood = state.stats.redAgarOnMap + state.stats.greenAgarOnMap + state.stats.blueAgarOnMap;
    const foodFraction = totalFoodCap > 0 ? totalFood / totalFoodCap : 1;
    const eatEfficiency = foodFraction > 0 ? state.stats.netEatenRatio / foodFraction : 0;
    optimizationData[0].push(timeLabel);
    optimizationData[1].push(state.stats.aveChildren);
    optimizationData[2].push(eatEfficiency);

    if (optimizationChart) {
      optimizationChart.setData(optimizationData as uPlot.AlignedData);
    }

    // Update lifespan chart
    lifespanData[0].push(timeLabel);
    lifespanData[1].push(state.stats.aveLifespan);

    if (lifespanChart) {
      lifespanChart.setData(lifespanData as uPlot.AlignedData);
    }

    // Update mutation strategy chart
    const pop = state.stats.livePop;
    mutationStratData[0].push(timeLabel);
    // mutationStratData[1].push(state.stats.mitoses > 0 ? state.stats.mutationRate / state.stats.mitoses : 0);
    mutationStratData[1].push(state.stats.mitoses > 0 ? state.stats.advWeight / state.stats.mitoses : 0);
    mutationStratData[2].push(state.stats.mitoses > 0 ? state.stats.disWeight / state.stats.mitoses : 0);

    if (mutationStratChart) {
      mutationStratChart.setData(mutationStratData as uPlot.AlignedData);
    }

    // Reset per-frame stats
    state.stats.netEatenRatio = 0;
    state.stats.redAgarOnMap = 0;
    state.stats.greenAgarOnMap = 0;
    state.stats.blueAgarOnMap = 0;
    state.stats.mitoses = 0;
    state.stats.advWeight = 0;
    state.stats.disWeight = 0;

    if (state.stats.aveLifespan > state.stats.maxAveLifespan) {
      state.stats.maxAveLifespan = state.stats.aveLifespan;
    }
    if (state.stats.avePosNRG > state.stats.maxAvePosNRG) {
      state.stats.maxAvePosNRG = state.stats.avePosNRG;
    }
  },
};
