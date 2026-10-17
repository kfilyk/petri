// FamilyDisplay - Shows family tree for highlighted amoeba

import { state } from '../state';
import type { Amoeba } from '../entities/Amoeba';
import { getAlikeness, getBrainWeight } from '../utils/math';

let familyContainer: HTMLElement | null = null;

// Navigation history stack
const navHistory: number[] = [];

let lastHighlighted: number | null = null;
let lastDescendants: number | undefined = undefined;
/**
 * Initialize the family display container
 */
export function initFamilyDisplay(): void {
  familyContainer = document.getElementById('family-tree');
}

/**
 * Get amoeba by index (handles both alive and dead)
 */
function getAmoeb(idx: number): Amoeba | null {
  if (idx >= 0) {
    return state.amoebs[idx] || null;
  } else {
    return state.graveyard[-(idx + 1)] || null;
  }
}

/**
 * Format amoeba name for display
 */
function formatName(amoeba: Amoeba): string {
  return `${amoeba.name}-${amoeba.gen}${amoeba.status === 'alive' ? 'A' : 'D'}${amoeba.descendants}`;
}

// Tooltip element (shared across all family members)
let tooltip: HTMLElement | null = null;

function getTooltip(): HTMLElement {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'family-tooltip';
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

/**
 * Create a clickable element for an amoeba
 */
function createAmoebElement(amoeba: Amoeba, label: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'family-member';
  if (amoeba.status !== 'alive') {
    el.className += ' family-member-dead';
  }
  if (amoeba.index === state.highlighted) {
    el.className += ' family-member-self';
  }

  el.innerHTML = `<span class="family-label">${label}</span><span class="family-name">${formatName(amoeba)}</span>`;

  // Show alikeness tooltip on hover (compared to highlighted creature)
  el.addEventListener('mouseenter', (e) => {
    const highlighted = getAmoeb(state.highlighted!);
    if (highlighted && amoeba.index !== state.highlighted) {
      const alikeness = getAlikeness(highlighted, amoeba);
      const tip = getTooltip();
      tip.textContent = `${alikeness.toFixed(1)}% alike`;
      tip.style.display = 'block';

      // Position tooltip near cursor
      const rect = el.getBoundingClientRect();
      tip.style.left = `${rect.right + 8}px`;
      tip.style.top = `${rect.top}px`;
    }
  });

  el.addEventListener('mouseleave', () => {
    const tip = getTooltip();
    tip.style.display = 'none';
  });

  el.addEventListener('click', () => {
    // Push current to history before navigating
    if (state.highlighted !== null && state.highlighted !== amoeba.index) {
      navHistory.push(state.highlighted);
    }
    state.highlighted = amoeba.index;
    updateFamilyDisplay(true); // Force immediate update on click
  });

  return el;
}

/**
 * Create a section with a header
 */
function createSection(title: string): HTMLElement {
  const section = document.createElement('div');
  section.className = 'family-section';

  const header = document.createElement('div');
  header.className = 'family-section-header';
  header.textContent = title;
  section.appendChild(header);

  return section;
}

/**
 * Update the family display for the currently highlighted amoeba
 * @param force - Force update even if throttle time hasn't elapsed
 */
export function updateFamilyDisplay(force: boolean = false, descendants:number | undefined = undefined): void {
  if (!familyContainer) {
    familyContainer = document.getElementById('family-tree');
  }
  if (!familyContainer) return;

  const highlightedChanged = state.highlighted !== lastHighlighted;
  const descendantsChanged = descendants !== lastDescendants

  // only proceed to render family display if was forced, or highlighted changed, or # descendants changed
  if (!force && !highlightedChanged && !descendantsChanged) {
    return; // dont rerender
    // otherwise, update ! change in number of descendants -> need rerender of fam tree
  }


  console.log("RERENDERING FAM TREE")
  lastHighlighted = state.highlighted;
  lastDescendants = descendants;


  if (state.highlighted === null) {
    familyContainer.innerHTML = '<div class="family-empty">No amoeba selected</div>';
    return;
  }

  const self = getAmoeb(state.highlighted);
  if (!self) {
    familyContainer.innerHTML = '<div class="family-empty">Amoeba not found</div>';
    return;
  }

  familyContainer.innerHTML = '';

  // Navigation bar with back button
  const navBar = document.createElement('div');
  navBar.className = 'family-nav';

  const backBtn = document.createElement('button');
  backBtn.className = 'family-back-btn';
  backBtn.innerHTML = '&larr; Back';
  backBtn.disabled = navHistory.length === 0;
  backBtn.addEventListener('click', () => {
    if (navHistory.length > 0) {
      state.highlighted = navHistory.pop()!;
      updateFamilyDisplay(true); // Force immediate update on back
    }
  });
  navBar.appendChild(backBtn);

  const historyCount = document.createElement('span');
  historyCount.className = 'family-history-count';
  historyCount.textContent = navHistory.length > 0 ? `(${navHistory.length})` : '';
  navBar.appendChild(historyCount);

  familyContainer.appendChild(navBar);

  // Parent section
  if (self.parent !== null) {
    const parent = getAmoeb(self.parent);
    if (parent) {
      const parentSection = createSection('Parent');
      parentSection.appendChild(createAmoebElement(parent, ''));
      familyContainer.appendChild(parentSection);

      // Siblings section (parent's other children)
      const siblings: Amoeba[] = [];
      for (const childIdx of parent.children) {
        if (childIdx !== self.index) {
          const sibling = getAmoeb(childIdx);
          if (sibling) {
            siblings.push(sibling);
          }
        }
      }

      if (siblings.length > 0) {
        const siblingsSection = createSection(`Siblings (${siblings.length})`);
        for (const sibling of siblings) {
          const siblingRow = document.createElement('div');
          siblingRow.className = 'family-sibling-row';

          siblingRow.appendChild(createAmoebElement(sibling, ''));

          // Sibling's children (nieces/nephews)
          if (sibling.children.length > 0) {
            const niblings = document.createElement('div');
            niblings.className = 'family-niblings';
            for (const niblingIdx of sibling.children) {
              const nibling = getAmoeb(niblingIdx);
              if (nibling) {
                niblings.appendChild(createAmoebElement(nibling, ''));
              }
            }
            siblingRow.appendChild(niblings);
          }

          siblingsSection.appendChild(siblingRow);
        }
        familyContainer.appendChild(siblingsSection);
      }
    }
  }

  // Children section
  if (self.children.length > 0) {
    const childrenSection = createSection(`Children (${self.children.length})`);
    for (const childIdx of self.children) {
      const child = getAmoeb(childIdx);
      if (child) {
        const childRow = document.createElement('div');
        childRow.className = 'family-child-row';

        childRow.appendChild(createAmoebElement(child, ''));

        // Grandchildren
        if (child.children.length > 0) {
          const grandchildren = document.createElement('div');
          grandchildren.className = 'family-grandchildren';
          for (const grandchildIdx of child.children) {
            const grandchild = getAmoeb(grandchildIdx);
            if (grandchild) {
              grandchildren.appendChild(createAmoebElement(grandchild, ''));
            }
          }
          childRow.appendChild(grandchildren);
        }

        childrenSection.appendChild(childRow);
      }
    }
    familyContainer.appendChild(childrenSection);
  }
}

/**
 * Toggle family display visibility
 */
export function toggleFamilyDisplay(): void {
  if (state.highlighted === null) return;

  const brainCanvas = document.getElementById('brain');
  const neuronWeights = document.getElementById('neuron-weights');

  if (!familyContainer) {
    familyContainer = document.getElementById('family-tree');
  }

  if (state.display === 'family') {
    state.display = 'default';
    if (familyContainer) familyContainer.style.display = 'none';
    navHistory.length = 0; // Clear history when closing
  } else {
    state.display = 'family';
    if (brainCanvas) brainCanvas.style.display = 'none';
    if (neuronWeights) neuronWeights.style.display = 'none';
    if (familyContainer) familyContainer.style.display = 'block';
    updateFamilyDisplay(true); // Force update when opening
  }
}
