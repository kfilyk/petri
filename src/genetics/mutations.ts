// Genetic algorithm mutation functions
// These extend Amoeb prototype with advanced mutation strategies

import { state } from '../state';
import { Amoeb } from '../entities/Amoeb';
import { BRAIN_SIZE } from '../constants';

/**
 * Get mutations based on accelerate mode
 * @param animal - The animal being mutated
 * @param x - Mutation type (0=weights, 1=bias, 5=maxSize, 6=minSize)
 * @param scale - Scale factor for random mutations
 * @param i - Neuron index
 * @param k - Weight index
 */
export function getMutations(
  animal: Amoeb,
  x: number,
  scale: number,
  i: number,
  k: number
): number {
  let r = (Math.random() * 2 - 1) / scale;
  if (Math.random() > 0.5) {
    r = 0;
  }

  if (state.accelerate === 0) {
    return r;
  } else if (state.accelerate === 1) {
    let pM = getAdvantageousMutations(animal, x, i, k);
    pM *= animal.proGenes;
    return (pM + r) / (animal.proGenes + 1);
  } else if (state.accelerate === 2) {
    let pM = getAdvantageousMutations(animal, x, i, k);
    const cM = getDetrimentalMutations(animal, x, i, k);
    const diff = pM - cM;
    pM *= animal.proGenes;
    pM = (pM + r) / (animal.proGenes + 1);
    return diff + pM;
  } else if (state.accelerate === 3) {
    const pM = getAdvantageousMutations(animal, x, i, k);
    return pM + r;
  } else if (state.accelerate === 4) {
    const pM = getAdvantageousMutations(animal, x, i, k);
    const cM = getDetrimentalMutations(animal, x, i, k);
    const diff = pM - cM;
    return pM + diff + r;
  } else if (state.accelerate >= 5 && state.accelerate <= 7) {
    let pM = getAdvantageousMutations(animal, x, i, k);
    const cM = getDetrimentalMutations(animal, x, i, k);
    const diff = pM - cM;
    pM *= animal.proGenes;
    if (state.accelerate === 7) {
      pM = (pM + r * (animal.conGenes + 1)) / (animal.proGenes + (animal.conGenes + 1));
    } else {
      pM = (pM + r) / (animal.proGenes + 1);
    }
    return diff + pM;
  } else if (state.accelerate === 9) {
    let pM = recurseGetAdvantageous(animal, x, i, k, animal.index);
    let pG = recurseCountAdvantageous(animal, x, i, k);
    if (pG === 0) {
      pG++;
    } else {
      animal.proGenes = pG;
    }
    pM /= pG;

    let cM = recurseGetDetrimentals(animal, x, i, k, animal.index);
    let cG = recurseCountDetrimentals(animal, x, i, k);
    if (cG === 0) {
      cG++;
    } else {
      animal.conGenes = cG;
    }
    cM /= cG;
    const diff = pM - cM;

    pM *= pG;
    pM = (pM + r) / (animal.proGenes + 1);
    return diff + pM;
  } else if (state.accelerate === 10) {
    let pM = recurseGetAdvantageous(animal, x, i, k, animal.index);
    let pG = recurseCountAdvantageous(animal, x, i, k);
    if (pG === 0) {
      pG++;
    } else {
      animal.proGenes = pG;
    }
    pM /= pG;

    let cM = recurseGetDetrimentals(animal, x, i, k, animal.index);
    let cG = recurseCountDetrimentals(animal, x, i, k);
    if (cG === 0) {
      cG++;
    } else {
      animal.conGenes = cG;
    }
    cM /= cG;

    pM *= pG;
    pM = (pM + r) / (animal.proGenes + 1);
    return pM - cM;
  } else if (state.accelerate === 11) {
    let pM = recurseGetAdvantageous(animal, x, i, k, animal.index);
    let pG = recurseCountAdvantageous(animal, x, i, k);
    if (pG === 0) {
      pG++;
    } else {
      animal.proGenes = pG;
    }
    pM /= pG;

    let cM = recurseGetDetrimentals(animal, x, i, k, animal.index);
    let cG = recurseCountDetrimentals(animal, x, i, k);
    if (cG === 0) {
      cG++;
    } else {
      animal.conGenes = cG;
    }
    cM /= cG;
    const diff = (pM - cM) / 2;
    return diff + pM + r;
  } else if (state.accelerate === 12) {
    const pM = recurseGetAdvantageous(animal, x, i, k, animal.index);
    const pG = recurseCountAdvantageous(animal, x, i, k);
    animal.proGenes = pG;

    const cM = recurseGetDetrimentals(animal, x, i, k, animal.index);
    const cG = recurseCountDetrimentals(animal, x, i, k);
    animal.conGenes = cG;

    return (pM - cM + r) / (pG + cG + 1);
  }

  return r;
}

/**
 * Get advantageous mutations from successful descendants
 */
function getAdvantageousMutations(
  animal: Amoeb,
  x: number,
  i: number,
  k: number
): number {
  let pM = 0;
  let pG = 0;

  if (state.accelerate === 0) {
    return 0;
  } else if (state.accelerate < 8) {
    for (let y = 0; y < animal.children.length; y++) {
      const child =
        animal.children[y] >= 0
          ? state.amoebs[animal.children[y]]
          : state.graveyard[-(animal.children[y] + 1)];

      let c = 0;
      if (state.accelerate > 0 && state.accelerate < 5) {
        c = child.children.length;
      }

      if (x === 0 && animal.brain && child.brain) {
        pM += c * (child.brain[i].weights1[k] - animal.brain[i].weights1[k]);
      }
      pG += c;
    }

    if (pG === 0) {
      pG++;
    } else {
      animal.proGenes = pG;
    }
    return pM / pG;
  }

  if (state.accelerate >= 9) {
    pM = recurseGetAdvantageous(animal, x, i, k, animal.index);
    pG = recurseCountAdvantageous(animal, x, i, k);
    if (pG === 0) {
      pG++;
    } else {
      animal.proGenes = pG;
    }
    return pM / pG;
  }

  return 0;
}

/**
 * Get detrimental mutations from unsuccessful descendants
 */
function getDetrimentalMutations(
  animal: Amoeb,
  x: number,
  i: number,
  k: number
): number {
  let cM = 0;
  let cG = 0;

  if (state.accelerate === 0) {
    return 0;
  } else if (state.accelerate < 8) {
    for (let y = 0; y < animal.children.length; y++) {
      if ((state.accelerate > 0 && state.accelerate < 5) && animal.children[y] < 0) {
        const child = state.graveyard[-(animal.children[y] + 1)];
        if (child.children.length === 0) {
          if (x === 0 && animal.brain && child.brain) {
            cM += child.brain[i].weights1[k] - animal.brain[i].weights1[k];
          }
          cG++;
        }
      }
    }

    if (cG === 0) {
      cG++;
    } else {
      animal.conGenes = cG;
    }
    return cM / cG;
  } else if (state.accelerate >= 9) {
    cM = recurseGetDetrimentals(animal, x, i, k, animal.index);
    cG = recurseCountDetrimentals(animal, x, i, k);
    if (cG === 0) {
      cG++;
    } else {
      animal.conGenes = cG;
    }
    return cM / cG;
  }

  return 0;
}

/**
 * Recursively get advantageous mutation deltas from all descendants
 */
function recurseGetAdvantageous(
  animal: Amoeb,
  x: number,
  i: number,
  k: number,
  idx: number
): number {
  let pM = 0;
  const a = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];

  for (let y = 0; y < a.children.length; y++) {
    const child =
      a.children[y] >= 0
        ? state.amoebs[a.children[y]]
        : state.graveyard[-(a.children[y] + 1)];

    const cc = child.children.length;

    if (state.accelerate === 8 && a.children[y] >= 0) {
      if (x === 0 && animal.brain && child.brain) {
        pM += child.brain[i].weights1[k] - animal.brain[i].weights1[k];
      }
    } else if (state.accelerate >= 9 && cc > 0) {
      if (x === 0 && animal.brain && child.brain) {
        pM += cc * (child.brain[i].weights1[k] - animal.brain[i].weights1[k]);
      }
    }

    if (cc > 0) {
      pM += recurseGetAdvantageous(animal, x, i, k, a.children[y]);
    }
  }

  return pM;
}

/**
 * Recursively count advantageous descendants
 */
function recurseCountAdvantageous(
  animal: Amoeb,
  _x: number,
  _i: number,
  _k: number
): number {
  let pG = 0;

  for (let y = 0; y < animal.children.length; y++) {
    const child =
      animal.children[y] >= 0
        ? state.amoebs[animal.children[y]]
        : state.graveyard[-(animal.children[y] + 1)];

    const cc = child.children.length;
    if (cc > 0) {
      pG += recurseCountAdvantageous(child, _x, _i, _k) + cc;
    }
  }

  return pG;
}

/**
 * Recursively get detrimental mutation deltas
 */
function recurseGetDetrimentals(
  animal: Amoeb,
  x: number,
  i: number,
  k: number,
  idx: number
): number {
  let cM = 0;
  const a = idx >= 0 ? state.amoebs[idx] : state.graveyard[-(idx + 1)];

  for (let y = 0; y < a.children.length; y++) {
    const child =
      a.children[y] >= 0
        ? state.amoebs[a.children[y]]
        : state.graveyard[-(a.children[y] + 1)];

    if (child.children.length > 0) {
      cM += recurseGetDetrimentals(animal, x, i, k, a.children[y]);
    }

    if (
      (state.accelerate === 8 && a.children[y] < 0) ||
      (state.accelerate >= 9 && child.children.length === 0 && a.children[y] < 0)
    ) {
      if (x === 0 && animal.brain && child.brain) {
        cM += child.brain[i].weights1[k] - animal.brain[i].weights1[k];
      }
    }
  }

  return cM;
}

/**
 * Recursively count detrimental (childless dead) descendants
 */
function recurseCountDetrimentals(
  animal: Amoeb,
  _x: number,
  _i: number,
  _k: number
): number {
  let cG = 0;

  for (let y = 0; y < animal.children.length; y++) {
    const child =
      animal.children[y] >= 0
        ? state.amoebs[animal.children[y]]
        : state.graveyard[-(animal.children[y] + 1)];

    if (child.children.length > 0) {
      cG += recurseCountDetrimentals(child, _x, _i, _k);
    } else if (animal.children[y] < 0) {
      cG++;
    }
  }

  return cG;
}

/**
 * Accelerate mutations toggle
 */
export function accelerateMutations(): void {
  state.accelerate = (state.accelerate + 1) % 13;
}
