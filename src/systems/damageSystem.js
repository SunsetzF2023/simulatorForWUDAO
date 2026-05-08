export class DamageSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  dealDamage(target, amount, source = null) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Find the target
    let targetEntity = null;
    let targetPlayer = null;
    
    // Check player's board
    const playerMinion = currentPlayer.board.find(m => m.id === target.id);
    if (playerMinion) {
      targetEntity = playerMinion;
      targetPlayer = 'player';
    }
    
    // Check opponent's board
    const opponentMinion = opponent.board.find(m => m.id === target.id);
    if (opponentMinion) {
      targetEntity = opponentMinion;
      targetPlayer = 'opponent';
    }
    
    // Check heroes
    if (currentPlayer.hero.id === target.id) {
      targetEntity = currentPlayer.hero;
      targetPlayer = 'player';
    } else if (opponent.hero.id === target.id) {
      targetEntity = opponent.hero;
      targetPlayer = 'opponent';
    }
    
    if (!targetEntity) {
      return { success: false, reason: 'Target not found' };
    }
    
    // Apply damage
    if (targetEntity.currentHealth !== undefined) {
      // It's a minion
      targetEntity.currentHealth -= amount;
      
      // Check if minion died
      if (targetEntity.currentHealth <= 0) {
        this.removeMinion(targetPlayer, targetEntity);
      }
    } else {
      // It's a hero
      this.gameState.takeDamage(targetPlayer, amount);
    }
    
    return { success: true, damage: amount };
  }
  
  removeMinion(player, minion) {
    const playerData = this.gameState.players[player];
    const index = playerData.board.findIndex(m => m.id === minion.id);
    if (index !== -1) {
      playerData.board.splice(index, 1);
    }
  }
  
  heal(target, amount) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Find the target
    let targetEntity = null;
    let targetPlayer = null;
    
    // Check player's board
    const playerMinion = currentPlayer.board.find(m => m.id === target.id);
    if (playerMinion) {
      targetEntity = playerMinion;
      targetPlayer = 'player';
    }
    
    // Check opponent's board
    const opponentMinion = opponent.board.find(m => m.id === target.id);
    if (opponentMinion) {
      targetEntity = opponentMinion;
      targetPlayer = 'opponent';
    }
    
    // Check heroes
    if (currentPlayer.hero.id === target.id) {
      targetEntity = currentPlayer.hero;
      targetPlayer = 'player';
    } else if (opponent.hero.id === target.id) {
      targetEntity = opponent.hero;
      targetPlayer = 'opponent';
    }
    
    if (!targetEntity) {
      return { success: false, reason: 'Target not found' };
    }
    
    // Apply healing
    if (targetEntity.currentHealth !== undefined) {
      // It's a minion
      const maxHealth = targetEntity.health;
      targetEntity.currentHealth = Math.min(targetEntity.currentHealth + amount, maxHealth);
    } else {
      // It's a hero
      this.gameState.heal(targetPlayer, amount);
    }
    
    return { success: true, healing: amount };
  }
  
  getAttackTargets() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    const targets = [];
    
    // Check for taunts
    const taunts = opponent.board.filter(m => m.keywords?.includes('taunt'));
    
    if (taunts.length > 0) {
      // Can only attack taunts
      targets.push(...taunts);
    } else {
      // Can attack any minion or hero
      targets.push(...opponent.board);
      targets.push(opponent.hero);
    }
    
    return targets;
  }
}
