export function renderHero(hero, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="hero" data-hero-id="${hero.id}">
      <div class="hero-portrait">
        <div class="hero-class">${hero.name}</div>
      </div>
      <div class="hero-stats">
        <div class="hero-health">
          <span class="health-icon">❤️</span>
          <span class="health-value">${hero.currentHp}/${hero.hp}</span>
        </div>
        ${hero.armor ? `
          <div class="hero-armor">
            <span class="armor-icon">🛡️</span>
            <span class="armor-value">${hero.armor}</span>
          </div>
        ` : ''}
      </div>
      <div class="hero-power">
        <div class="hero-power-cost">2</div>
        <div class="hero-power-name">${hero.heroPower.name}</div>
        <div class="hero-power-desc">${hero.heroPower.description}</div>
      </div>
    </div>
  `;
  
  // Add click handlers
  const heroElement = container.querySelector('.hero');
  heroElement.addEventListener('click', () => {
    onHeroClick(hero);
  });
  
  heroElement.addEventListener('mouseenter', (e) => {
    onHeroHover(hero, e);
  });
  
  heroElement.addEventListener('mouseleave', () => {
    hideHeroTooltip();
  });
}

export function updateHero(hero, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const healthElement = container.querySelector('.health-value');
  if (healthElement) {
    healthElement.textContent = `${hero.currentHp}/${hero.hp}`;
    
    // Add damage indicator
    if (hero.currentHp < hero.hp) {
      healthElement.classList.add('damaged');
    } else {
      healthElement.classList.remove('damaged');
    }
  }
  
  // Update armor
  const armorElement = container.querySelector('.armor-value');
  if (hero.armor && armorElement) {
    armorElement.textContent = hero.armor;
  } else if (!hero.armor && armorElement) {
    const armorContainer = container.querySelector('.hero-armor');
    if (armorContainer) {
      armorContainer.remove();
    }
  } else if (hero.armor && !armorElement) {
    const statsContainer = container.querySelector('.hero-stats');
    const armorDiv = document.createElement('div');
    armorDiv.className = 'hero-armor';
    armorDiv.innerHTML = `
      <span class="armor-icon">🛡️</span>
      <span class="armor-value">${hero.armor}</span>
    `;
    statsContainer.appendChild(armorDiv);
  }
  
  // Update hero power usage
  const heroPowerElement = container.querySelector('.hero-power');
  if (heroPowerElement) {
    if (hero.heroPowerUsed) {
      heroPowerElement.classList.add('used');
    } else {
      heroPowerElement.classList.remove('used');
    }
  }
}

export function highlightHero(containerId, highlightType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const heroElement = container.querySelector('.hero');
  if (heroElement) {
    heroElement.classList.add(`highlight-${highlightType}`);
  }
}

export function removeHeroHighlight(containerId, highlightType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const heroElement = container.querySelector('.hero');
  if (heroElement) {
    heroElement.classList.remove(`highlight-${highlightType}`);
  }
}

export function showHeroTooltip(hero, x, y) {
  // Remove existing tooltip
  const existingTooltip = document.getElementById('hero-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  const tooltip = document.createElement('div');
  tooltip.id = 'hero-tooltip';
  tooltip.className = 'hero-tooltip';
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  
  tooltip.innerHTML = `
    <div class="tooltip-content">
      <div class="tooltip-name">${hero.name}</div>
      <div class="tooltip-stats">
        <div class="tooltip-health">Health: ${hero.currentHp}/${hero.hp}</div>
        ${hero.armor ? `<div class="tooltip-armor">Armor: ${hero.armor}</div>` : ''}
      </div>
      <div class="tooltip-hero-power">
        <div class="hero-power-name">${hero.heroPower.name}</div>
        <div class="hero-power-cost">Cost: 2 mana</div>
        <div class="hero-power-desc">${hero.heroPower.description}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(tooltip);
}

export function hideHeroTooltip() {
  const tooltip = document.getElementById('hero-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Event handlers (to be implemented by main game controller)
function onHeroClick(hero) {
  console.log('Hero clicked:', hero);
}

function onHeroHover(hero, event) {
  showHeroTooltip(hero, event.clientX, event.clientY);
}
