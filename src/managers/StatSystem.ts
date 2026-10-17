// StatSystem - Handles simulation statistics collection

import type { StatsSample } from '../sim/protocol';
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


/**
 * uPlot plugin: when the cursor is not over the chart, the live legend shows
 * the LATEST datapoint instead of '--'. Hovering still shows the hovered point.
 */
function latestLegendPlugin(): uPlot.Plugin {
  return {
    hooks: {
      setLegend: (u) => {
        // console.log("FIRING SET LEGEND")
        if (u.cursor.idx != null) return; // hovering: keep uPlot's own values
        const last = u.data[0].length - 1;
        if (last < 0) return;
        u.setLegend({ idx: last }, false); // false = don't re-fire this hook
      },
    },
  };
}

// Chart references
let foodPopChart: uPlot | null = null;
let optimizationChart: uPlot | null = null;
let lifespanChart: uPlot | null = null;
let mutationStratChart: uPlot | null = null;
let genDemoChart: uPlot | null = null;

// Data arrays (columnar format for uPlot)
// foodPopData: [time, red, green, blue, population]
let foodPopData: number[][] = [[], [], [], [], []];
// optimizationData: [time, avgDescendants, eatingEfficiency]
let optimizationData: number[][] = [[], [], []];
// lifespanData: [time, avgLifespan, avgLivingLifespan, avgEnergyEfficiency]
let lifespanData: number[][] = [[], [], [], []];
// mutationStratData: [time, mutationRate, avgAdvWeight, avgDisWeight]
let mutationStratData: number[][] = [[], [], [], []];
// genDemoData: [generations, deadCounts, deadPlusAliveCounts] — rebuilt from scratch each update
let genDemoData: number[][] = [[], [], []];

// Legend value for a food series: the raw per-colour amount, not the stacked
// running total that the chart draws.
// const rawFoodValue = (si: number) =>
//   (_u: uPlot, _v: number | null, _si: number, idx: number | null | undefined): string =>
//     idx == null ? '--' : formatNumber(foodPopData[si][idx] ?? 0);

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
        // value: rawFoodValue(1),
      },
      {
        label: 'Green',
        stroke: 'rgb(0, 180, 0)',
        scale: 'y',
        width: 1,
        points: { show: false },
        // value: rawFoodValue(2),
      },
      {
        label: 'Blue',
        stroke: 'rgb(0, 0, 200)',
        scale: 'y',
        width: 1,
        points: { show: false },
        // value: rawFoodValue(3),
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

  foodPopChart = new uPlot({ ...opts, plugins: [latestLegendPlugin()] }, foodPopData as uPlot.AlignedData, container);
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

  optimizationChart = new uPlot({ ...opts, plugins: [latestLegendPlugin()] }, optimizationData as uPlot.AlignedData, container);
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
      eff: { auto: true },
    },
    legend: {
      show: true,
      live: true,  // updates on hover (default)
    },

    axes: [
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false } },
      { scale: 'life', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 3, values: (_, vals) => vals.map(formatNumber) },
      { scale: 'eff', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 1, values: (_, vals) => vals.map((v: number) => v.toFixed(2)) },
    ],
    series: [
      {},
      { label: 'Avg Living', stroke: 'rgb(220, 60, 60)', scale: 'life', width: 1, points: { show: false } },
      { label: 'Energy Efficiency', stroke: 'rgb(255, 180, 0)', scale: 'eff', width: 1, points: { show: false } },
    ],
  };

  lifespanChart = new uPlot({ ...opts, plugins: [latestLegendPlugin()] }, lifespanData as uPlot.AlignedData, container);
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
      { scale: 'y', size: 32, font: '10px sans-serif', gap: 2, ticks: { show: false }, side: 1, values: (_, vals) => vals.map(val => val.toFixed(4)) },
    ],
    series: [
      {},
      { label: 'Mut Rate', stroke: 'rgb(255, 140, 0)', scale: 'y', width: 1, points: { show: false } },
      // { label: 'Adv Weight', stroke: 'rgb(60, 180, 60)', scale: 'y', width: 1, points: { show: false } },
      // { label: 'Dis Weight', stroke: 'rgb(220, 60, 60)', scale: 'y', width: 1, points: { show: false } },
    ],
  };

  mutationStratChart = new uPlot({ ...opts, plugins: [latestLegendPlugin()] }, mutationStratData as uPlot.AlignedData, container);
  return mutationStratChart;
}

/**
 * Initialize the generation demographics bar chart
 */
export function initGenDemoChart(container: HTMLElement): uPlot {
  const bars = uPlot.paths.bars!({ size: [0.6, 64], align: 0, gap: 2 });

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
      { show: true, size: 16, font: '10px sans-serif', gap: 4, ticks: { show: false }, values: (_, vals) => vals.map(v => String(Math.round(v))) },
      { scale: 'y', size: 32, font: '10px sans-serif', side: 3, gap: 2, ticks: { show: false }, values: (_, vals) => vals.map(formatNumber) },
    ],
    series: [
      {},
      {
        label: 'Living',
        stroke: 'rgb(0, 180, 0)',
        fill: 'rgba(60, 200, 60, 0.8)',
        scale: 'y',
        width: 0,
        paths: bars,
        points: { show: false },
        value: (_u, _val, _si, dataIdx) => {
          if (dataIdx == null) return '--';
          const total = genDemoData[1][dataIdx] || 0;
          const dead = genDemoData[2][dataIdx] || 0;
          return String(total - dead);
        },
      },
      {
        label: 'Deceased',
        stroke: 'rgb(200, 0, 0)',
        fill: 'rgba(220, 60, 60, 0.8)',
        scale: 'y',
        width: 0,
        paths: bars,
        points: { show: false },
      },
    ],
  };

  genDemoChart = new uPlot({ ...opts, plugins: [latestLegendPlugin()] }, genDemoData as uPlot.AlignedData, container);
  return genDemoChart;
}

/**
 * Reset chart data
 */
export function resetChartData(): void {
  foodPopData = [[], [], [], [], []];
  optimizationData = [[], [], []];
  lifespanData = [[], [], [], []];
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

  genDemoData = [[], [], []];
  if (genDemoChart) {
    genDemoChart.setData(genDemoData as uPlot.AlignedData);
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

  const genDemoContainer = document.getElementById('genDemoChart');
  if (genDemoChart && genDemoContainer) {
    genDemoChart.setSize({ width: genDemoContainer.clientWidth, height: 150 });
  }
}

/**
 * Append one statistics sample (computed in the worker, see sim/stats.ts)
 * to every chart.
 */
export function pushStatsSample(s: StatsSample): void {
  // Food / population
  foodPopData[0].push(s.timeLabel);
  foodPopData[1].push(s.redAgar);
  foodPopData[2].push(s.greenAgar);
  foodPopData[3].push(s.blueAgar);
  foodPopData[4].push(s.livePop);
  if (foodPopChart) {
    foodPopChart.setData(stackFoodData(foodPopData) as uPlot.AlignedData);
  }

  // Optimization
  optimizationData[0].push(s.timeLabel);
  optimizationData[1].push(s.aveChildren);
  optimizationData[2].push(s.eatEfficiency);
  if (optimizationChart) {
    optimizationChart.setData(optimizationData as uPlot.AlignedData);
  }

  // Lifespan
  lifespanData[0].push(s.timeLabel);
  lifespanData[1].push(s.aveLivingLifespan);
  lifespanData[2].push(s.avgEnergyEff);
  if (lifespanChart) {
    lifespanChart.setData(lifespanData as uPlot.AlignedData);
  }

  // Mutation strategy
  mutationStratData[0].push(s.timeLabel);
  mutationStratData[1].push(s.mutationRate);
  if (mutationStratChart) {
    mutationStratChart.setData(mutationStratData as uPlot.AlignedData);
  }

  // Generation demographics (rebuilt from scratch each sample)
  genDemoData = [s.gens, s.stackedCounts, s.deadCounts];
  if (genDemoChart) {
    genDemoChart.setData(genDemoData as uPlot.AlignedData);
  }
}
