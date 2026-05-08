export function renderCard(card) {
  const cardElement = document.createElement('div');
  cardElement.className = `card ${card.type}`;
  cardElement.dataset.cardId = card.id;
  
  const keywords = card.keywords ? card.keywords.map(k => `<span class="keyword">${k}</span>`).join(' ') : '';
  
  cardElement.innerHTML = `
    <div class="card-content">
      <div class="card-header">
        <div class="card-cost">${card.cost}</div>
        <div class="card-name">${card.name}</div>
      </div>
      ${card.type === 'minion' ? `
        <div class="card-stats">
          <div class="card-attack">${card.attack}</div>
          <div class="card-health">${card.health}</div>
        </div>
      ` : ''}
      <div class="card-description">
        ${keywords}
        <p>${card.description}</p>
      </div>
    </div>
  `;
  
  return cardElement;
}

export function renderMinion(minion) {
  const minionElement = document.createElement('div');
  minionElement.className = `minion ${minion.canAttack ? 'can-attack' : ''}`;
  minionElement.dataset.minionId = minion.id;
  
  const keywords = minion.keywords ? minion.keywords.map(k => `<span class="keyword">${k}</span>`).join(' ') : '';
  
  minionElement.innerHTML = `
    <div class="minion-content">
      <div class="minion-name">${minion.name}</div>
      <div class="minion-stats">
        <div class="minion-attack">${minion.attack}</div>
        <div class="minion-health">${minion.currentHealth}</div>
      </div>
      ${keywords ? `<div class="minion-keywords">${keywords}</div>` : ''}
      ${minion.justSummoned ? '<div class="summoning-sickness">⚡</div>' : ''}
    </div>
  `;
  
  return minionElement;
}

export function updateMinionDisplay(minionElement, minion) {
  // Update health
  const healthElement = minionElement.querySelector('.minion-health');
  if (healthElement) {
    healthElement.textContent = minion.currentHealth;
    
    // Add damage indicator
    if (minion.currentHealth < minion.health) {
      healthElement.classList.add('damaged');
    } else {
      healthElement.classList.remove('damaged');
    }
  }
  
  // Update attack status
  if (minion.canAttack) {
    minionElement.classList.add('can-attack');
  } else {
    minionElement.classList.remove('can-attack');
  }
  
  // Update summoning sickness
  if (minion.justSummoned) {
    minionElement.classList.add('summoning-sickness');
  } else {
    minionElement.classList.remove('summoning-sickness');
  }
  
  // Remove dead minions
  if (minion.currentHealth <= 0) {
    minionElement.classList.add('dead');
    setTimeout(() => {
      minionElement.remove();
    }, 500);
  }
}

export function createCardHighlight(cardElement, highlightType) {
  cardElement.classList.add(`highlight-${highlightType}`);
}

export function removeCardHighlight(cardElement, highlightType) {
  cardElement.classList.remove(`highlight-${highlightType}`);
}

export function showCardTooltip(card, x, y) {
  // Remove existing tooltip
  const existingTooltip = document.getElementById('card-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  const tooltip = document.createElement('div');
  tooltip.id = 'card-tooltip';
  tooltip.className = 'card-tooltip';
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  
  const keywords = card.keywords ? card.keywords.map(k => `<span class="keyword">${k}</span>`).join(' ') : '';
  
  tooltip.innerHTML = `
    <div class="tooltip-content">
      <div class="tooltip-header">
        <div class="tooltip-cost">${card.cost}</div>
        <div class="tooltip-name">${card.name}</div>
      </div>
      ${card.type === 'minion' ? `
        <div class="tooltip-stats">
          <div class="tooltip-attack">${card.attack}</div>
          <div class="tooltip-health">${card.health}</div>
        </div>
      ` : ''}
      <div class="tooltip-description">
        ${keywords}
        <p>${card.description}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(tooltip);
}

export function hideCardTooltip() {
  const tooltip = document.getElementById('card-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}
