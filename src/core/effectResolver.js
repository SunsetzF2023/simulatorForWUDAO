export class EffectResolver {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  resolveSpellEffect(card, target) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    switch (card.id) {
      case 'fireball':
        if (target) {
          this.dealDamage(target, 6);
        }
        break;
        
      case 'heal':
        if (target) {
          this.healTarget(target, 5);
        }
        break;
        
      default:
        // Generic spell logic based on description
        if (card.description.includes('damage')) {
          const damage = this.extractNumber(card.description, 'damage');
          if (damage && target) {
            this.dealDamage(target, damage);
          }
        }
        
        if (card.description.includes('heal') || card.description.includes('restore')) {
          const heal = this.extractNumber(card.description, 'heal') || 
                      this.extractNumber(card.description, 'restore');
          if (heal && target) {
            this.healTarget(target, heal);
          }
        }
        break;
    }
  }
  
  resolveHeroPower(action) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const hero = currentPlayer.hero;
    
    switch (hero.id) {
      case 'mage':
        if (action.target) {
          this.dealDamage(action.target, 1);
        }
        break;
        
      case 'warrior':
        hero.armor = (hero.armor || 0) + 2;
        break;
        
      default:
        break;
    }
  }
  
  dealDamage(target, amount) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Check if target is a minion
    const minionOnBoard = currentPlayer.board.find(m => m.id === target.id) ||
                         opponent.board.find(m => m.id === target.id);
    
    if (minionOnBoard) {
      minionOnBoard.currentHealth -= amount;
    } else {
      // It's a hero
      const targetPlayer = currentPlayer.hero.id === target.id ? 'player' : 'opponent';
      this.gameState.takeDamage(targetPlayer, amount);
    }
  }
  
  healTarget(target, amount) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const opponent = this.gameState.getOpponent();
    
    // Check if target is a minion
    const minionOnBoard = currentPlayer.board.find(m => m.id === target.id) ||
                         opponent.board.find(m => m.id === target.id);
    
    if (minionOnBoard) {
      minionOnBoard.currentHealth = Math.min(
        minionOnBoard.currentHealth + amount,
        minionOnBoard.health
      );
    } else {
      // It's a hero
      const targetPlayer = currentPlayer.hero.id === target.id ? 'player' : 'opponent';
      this.gameState.heal(targetPlayer, amount);
    }
  }
  
  extractNumber(text, keyword) {
    const regex = new RegExp(`(\\d+)\\s*${keyword}`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : null;
  }
}
