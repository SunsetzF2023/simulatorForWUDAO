export class TurnManager {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  startTurn() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    // Increase mana
    if (this.gameState.turn.number <= 10) {
      currentPlayer.mana.max = Math.min(this.gameState.turn.number, 10);
    }
    currentPlayer.mana.current = currentPlayer.mana.max;
    
    // Draw a card
    this.gameState.drawCard(this.gameState.turn.current);
    
    // Reset minion attack status
    currentPlayer.board.forEach(minion => {
      minion.canAttack = minion.type === 'minion' && !minion.justSummoned;
    });
  }
  
  endTurn() {
    // Switch turns
    this.gameState.turn.current = this.gameState.turn.current === 'player' ? 'opponent' : 'player';
    
    if (this.gameState.turn.current === 'player') {
      this.gameState.turn.number++;
    }
    
    // Start next turn
    this.startTurn();
  }
  
  canPlayCard(card) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    return currentPlayer.mana.current >= card.cost;
  }
  
  playCard(card, target = null) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    
    if (!this.canPlayCard(card)) {
      return false;
    }
    
    // Deduct mana
    currentPlayer.mana.current -= card.cost;
    
    // Remove card from hand
    const cardIndex = currentPlayer.hand.findIndex(c => c.id === card.id);
    if (cardIndex === -1) return false;
    
    currentPlayer.hand.splice(cardIndex, 1);
    
    return true;
  }
}
