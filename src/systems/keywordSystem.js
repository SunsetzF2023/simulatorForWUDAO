export class KeywordSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  hasKeyword(minion, keyword) {
    return minion.keywords?.includes(keyword) || false;
  }
  
  getMinionsWithKeyword(player, keyword) {
    const playerData = this.gameState.players[player];
    return playerData.board.filter(minion => this.hasKeyword(minion, keyword));
  }
  
  getTaunts(player) {
    return this.getMinionsWithKeyword(player, 'taunt');
  }
  
  hasTaunt(player) {
    return this.getTaunts(player).length > 0;
  }
  
  getValidAttackTargets(attackerPlayer) {
    const defenderPlayer = attackerPlayer === 'player' ? 'opponent' : 'player';
    const opponent = this.gameState.players[defenderPlayer];
    const targets = [];
    
    // Check for taunts
    const taunts = this.getTaunts(defenderPlayer);
    
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
  
  validateAttack(attacker, defender) {
    const attackerPlayer = this.gameState.turn.current;
    const defenderPlayer = attackerPlayer === 'player' ? 'opponent' : 'player';
    
    // Check if defender is a valid target based on taunt rules
    const validTargets = this.getValidAttackTargets(attackerPlayer);
    const isValidTarget = validTargets.find(t => t.id === defender.id);
    
    if (!isValidTarget) {
      const taunts = this.getTaunts(defenderPlayer);
      if (taunts.length > 0 && !this.hasKeyword(defender, 'taunt')) {
        return { valid: false, reason: 'Must attack taunts first' };
      }
      return { valid: false, reason: 'Invalid target' };
    }
    
    return { valid: true };
  }
  
  applyKeywordEffects(minion) {
    // This method can be expanded to handle various keyword effects
    const effects = [];
    
    if (this.hasKeyword(minion, 'taunt')) {
      effects.push('taunt');
    }
    
    if (this.hasKeyword(minion, 'charge')) {
      minion.canAttack = true;
      minion.justSummoned = false;
      effects.push('charge');
    }
    
    if (this.hasKeyword(minion, 'divine_shield')) {
      if (!minion.divineShieldUsed) {
        effects.push('divine_shield');
      }
    }
    
    return effects;
  }
  
  removeDivineShield(minion) {
    if (this.hasKeyword(minion, 'divine_shield') && !minion.divineShieldUsed) {
      minion.divineShieldUsed = true;
      return true;
    }
    return false;
  }
  
  getKeywordDescription(keyword) {
    const descriptions = {
      'taunt': 'Taunt - Enemies must attack this minion first.',
      'charge': 'Charge - Can attack immediately.',
      'divine_shield': 'Divine Shield - Takes no damage the first time it\'s attacked.',
      'rush': 'Rush - Can attack minions immediately.',
      'windfury': 'Windfury - Can attack twice per turn.',
      'poisonous': 'Poisonous - Destroys any minion it damages.',
      'lifesteal': 'Lifesteal - Heals your hero for damage dealt.',
      'stealth': 'Stealth - Can\'t be targeted by spells or hero powers.'
    };
    
    return descriptions[keyword] || '';
  }
}
