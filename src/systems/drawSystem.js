export class DrawSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }
  
  drawCard(player) {
    return this.gameState.drawCard(player);
  }
  
  drawMultipleCards(player, count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const card = this.drawCard(player);
      if (card) cards.push(card);
    }
    return cards;
  }
  
  getDeckCount(player) {
    return this.gameState.players[player].deck.length;
  }
  
  getHandCount(player) {
    return this.gameState.players[player].hand.length;
  }
  
  isHandFull(player) {
    return this.gameState.players[player].hand.length >= 10;
  }
  
  isDeckEmpty(player) {
    return this.gameState.players[player].deck.length === 0;
  }
  
  getFatigueDamage(player) {
    return this.gameState.players[player].fatigue;
  }
}
