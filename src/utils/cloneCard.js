export function cloneCard(card) {
  return {
    ...card,
    id: `${card.id}_${Date.now()}_${Math.random()}`
  };
}

export function cloneMinion(minion) {
  return {
    ...minion,
    id: `${minion.cardId}_${Date.now()}_${Math.random()}`,
    currentHealth: minion.health,
    canAttack: false,
    justSummoned: true
  };
}

export function createMinionFromCard(card) {
  return {
    id: `${card.id}_${Date.now()}_${Math.random()}`,
    cardId: card.id,
    name: card.name,
    cost: card.cost,
    type: card.type,
    attack: card.attack,
    health: card.health,
    currentHealth: card.health,
    keywords: card.keywords || [],
    description: card.description,
    canAttack: false,
    justSummoned: true
  };
}

export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}
