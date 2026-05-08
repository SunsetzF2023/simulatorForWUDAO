export class ActionHandler {
  constructor(gameState, turnManager, effectResolver) {
    this.gameState = gameState;
    this.turnManager = turnManager;
    this.effectResolver = effectResolver;
  }
  
  executeAction(action) {
    switch (action.type) {
      case 'play_card':
        return this.playCard(action);
      case 'attack':
        return this.executeAttack(action);
      case 'use_hero_power':
        return this.useHeroPower(action);
      case 'end_turn':
        return this.endTurn();
      default:
        return { success: false, reason: 'Unknown action type' };
    }
  }
  
  playCard(action) {
    const { card, target } = action;
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Play the card (deduct mana, remove from hand)
    if (!this.turnManager.playCard(card, target)) {
      return { success: false, reason: 'Failed to play card' };
    }
    
    // Handle different card types
    if (card.type === 'minion') {
      this.summonMinion(currentPlayer, card);
    } else if (card.type === 'spell') {
      this.effectResolver.resolveSpellEffect(card, target);
    }
    
    return { success: true };
  }
  
  summonMinion(player, card) {
    const minion = {
      ...card,
      currentHealth: card.health,
      canAttack: false,
      justSummoned: true
    };
    
    player.board.push(minion);
  }
  
  executeAttack(action) {
    const { attacker, target } = action;
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Find attacker and target
    const attackerMinion = currentPlayer.board.find(m => m.id === attacker.id);
    let targetEntity;
    
    if (target.id === opponent.hero.id) {
      targetEntity = opponent.hero;
    } else {
      targetEntity = opponent.board.find(m => m.id === target.id);
    }
    
    if (!attackerMinion || !targetEntity) {
      return { success: false, reason: 'Invalid attacker or target' };
    }
    
    // Execute combat
    this.resolveCombat(attackerMinion, targetEntity);
    
    // Mark attacker as having attacked
    attackerMinion.canAttack = false;
    
    // Remove dead minions
    this.removeDeadMinions(currentPlayer);
    this.removeDeadMinions(opponent);
    
    return { success: true };
  }
  
  resolveCombat(attacker, defender) {
    // Deal damage to both
    const attackerDamage = attacker.attack;
    const defenderDamage = defender.attack || 0;
    
    if (defender.currentHealth !== undefined) {
      defender.currentHealth -= attackerDamage;
    } else {
      // It's a hero
      this.gameState.takeDamage(
        this.gameState.turn.current === 'player' ? 'opponent' : 'player',
        attackerDamage
      );
    }
    
    if (attacker.currentHealth !== undefined) {
      attacker.currentHealth -= defenderDamage;
    }
  }
  
  removeDeadMinions(player) {
    player.board = player.board.filter(minion => {
      if (minion.currentHealth <= 0) {
        // Trigger deathrattle effects here in the future
        return false;
      }
      return true;
    });
  }
  
  useHeroPower(action) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Deduct mana
    currentPlayer.mana.current -= 2;
    currentPlayer.heroPowerUsed = true;
    
    // Resolve hero power effect
    this.effectResolver.resolveHeroPower(action);
    
    return { success: true };
  }
  
  endTurn() {
    this.turnManager.endTurn();
    return { success: true };
  }
}
