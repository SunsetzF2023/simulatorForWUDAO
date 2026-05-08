import { renderHero } from './renderHero.js';
import { renderBoard } from './renderBoard.js';
import { renderCard } from './renderCard.js';
import { renderLog, addLogMessage } from './renderLog.js';

export class GameRenderer {
  constructor() {
    this.logMessages = [];
  }
  
  render(gameState) {
    this.clearGameBoard();
    
    // Render heroes
    renderHero(gameState.players.player.hero, 'player-hero');
    renderHero(gameState.players.opponent.hero, 'opponent-hero');
    
    // Render boards
    renderBoard(gameState.players.player.board, 'player-board');
    renderBoard(gameState.players.opponent.board, 'opponent-board');
    
    // Render hands
    this.renderHand(gameState.players.player.hand, 'player-hand');
    this.renderHand(gameState.players.opponent.hand, 'opponent-hand', true);
    
    // Render mana
    this.renderMana(gameState.players.player.mana, 'player-mana');
    this.renderMana(gameState.players.opponent.mana, 'opponent-mana');
    
    // Render deck counts
    this.renderDeckCount(gameState.players.player.deck.length, 'player-deck');
    this.renderDeckCount(gameState.players.opponent.deck.length, 'opponent-deck');
    
    // Render turn indicator
    this.renderTurnIndicator(gameState.turn.current);
    
    // Render game log
    renderLog(this.logMessages);
  }
  
  clearGameBoard() {
    const containers = [
      'player-hero', 'opponent-hero',
      'player-board', 'opponent-board',
      'player-hand', 'opponent-hand',
      'player-mana', 'opponent-mana',
      'player-deck', 'opponent-deck'
    ];
    
    containers.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = '';
      }
    });
  }
  
  renderHand(hand, containerId, hidden = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    hand.forEach(card => {
      if (hidden) {
        // Render card back for opponent
        const cardElement = this.createCardBack();
        container.appendChild(cardElement);
      } else {
        const cardElement = renderCard(card);
        cardElement.addEventListener('click', () => this.onCardClick(card));
        container.appendChild(cardElement);
      }
    });
  }
  
  createCardBack() {
    const cardBack = document.createElement('div');
    cardBack.className = 'card card-back';
    cardBack.innerHTML = `
      <div class="card-content">
        <div class="card-name">?</div>
        <div class="card-cost">?</div>
      </div>
    `;
    return cardBack;
  }
  
  renderMana(mana, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="mana-display">
        <span class="mana-current">${mana.current}</span>
        <span class="mana-separator">/</span>
        <span class="mana-max">${mana.max}</span>
      </div>
    `;
  }
  
  renderDeckCount(count, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="deck-count">
        <span class="deck-icon">📚</span>
        <span class="deck-number">${count}</span>
      </div>
    `;
  }
  
  renderTurnIndicator(currentTurn) {
    const indicator = document.getElementById('turn-indicator');
    if (!indicator) return;
    
    indicator.textContent = currentTurn === 'player' ? 'Your Turn' : 'Opponent Turn';
    indicator.className = `turn-indicator ${currentTurn}`;
  }
  
  onCardClick(card) {
    // This will be implemented by the main game controller
    console.log('Card clicked:', card);
  }
  
  addLogMessage(message) {
    this.logMessages.push({
      message,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 50 messages
    if (this.logMessages.length > 50) {
      this.logMessages.shift();
    }
    
    renderLog(this.logMessages);
  }
  
  showGameOver(winner) {
    const overlay = document.getElementById('game-over-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = `
      <div class="game-over-content">
        <h2>Game Over</h2>
        <p class="winner">${winner === 'player' ? 'You Win!' : 'You Lose!'}</p>
        <button onclick="location.reload()">Play Again</button>
      </div>
    `;
    overlay.style.display = 'flex';
  }
}
