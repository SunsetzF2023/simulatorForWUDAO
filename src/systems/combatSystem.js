export class CombatSystem {
  constructor(gameState, damageSystem) {
    this.gameState = gameState;
    this.damageSystem = damageSystem;
  }
  
  canAttack(attacker) {
    // Check if attacker can attack
    if (!attacker.canAttack) {
      return { canAttack: false, reason: 'Cannot attack this turn' };
    }
    
    if (attacker.attack <= 0) {
      return { canAttack: false, reason: 'No attack power' };
    }
    
    return { canAttack: true };
  }
  
  getValidTargets(attacker) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    const targets = [];
    
    // Check if attacker belongs to current player
    const attackerOnBoard = currentPlayer.board.find(m => m.id === attacker.id);
    if (!attackerOnBoard) {
      return [];
    }
    
    // Get attackable targets based on taunt rules
    const taunts = opponent.board.filter(m => 
      m.keywords?.includes('taunt') && m.currentHealth > 0
    );
    
    if (taunts.length > 0) {
      // Must attack taunts first
      targets.push(...taunts);
    } else {
      // Can attack any minion or hero
      opponent.board.forEach(minion => {
        if (minion.currentHealth > 0) {
          targets.push(minion);
        }
      });
      targets.push(opponent.hero);
    }
    
    return targets;
  }
  
  executeCombat(attacker, defender) {
    const combatResult = {
      attacker: { id: attacker.id, damage: 0, survived: true },
      defender: { id: defender.id, damage: 0, survived: true },
      success: false
    };
    
    // Validate attacker can attack
    const canAttackResult = this.canAttack(attacker);
    if (!canAttackResult.canAttack) {
      combatResult.reason = canAttackResult.reason;
      return combatResult;
    }
    
    // Validate target is valid
    const validTargets = this.getValidTargets(attacker);
    const isValidTarget = validTargets.find(t => t.id === defender.id);
    if (!isValidTarget) {
      combatResult.reason = 'Invalid target';
      return combatResult;
    }
    
    // Calculate damage
    const attackerDamage = attacker.attack;
    const defenderDamage = defender.attack || 0;
    
    // Apply damage to defender
    if (defender.currentHealth !== undefined) {
      // It's a minion
      defender.currentHealth -= attackerDamage;
      combatResult.defender.damage = attackerDamage;
      combatResult.defender.survived = defender.currentHealth > 0;
    } else {
      // It's a hero
      const defenderPlayer = this.gameState.turn.current === 'player' ? 'opponent' : 'player';
      this.gameState.takeDamage(defenderPlayer, attackerDamage);
      combatResult.defender.damage = attackerDamage;
      combatResult.defender.survived = this.gameState.players[defenderPlayer].hero.currentHp > 0;
    }
    
    // Apply damage to attacker (if defender can fight back)
    if (defenderDamage > 0 && attacker.currentHealth !== undefined) {
      attacker.currentHealth -= defenderDamage;
      combatResult.attacker.damage = defenderDamage;
      combatResult.attacker.survived = attacker.currentHealth > 0;
    }
    
    // Mark attacker as having attacked
    attacker.canAttack = false;
    
    combatResult.success = true;
    return combatResult;
  }
  
  removeDeadMinions() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Remove dead minions from both sides
    currentPlayer.board = currentPlayer.board.filter(minion => {
      if (minion.currentHealth <= 0) {
        // Trigger death effects here in the future
        return false;
      }
      return true;
    });
    
    opponent.board = opponent.board.filter(minion => {
      if (minion.currentHealth <= 0) {
        // Trigger death effects here in the future
        return false;
      }
      return true;
    });
  }
}
