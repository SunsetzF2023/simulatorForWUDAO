export class GameState {
  constructor() {
    this.players = {
      player: {
        hero: null,
        deck: [],
        hand: [],
        board: [],
        mana: { current: 1, max: 1 },
        fatigue: 0
      },
      opponent: {
        hero: null,
        deck: [],
        hand: [],
        board: [],
        mana: { current: 1, max: 1 },
        fatigue: 0
      }
    };
    
    this.turn = {
      current: 'player',
      number: 1
    };
    
    this.gameStarted = false;
    this.gameOver = false;
    this.winner = null;
  }
  
  initializeGame(playerHero, opponentHero, playerDeck, opponentDeck) {
    this.players.player.hero = { ...playerHero, currentHp: playerHero.hp };
    this.players.opponent.hero = { ...opponentHero, currentHp: opponentHero.hp };
    
    this.players.player.deck = this.shuffleDeck([...playerDeck]);
    this.players.opponent.deck = this.shuffleDeck([...opponentDeck]);
    
    // Draw initial hands
    for (let i = 0; i < 3; i++) {
      this.drawCard('player');
      this.drawCard('opponent');
    }
    
    // Opponent gets 4th card (coin)
    this.drawCard('opponent');
    
    this.gameStarted = true;
  }
  
  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  drawCard(player) {
    const playerData = this.players[player];
    
    if (playerData.deck.length === 0) {
      playerData.fatigue++;
      const fatigueDamage = playerData.fatigue;
      this.takeDamage(player, fatigueDamage);
      return null;
    }
    
    if (playerData.hand.length >= 10) {
      // Hand is full, card is destroyed
      playerData.deck.shift();
      return null;
    }
    
    const card = playerData.deck.shift();
    playerData.hand.push(card);
    return card;
  }
  
  takeDamage(player, damage) {
    const hero = this.players[player].hero;
    hero.currentHp -= damage;
    
    if (hero.currentHp <= 0) {
      hero.currentHp = 0;
      this.endGame(player === 'player' ? 'opponent' : 'player');
    }
  }
  
  heal(player, amount) {
    const hero = this.players[player].hero;
    const maxHp = this.players[player].hero.hp;
    hero.currentHp = Math.min(hero.currentHp + amount, maxHp);
  }
  
  endGame(winner) {
    this.gameOver = true;
    this.winner = winner;
  }
  
  getCurrentPlayer() {
    return this.players[this.turn.current];
  }
  
  getOpponent() {
    const opponent = this.turn.current === 'player' ? 'opponent' : 'player';
    return this.players[opponent];
  }
}
