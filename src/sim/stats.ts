// =============================================================================
// stats.ts — statistics aggregation (simulation side)
// =============================================================================
//
// Runs INSIDE the worker. Every 1000 ticks worker.ts calls collectStatsSample()
// and posts the result to the main thread, where managers/StatSystem.ts turns
// it into chart points. The split is deliberate:
//
//   * Aggregating needs to touch every amoeba and every tile — simulation data
//     that only the worker has.
//   * Charting needs the DOM (uPlot) — which only the main thread has.
//
// So this file computes numbers and knows nothing about charts, and StatSystem
// draws charts and knows nothing about amoebas. The StatsSample type in
// protocol.ts is the handshake between them.
//
// The logic is a straight port of the old statSystem.update(); the per-sample
// accumulators on state.stats (netEatenRatio, *AgarOnMap, mitoses...) are
// still reset at the end exactly as before.

import { TILENUMBER, MUTATION_RATE } from '../constants';
import { state } from '../state';
import type { StatsSample } from './protocol';

export function collectStatsSample(): StatsSample {
  // Update history
  state.history.avePosNRG.push(state.stats.avePosNRG);

  // ── Per-amoeba aggregates over the living population ──
  let totalChildren = 0;
  let totalLivingAge = 0;
  let totalEfficiency = 0;
  if (state.stats.livePop !== 0) {
    for (let i = 0; i <= state.HIGHESTINDEX; i++) {
      const a = state.amoebs[i];
      if (a && a.status === 'alive') {
        state.stats.netEatenRatio += (a.redEaten + a.greenEaten + a.blueEaten) / a.netEaten;
        totalChildren += a.children.length;
        totalLivingAge += state.stats.time - a.born;
        if (a.totalEnergyCost > 0) {
          totalEfficiency += a.totalEnergyGain / a.totalEnergyCost;
        }
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

  // ── Food on the map, by colour, plus the theoretical maximum ──
  let totalAgarOnMap = 0;
  for (let i = 0; i < TILENUMBER; i++) {
    const t = state.tiles[i];
    state.stats.redAgarOnMap += t.R;
    state.stats.greenAgarOnMap += t.G;
    state.stats.blueAgarOnMap += t.B;
    totalAgarOnMap += t.RCap + t.GCap + t.BCap;
  }

  // Eating efficiency: how much the population eats relative to how much food is available
  const totalFood = state.stats.redAgarOnMap + state.stats.greenAgarOnMap + state.stats.blueAgarOnMap;
  const foodFraction = totalAgarOnMap > 0 ? totalFood / totalAgarOnMap : 1;
  const eatEfficiency = foodFraction > 0 ? state.stats.netEatenRatio / foodFraction : 0;

  const pop = state.stats.livePop;
  const aveLivingLifespan = pop > 0 ? totalLivingAge / pop : 0;
  const avgEnergyEff = pop > 0 ? totalEfficiency / pop : 0;

  // ── Generation demographics: how many alive / dead per generation number ──
  const livingByGen: Map<number, number> = new Map();
  const deadByGen: Map<number, number> = new Map();

  for (let i = 0; i <= state.HIGHESTINDEX; i++) {
    const a = state.amoebs[i];
    if (a != null && a.status === 'alive') {
      livingByGen.set(a.gen, (livingByGen.get(a.gen) || 0) + 1);
    }
  }
  for (let i = 0; i < state.graveyard.length; i++) {
    const g = state.graveyard[i];
    deadByGen.set(g.gen, (deadByGen.get(g.gen) || 0) + 1);
  }

  let maxGen = 0;
  for (const gen of livingByGen.keys()) if (gen > maxGen) maxGen = gen;
  for (const gen of deadByGen.keys()) if (gen > maxGen) maxGen = gen;

  // Dense arrays indexed by generation (uPlot wants aligned arrays)
  const gens: number[] = [];
  const deadCounts: number[] = [];
  const stackedCounts: number[] = [];
  for (let g = 0; g <= maxGen; g++) {
    const dead = deadByGen.get(g) || 0;
    const alive = livingByGen.get(g) || 0;
    gens.push(g);
    deadCounts.push(dead);
    stackedCounts.push(dead + alive);
  }

  const sample: StatsSample = {
    timeLabel: state.stats.time / 100,
    redAgar: state.stats.redAgarOnMap,
    greenAgar: state.stats.greenAgarOnMap,
    blueAgar: state.stats.blueAgarOnMap,
    livePop: pop,
    aveChildren: state.stats.aveChildren,
    eatEfficiency,
    aveLivingLifespan,
    avgEnergyEff,
    mutationRate: MUTATION_RATE,
    gens,
    stackedCounts,
    deadCounts,
  };

  // ── Reset the per-sample accumulators for the next 1000 ticks ──
  state.stats.netEatenRatio = 0;
  state.stats.redAgarOnMap = 0;
  state.stats.greenAgarOnMap = 0;
  state.stats.blueAgarOnMap = 0;
  state.stats.mitoses = 0;
  state.stats.advWeight = 0;
  state.stats.disWeight = 0;

  if (state.stats.avePosNRG > state.stats.maxAvePosNRG) {
    state.stats.maxAvePosNRG = state.stats.avePosNRG;
  }

  return sample;
}
