export class SimpleAI {
  constructor(gameState, actionHandler) {
    this.gameState = gameState;
    this.actionHandler = actionHandler;
  }
  
  makeTurn() {
    const actions = [];
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Play cards
    const playActions = this.evaluatePlayableCards();
    actions.push(...playActions);
    
    // Attack with minions
    const attackActions = this.evaluateAttacks();
    actions.push(...attackActions);
    
    // Use hero power
    const heroPowerAction = this.evaluateHeroPower();
    if (heroPowerAction) {
      actions.push(heroPowerAction);
    }
    
    // End turn
    actions.push({ type: 'end_turn' });
    
    return actions;
  }
  
  evaluatePlayableCards() {
    const actions = [];
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Sort cards by cost (play cheaper cards first)
    const sortedHand = [...currentPlayer.hand].sort((a, b) => a.cost - b.cost);
    
    for (const card of sortedHand) {
      if (currentPlayer.mana.current >= card.cost) {
        if (card.type === 'minion') {
          // Play minion if board has space
          if (currentPlayer.board.length < 7) {
            actions.push({
              type: 'play_card',
              card: card,
              target: null
            });
            // Update mana after playing
            currentPlayer.mana.current -= card.cost;
          }
        } else if (card.type === 'spell') {
          // Find target for spell
          const target = this.findSpellTarget(card);
          if (target) {
            actions.push({
              type: 'play_card',
              card: card,
              target: target
            });
            // Update mana after playing
            currentPlayer.mana.current -= card.cost;
          }
        }
      }
    }
    
    return actions;
  }
  
  evaluateAttacks() {
    const actions = [];
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Attack with each minion that can attack
    for (const minion of currentPlayer.board) {
      if (minion.canAttack && minion.attack > 0) {
        const target = this.findAttackTarget(minion);
        if (target) {
          actions.push({
            type: 'attack',
            attacker: minion,
            target: target
          });
        }
      }
    }
    
    return actions;
  }
  
  evaluateHeroPower() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    if (currentPlayer.mana.current >= 2 && !currentPlayer.heroPowerUsed) {
      const target = this.findHeroPowerTarget();
      if (target) {
        return {
          type: 'use_hero_power',
          target: target
        };
      }
    }
    
    return null;
  }
  
  findSpellTarget(card) {
    const opponent = this.gameState.getOpponent();
    
    if (card.id === 'fireball') {
      // Target the most threatening enemy (highest attack)
      const threats = [...opponent.board].sort((a, b) => b.attack - a.attack);
      if (threats.length > 0) {
        return threats[0];
      }
      // Or target the hero if no minions
      return opponent.hero;
    }
    
    if (card.id === 'heal') {
      // Heal the most damaged friendly character
      const currentPlayer = this.gameState.getCurrentPlayer();
      const damagedMinions = currentPlayer.board.filter(m => m.currentHealth < m.health);
      
      if (damagedMinions.length > 0) {
        // Heal the minion with lowest health
        return damagedMinions.sort((a, b) => a.currentHealth - b.currentHealth)[0];
      }
      
      // Or heal hero if damaged
      if (currentPlayer.hero.currentHp < currentPlayer.hero.hp) {
        return currentPlayer.hero;
      }
    }
    
    return null;
  }
  
  findAttackTarget(attacker) {
    const opponent = this.gameState.getOpponent();
    
    // Check for taunts first
    const taunts = opponent.board.filter(m => m.keywords?.includes('taunt'));
    
    if (taunts.length > 0) {
      // Attack the taunt with lowest health
      return taunts.sort((a, b) => a.currentHealth - b.currentHealth)[0];
    }
    
    // Priority: Trade favorably, then go face
    for (const minion of opponent.board) {
      if (attacker.attack >= minion.currentHealth) {
        // Can destroy this minion
        return minion;
      }
    }
    
    // Attack hero if no favorable trades
    return opponent.hero;
  }
  
  findHeroPowerTarget() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    switch (currentPlayer.hero.id) {
      case 'mage':
        // Fireblast: target any enemy
        const targets = [...opponent.board, opponent.hero];
        // Target the most threatening
        return targets.sort((a, b) => (b.attack || 0) - (a.attack || 0))[0];
        
      case 'warrior':
        // Armor Up: no target needed
        return null;
        
      default:
        return null;
    }
  }
}
