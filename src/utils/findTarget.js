export function findMinionById(board, minionId) {
  return board.find(minion => minion.id === minionId);
}

export function findMinionByCardId(board, cardId) {
  return board.find(minion => minion.cardId === cardId);
}

export function findTaunts(board) {
  return board.filter(minion => minion.keywords?.includes('taunt'));
}

export function findAttackTargets(gameState, attackerPlayer) {
  const defenderPlayer = attackerPlayer === 'player' ? 'opponent' : 'player';
  const opponent = gameState.players[defenderPlayer];
  const targets = [];
  
  // Check for taunts
  const taunts = findTaunts(opponent.board);
  
  if (taunts.length > 0) {
    // Must attack taunts first
    targets.push(...taunts);
  } else {
    // Can attack any minion or hero
    targets.push(...opponent.board);
    targets.push(opponent.hero);
  }
  
  return targets;
}

export function findValidSpellTargets(gameState, card, currentPlayer) {
  const targets = [];
  const player = gameState.players[currentPlayer];
  const opponent = currentPlayer === 'player' ? gameState.players.opponent : gameState.players.player;
  
  // Based on card description, determine valid targets
  if (card.description.includes('damage')) {
    // Damage spells can target enemies
    targets.push(...opponent.board);
    targets.push(opponent.hero);
  }
  
  if (card.description.includes('heal') || card.description.includes('restore')) {
    // Heal spells can target friendly characters
    targets.push(...player.board);
    targets.push(player.hero);
  }
  
  return targets;
}

export function findCharacterById(gameState, characterId, player = null) {
  if (player) {
    const playerData = gameState.players[player];
    
    // Check minions
    const minion = playerData.board.find(m => m.id === characterId);
    if (minion) return minion;
    
    // Check hero
    if (playerData.hero.id === characterId) {
      return playerData.hero;
    }
  } else {
    // Search both players
    for (const p of ['player', 'opponent']) {
      const result = findCharacterById(gameState, characterId, p);
      if (result) return result;
    }
  }
  
  return null;
}
