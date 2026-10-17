// FamilyDisplay - Shows family tree for highlighted amoeba (main thread)
//
// Tree data comes from the worker on request; this module only renders it.

import { formatLabel, type FamilyNode, type FamilyTree } from '../sim/protocol';
import type { SimClient } from '../ui/simClient';
import { view } from '../ui/viewState';

let familyContainer: HTMLElement | null = null;
let client: SimClient | null = null;

// Navigation history stack
const navHistory: number[] = [];

let lastHighlighted: number | null = null;
let lastDescendants: number | undefined = undefined;

// Hover state for the alikeness tooltip
let tooltip: HTMLElement | null = null;
let hoverIdx: number | null = null;
let hoverEl: HTMLElement | null = null;

/**
 * Initialize the family display container
 */
export function initFamilyDisplay(simClient: SimClient): void {
  client = simClient;
  familyContainer = document.getElementById('family-tree');
}

function formatName(n: FamilyNode): string {
  return formatLabel(n.name, n.gen, n.alive, n.descendants);
}

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
function createAmoebElement(node: FamilyNode, label: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'family-member';
  if (!node.alive) el.className += ' family-member-dead';
  if (node.idx === view.highlighted) el.className += ' family-member-self';

  el.innerHTML = `<span class="family-label">${label}</span><span class="family-name">${formatName(node)}</span>`;

  // Ask the sim for alikeness vs the highlighted creature; shown when the reply arrives
  el.addEventListener('mouseenter', () => {
    if (view.highlighted !== null && node.idx !== view.highlighted && client) {
      hoverIdx = node.idx;
      hoverEl = el;
      client.requestAlikeness(view.highlighted, node.idx);
    }
  });

  el.addEventListener('mouseleave', () => {
    hoverIdx = null;
    hoverEl = null;
    getTooltip().style.display = 'none';
  });

  el.addEventListener('click', () => {
    if (!client) return;
    if (view.highlighted !== null && view.highlighted !== node.idx) {
      navHistory.push(view.highlighted);
    }
    client.highlight(node.idx); // the next frame re-renders the tree for the new selection
  });

  return el;
}

/** Worker reply to an alikeness request */
export function handleAlikenessMessage(a: number, b: number, value: number): void {
  if (hoverIdx !== b || view.highlighted !== a || !hoverEl) return;
  const tip = getTooltip();
  tip.textContent = `${value.toFixed(1)}% alike`;
  tip.style.display = 'block';
  const rect = hoverEl.getBoundingClientRect();
  tip.style.left = `${rect.right + 8}px`;
  tip.style.top = `${rect.top}px`;
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
 * Request a fresh tree when the selection or its descendant count changed
 * @param force - Request even if nothing changed
 */
export function updateFamilyDisplay(
  force: boolean,
  highlighted: number | null,
  descendants: number | undefined = undefined
): void {
  if (!familyContainer) familyContainer = document.getElementById('family-tree');
  if (!familyContainer || !client) return;

  const highlightedChanged = highlighted !== lastHighlighted;
  const descendantsChanged = descendants !== lastDescendants;
  if (!force && !highlightedChanged && !descendantsChanged) return;

  lastHighlighted = highlighted;
  lastDescendants = descendants;

  if (highlighted === null) {
    familyContainer.innerHTML = '<div class="family-empty">No amoeba selected</div>';
    return;
  }

  client.requestFamily(highlighted);
}

/** Worker reply to a family request */
export function handleFamilyMessage(idx: number, tree: FamilyTree | null): void {
  if (idx !== view.highlighted) return; // stale reply
  render(tree);
}

function render(tree: FamilyTree | null): void {
  if (!familyContainer) return;

  if (!tree) {
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
    if (navHistory.length > 0 && client) {
      client.highlight(navHistory.pop()!);
    }
  });
  navBar.appendChild(backBtn);

  const historyCount = document.createElement('span');
  historyCount.className = 'family-history-count';
  historyCount.textContent = navHistory.length > 0 ? `(${navHistory.length})` : '';
  navBar.appendChild(historyCount);

  familyContainer.appendChild(navBar);

  // Parent section
  if (tree.parent) {
    const parentSection = createSection('Parent');
    parentSection.appendChild(createAmoebElement(tree.parent, ''));
    familyContainer.appendChild(parentSection);

    // Siblings section (parent's other children)
    if (tree.siblings.length > 0) {
      const siblingsSection = createSection(`Siblings (${tree.siblings.length})`);
      for (const sibling of tree.siblings) {
        const siblingRow = document.createElement('div');
        siblingRow.className = 'family-sibling-row';
        siblingRow.appendChild(createAmoebElement(sibling, ''));

        // Sibling's children (niblings)
        if (sibling.children && sibling.children.length > 0) {
          const niblings = document.createElement('div');
          niblings.className = 'family-niblings';
          for (const nibling of sibling.children) {
            niblings.appendChild(createAmoebElement(nibling, ''));
          }
          siblingRow.appendChild(niblings);
        }

        siblingsSection.appendChild(siblingRow);
      }
      familyContainer.appendChild(siblingsSection);
    }
  }

  // Children section
  if (tree.children.length > 0) {
    const childrenSection = createSection(`Children (${tree.children.length})`);
    for (const child of tree.children) {
      const childRow = document.createElement('div');
      childRow.className = 'family-child-row';
      childRow.appendChild(createAmoebElement(child, ''));

      // Grandchildren
      if (child.children && child.children.length > 0) {
        const grandchildren = document.createElement('div');
        grandchildren.className = 'family-grandchildren';
        for (const grandchild of child.children) {
          grandchildren.appendChild(createAmoebElement(grandchild, ''));
        }
        childRow.appendChild(grandchildren);
      }

      childrenSection.appendChild(childRow);
    }
    familyContainer.appendChild(childrenSection);
  }
}

/**
 * Toggle family display visibility
 */
export function toggleFamilyDisplay(): void {
  if (view.highlighted === null || !client) return;

  const brain3d = document.getElementById('brain3d-container');
  const brainWeights = document.getElementById('brain3d-weights');
  if (!familyContainer) familyContainer = document.getElementById('family-tree');

  if (view.display === 'family') {
    view.display = 'default';
    if (familyContainer) familyContainer.style.display = 'none';
    navHistory.length = 0; // Clear history when closing
  } else {
    view.display = 'family';
    if (brain3d) brain3d.style.display = 'none';
    if (brainWeights) brainWeights.style.display = 'none';
    if (familyContainer) familyContainer.style.display = 'block';
    updateFamilyDisplay(true, view.highlighted);
  }
  client.setDisplay(view.display);
}
