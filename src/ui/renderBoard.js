import { renderMinion, updateMinionDisplay } from './renderCard.js';

export function renderBoard(board, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  board.forEach(minion => {
    const minionElement = renderMinion(minion);
    
    // Add click handlers
    minionElement.addEventListener('click', () => {
      onMinionClick(minion);
    });
    
    minionElement.addEventListener('mouseenter', (e) => {
      onMinionHover(minion, e);
    });
    
    minionElement.addEventListener('mouseleave', () => {
      hideMinionTooltip();
    });
    
    container.appendChild(minionElement);
  });
}

export function updateBoard(board, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Update existing minions
  const existingMinions = container.querySelectorAll('.minion');
  
  board.forEach(minion => {
    const existingElement = container.querySelector(`[data-minion-id="${minion.id}"]`);
    
    if (existingElement) {
      // Update existing minion
      updateMinionDisplay(existingElement, minion);
    } else {
      // Add new minion
      const minionElement = renderMinion(minion);
      minionElement.addEventListener('click', () => {
        onMinionClick(minion);
      });
      container.appendChild(minionElement);
    }
  });
  
  // Remove dead minions
  existingMinions.forEach(element => {
    const minionId = element.dataset.minionId;
    const stillExists = board.find(m => m.id === minionId);
    
    if (!stillExists) {
      element.classList.add('dead');
      setTimeout(() => {
        element.remove();
      }, 500);
    }
  });
}

export function highlightAttackTargets(attacker, validTargets) {
  // Remove existing highlights
  document.querySelectorAll('.attack-target').forEach(el => {
    el.classList.remove('attack-target');
  });
  
  // Highlight valid targets
  validTargets.forEach(target => {
    const element = document.querySelector(`[data-minion-id="${target.id}"]`) ||
                    document.querySelector(`[data-hero-id="${target.id}"]`);
    
    if (element) {
      element.classList.add('attack-target');
    }
  });
}

export function highlightValidTargets(card, validTargets) {
  // Remove existing highlights
  document.querySelectorAll('.spell-target').forEach(el => {
    el.classList.remove('spell-target');
  });
  
  // Highlight valid targets
  validTargets.forEach(target => {
    const element = document.querySelector(`[data-minion-id="${target.id}"]`) ||
                    document.querySelector(`[data-hero-id="${target.id}"]`);
    
    if (element) {
      element.classList.add('spell-target');
    }
  });
}

export function clearHighlights() {
  document.querySelectorAll('.attack-target, .spell-target').forEach(el => {
    el.classList.remove('attack-target', 'spell-target');
  });
}

export function showAttackArrow(attacker, defender) {
  // Remove existing arrow
  const existingArrow = document.getElementById('attack-arrow');
  if (existingArrow) {
    existingArrow.remove();
  }
  
  const attackerElement = document.querySelector(`[data-minion-id="${attacker.id}"]`);
  const defenderElement = document.querySelector(`[data-minion-id="${defender.id}"]`) ||
                          document.querySelector(`[data-hero-id="${defender.id}"]`);
  
  if (!attackerElement || !defenderElement) return;
  
  const attackerRect = attackerElement.getBoundingClientRect();
  const defenderRect = defenderElement.getBoundingClientRect();
  
  const arrow = document.createElement('div');
  arrow.id = 'attack-arrow';
  arrow.className = 'attack-arrow';
  
  // Calculate arrow position and angle
  const startX = attackerRect.left + attackerRect.width / 2;
  const startY = attackerRect.top + attackerRect.height / 2;
  const endX = defenderRect.left + defenderRect.width / 2;
  const endY = defenderRect.top + defenderRect.height / 2;
  
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  
  arrow.style.left = `${startX}px`;
  arrow.style.top = `${startY}px`;
  arrow.style.width = `${distance}px`;
  arrow.style.transform = `rotate(${angle}deg)`;
  
  document.body.appendChild(arrow);
  
  // Remove arrow after animation
  setTimeout(() => {
    arrow.remove();
  }, 1000);
}

export function hideAttackArrow() {
  const arrow = document.getElementById('attack-arrow');
  if (arrow) {
    arrow.remove();
  }
}

// Event handlers (to be implemented by main game controller)
function onMinionClick(minion) {
  console.log('Minion clicked:', minion);
}

function onMinionHover(minion, event) {
  showMinionTooltip(minion, event.clientX, event.clientY);
}

function showMinionTooltip(minion, x, y) {
  // Remove existing tooltip
  const existingTooltip = document.getElementById('minion-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  const tooltip = document.createElement('div');
  tooltip.id = 'minion-tooltip';
  tooltip.className = 'minion-tooltip';
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  
  const keywords = minion.keywords ? minion.keywords.map(k => `<span class="keyword">${k}</span>`).join(' ') : '';
  
  tooltip.innerHTML = `
    <div class="tooltip-content">
      <div class="tooltip-name">${minion.name}</div>
      <div class="tooltip-stats">
        <div class="tooltip-attack">${minion.attack}</div>
        <div class="tooltip-health">${minion.currentHealth}/${minion.health}</div>
      </div>
      ${keywords ? `<div class="tooltip-keywords">${keywords}</div>` : ''}
      <div class="tooltip-description">
        <p>${minion.description}</p>
      </div>
      ${!minion.canAttack ? '<div class="status">Cannot attack this turn</div>' : ''}
      ${minion.justSummoned ? '<div class="status">Summoning sickness</div>' : ''}
    </div>
  `;
  
  document.body.appendChild(tooltip);
}

function hideMinionTooltip() {
  const tooltip = document.getElementById('minion-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}
