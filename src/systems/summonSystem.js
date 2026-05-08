export class SummonSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  canSummonMinion(player, card) {
    const playerData = this.gameState.players[player];
    
    // Check if board is full
    if (playerData.board.length >= 7) {
      return { canSummon: false, reason: 'Board is full' };
    }
    
    // Check if player has enough mana
    if (playerData.mana.current < card.cost) {
      return { canSummon: false, reason: 'Not enough mana' };
    }
    
    return { canSummon: true };
  }
  
  summonMinion(player, card, position = null) {
    const playerData = this.gameState.players[player];
    const canSummonResult = this.canSummonMinion(player, card);
    
    if (!canSummonResult.canSummon) {
      return { success: false, reason: canSummonResult.reason };
    }
    
    // Create minion object
    const minion = {
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
    
    // Add to board
    if (position !== null && position >= 0 && position <= playerData.board.length) {
      playerData.board.splice(position, 0, minion);
    } else {
      playerData.board.push(minion);
    }
    
    // Deduct mana
    playerData.mana.current -= card.cost;
    
    return { success: true, minion };
  }
  
  removeMinion(player, minionId) {
    const playerData = this.gameState.players[player];
    const index = playerData.board.findIndex(m => m.id === minionId);
    
    if (index === -1) {
      return { success: false, reason: 'Minion not found' };
    }
    
    const removedMinion = playerData.board[index];
    playerData.board.splice(index, 1);
    
    return { success: true, minion: removedMinion };
  }
  
  getMinion(player, minionId) {
    const playerData = this.gameState.players[player];
    return playerData.board.find(m => m.id === minionId);
  }
  
  getBoardCount(player) {
    return this.gameState.players[player].board.length;
  }
  
  isBoardFull(player) {
    return this.gameState.players[player].board.length >= 7;
  }
  
  getMinionsWithKeyword(player, keyword) {
    const playerData = this.gameState.players[player];
    return playerData.board.filter(m => m.keywords?.includes(keyword));
  }
  
  getTaunts(player) {
    return this.getMinionsWithKeyword(player, 'taunt');
  }
  
  resetAttackStatus(player) {
    const playerData = this.gameState.players[player];
    playerData.board.forEach(minion => {
      minion.canAttack = !minion.justSummoned;
      minion.justSummoned = false;
    });
  }
}
