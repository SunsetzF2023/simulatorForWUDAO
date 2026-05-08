export class RuleEngine {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  validateAction(action) {
    switch (action.type) {
      case 'play_card':
        return this.validatePlayCard(action);
      case 'attack':
        return this.validateAttack(action);
      case 'use_hero_power':
        return this.validateHeroPower(action);
      default:
        return false;
    }
  }
  
  validatePlayCard(action) {
    const { card, target } = action;
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Check if player has enough mana
    if (currentPlayer.mana.current < card.cost) {
      return { valid: false, reason: 'Not enough mana' };
    }
    
    // Check if card is in hand
    const cardInHand = currentPlayer.hand.find(c => c.id === card.id);
    if (!cardInHand) {
      return { valid: false, reason: 'Card not in hand' };
    }
    
    // Check board limits for minions
    if (card.type === 'minion' && currentPlayer.board.length >= 7) {
      return { valid: false, reason: 'Board is full' };
    }
    
    // Validate spell targets
    if (card.type === 'spell' && this.requiresTarget(card) && !target) {
      return { valid: false, reason: 'Spell requires target' };
    }
    
    return { valid: true };
  }
  
  validateAttack(action) {
    const { attacker, target } = action;
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Check if attacker belongs to current player
    const attackerOnBoard = currentPlayer.board.find(m => m.id === attacker.id);
    if (!attackerOnBoard) {
      return { valid: false, reason: 'Attacker not on board' };
    }
    
    // Check if attacker can attack
    if (!attacker.canAttack) {
      return { valid: false, reason: 'Attacker cannot attack this turn' };
    }
    
    // Check if target is valid
    const targetIsValid = opponent.board.find(m => m.id === target.id) || 
                         (target.id === opponent.hero.id);
    
    if (!targetIsValid) {
      return { valid: false, reason: 'Invalid target' };
    }
    
    // Check taunt rules
    if (target.id === opponent.hero.id) {
      const taunts = opponent.board.filter(m => m.keywords?.includes('taunt'));
      if (taunts.length > 0) {
        return { valid: false, reason: 'Must attack taunts first' };
      }
    }
    
    return { valid: true };
  }
  
  validateHeroPower(action) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    if (currentPlayer.mana.current < 2) {
      return { valid: false, reason: 'Not enough mana for hero power' };
    }
    
    if (currentPlayer.heroPowerUsed) {
      return { valid: false, reason: 'Hero power already used this turn' };
    }
    
    return { valid: true };
  }
  
  requiresTarget(card) {
    // Simple logic for now - can be expanded
    return card.description.toLowerCase().includes('damage') || 
           card.description.toLowerCase().includes('heal');
  }
}
