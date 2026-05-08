import { GameState } from './core/gameState.js';
import { TurnManager } from './core/turnManager.js';
import { RuleEngine } from './core/ruleEngine.js';
import { ActionHandler } from './core/actionHandler.js';
import { EffectResolver } from './core/effectResolver.js';

import { DrawSystem } from './systems/drawSystem.js';
import { DamageSystem } from './systems/damageSystem.js';
import { CombatSystem } from './systems/combatSystem.js';
import { SummonSystem } from './systems/summonSystem.js';
import { KeywordSystem } from './systems/keywordSystem.js';

import { SimpleAI } from './ai/simpleAI.js';

import { GameRenderer } from './ui/renderGame.js';
import { renderLog, addLogMessage, createLogEntry } from './ui/renderLog.js';

import { shuffleDeck } from './utils/shuffle.js';
import { findAttackTargets, findValidSpellTargets } from './utils/findTarget.js';

class HearthstoneSimulator {
  constructor() {
    this.gameState = new GameState();
    this.turnManager = new TurnManager(this.gameState);
    this.ruleEngine = new RuleEngine(this.gameState);
    this.effectResolver = new EffectResolver(this.gameState);
    this.actionHandler = new ActionHandler(this.gameState, this.turnManager, this.effectResolver);
    
    this.drawSystem = new DrawSystem(this.gameState);
    this.damageSystem = new DamageSystem(this.gameState);
    this.combatSystem = new CombatSystem(this.gameState, this.damageSystem);
    this.summonSystem = new SummonSystem(this.gameState);
    this.keywordSystem = new KeywordSystem(this.gameState);
    
    this.renderer = new GameRenderer();
    this.ai = new SimpleAI(this.gameState, this.actionHandler);
    
    this.selectedCard = null;
    this.selectedMinion = null;
    this.isWaitingForTarget = false;
    this.pendingAction = null;
    
    this.initializeGame();
  }
  
  async initializeGame() {
    try {
      // Load game data
      const [heroesData, cardsData, decksData] = await Promise.all([
        fetch('data/heroes.json').then(r => r.json()),
        fetch('data/cards.json').then(r => r.json()),
        fetch('data/decks.json').then(r => r.json())
      ]);
      
      // Get heroes
      const playerHero = heroesData.heroes.find(h => h.id === 'mage');
      const opponentHero = heroesData.heroes.find(h => h.id === 'warrior');
      
      // Build decks from deck data
      const playerDeckData = decksData.decks.find(d => d.id === 'basic_mage');
      const opponentDeckData = decksData.decks.find(d => d.id === 'basic_warrior');
      
      const playerDeck = this.buildDeck(playerDeckData.cards, cardsData.cards);
      const opponentDeck = this.buildDeck(opponentDeckData.cards, cardsData.cards);
      
      // Initialize game
      this.gameState.initializeGame(playerHero, opponentHero, playerDeck, opponentDeck);
      
      // Start first turn
      this.turnManager.startTurn();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Render initial state
      this.renderer.render(this.gameState);
      
      this.renderer.addLogMessage('Game started! You go first.');
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }
  
  buildDeck(deckCards, allCards) {
    const deck = [];
    deckCards.forEach(deckCard => {
      for (let i = 0; i < deckCard.count; i++) {
        const card = allCards.find(c => c.id === deckCard.id);
        if (card) {
          deck.push({...card});
        }
      }
    });
    return shuffleDeck(deck);
  }
  
  setupEventListeners() {
    // End turn button
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', () => this.endTurn());
    }
    
    // Hero power button
    const heroPowerBtn = document.getElementById('hero-power-btn');
    if (heroPowerBtn) {
      heroPowerBtn.addEventListener('click', () => this.useHeroPower());
    }
    
    // Card clicks will be handled by the renderer
    this.renderer.onCardClick = (card) => this.onCardClick(card);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.cancelAction();
      }
    });
  }
  
  onCardClick(card) {
    if (this.gameState.turn.current !== 'player') return;
    
    if (this.isWaitingForTarget) {
      // This card is being played as a target
      this.handleTargetSelection(card);
      return;
    }
    
    // Select card to play
    this.selectedCard = card;
    this.selectedMinion = null;
    
    // Check if card can be played
    const validation = this.ruleEngine.validateAction({
      type: 'play_card',
      card: card
    });
    
    if (!validation.valid) {
      this.renderer.addLogMessage(`Cannot play ${card.name}: ${validation.reason}`);
      return;
    }
    
    // Check if card needs target
    if (card.type === 'spell' && this.requiresTarget(card)) {
      this.isWaitingForTarget = true;
      this.pendingAction = {
        type: 'play_card',
        card: card
      };
      this.highlightValidTargets(card);
      this.renderer.addLogMessage(`Select target for ${card.name}`);
    } else {
      // Play card immediately
      this.playCard(card);
    }
  }
  
  onMinionClick(minion) {
    if (this.gameState.turn.current !== 'player') return;
    
    if (this.isWaitingForTarget) {
      // This minion is being targeted
      this.handleTargetSelection(minion);
      return;
    }
    
    // Select minion for attack
    if (minion.canAttack) {
      this.selectedMinion = minion;
      this.selectedCard = null;
      
      const validTargets = this.combatSystem.getValidTargets(minion);
      this.highlightAttackTargets(validTargets);
      this.renderer.addLogMessage(`Select target for ${minion.name} to attack`);
    }
  }
  
  onHeroClick(hero) {
    if (this.gameState.turn.current !== 'player') return;
    
    if (this.isWaitingForTarget) {
      // This hero is being targeted
      this.handleTargetSelection(hero);
      return;
    }
    
    // Can't attack with hero (for now)
    this.renderer.addLogMessage('Heroes cannot attack');
  }
  
  playCard(card, target = null) {
    const result = this.actionHandler.executeAction({
      type: 'play_card',
      card: card,
      target: target
    });
    
    if (result.success) {
      this.renderer.addLogMessage(`Player plays ${card.name}`);
      this.renderer.render(this.gameState);
      
      // Check for game over
      if (this.gameState.gameOver) {
        this.renderer.showGameOver(this.gameState.winner);
      }
    } else {
      this.renderer.addLogMessage(`Failed to play ${card.name}: ${result.reason}`);
    }
    
    this.clearSelection();
  }
  
  executeAttack(attacker, defender) {
    const result = this.actionHandler.executeAction({
      type: 'attack',
      attacker: attacker,
      target: defender
    });
    
    if (result.success) {
      this.renderer.addLogMessage(`${attacker.name} attacks ${defender.name}`);
      this.renderer.render(this.gameState);
      
      // Check for game over
      if (this.gameState.gameOver) {
        this.renderer.showGameOver(this.gameState.winner);
      }
    } else {
      this.renderer.addLogMessage(`Failed to attack: ${result.reason}`);
    }
    
    this.clearSelection();
  }
  
  useHeroPower(target = null) {
    const result = this.actionHandler.executeAction({
      type: 'use_hero_power',
      target: target
    });
    
    if (result.success) {
      this.renderer.addLogMessage(`Player uses ${this.gameState.players.player.hero.heroPower.name}`);
      this.renderer.render(this.gameState);
    } else {
      this.renderer.addLogMessage(`Failed to use hero power: ${result.reason}`);
    }
    
    this.clearSelection();
  }
  
  async endTurn() {
    const result = this.actionHandler.executeAction({
      type: 'end_turn'
    });
    
    if (result.success) {
      this.renderer.addLogMessage('Player ends turn');
      this.renderer.render(this.gameState);
      
      // AI turn
      if (this.gameState.turn.current === 'opponent') {
        this.renderer.addLogMessage('Opponent starts turn');
        await this.executeAITurn();
      }
    }
    
    this.clearSelection();
  }
  
  async executeAITurn() {
    // Small delay to make AI moves visible
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const actions = this.ai.makeTurn();
    
    for (const action of actions) {
      if (action.type === 'end_turn') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = this.actionHandler.executeAction(action);
        if (result.success) {
          this.renderer.addLogMessage('Opponent ends turn');
          this.renderer.addLogMessage('Player starts turn');
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = this.actionHandler.executeAction(action);
        
        if (result.success) {
          if (action.type === 'play_card') {
            this.renderer.addLogMessage(`Opponent plays ${action.card.name}`);
          } else if (action.type === 'attack') {
            this.renderer.addLogMessage(`${action.attacker.name} attacks ${action.target.name}`);
          } else if (action.type === 'use_hero_power') {
            this.renderer.addLogMessage(`Opponent uses ${this.gameState.players.opponent.hero.heroPower.name}`);
          }
        }
      }
      
      this.renderer.render(this.gameState);
      
      // Check for game over
      if (this.gameState.gameOver) {
        this.renderer.showGameOver(this.gameState.winner);
        break;
      }
    }
  }
  
  handleTargetSelection(target) {
    if (!this.pendingAction) return;
    
    if (this.pendingAction.type === 'play_card') {
      this.playCard(this.pendingAction.card, target);
    } else if (this.pendingAction.type === 'attack') {
      this.executeAttack(this.pendingAction.attacker, target);
    } else if (this.pendingAction.type === 'use_hero_power') {
      this.useHeroPower(target);
    }
  }
  
  highlightValidTargets(card) {
    const validTargets = findValidSpellTargets(this.gameState, card, 'player');
    // Implementation would highlight these targets in UI
  }
  
  highlightAttackTargets(targets) {
    // Implementation would highlight these targets in UI
  }
  
  requiresTarget(card) {
    return card.description.toLowerCase().includes('damage') || 
           card.description.toLowerCase().includes('heal');
  }
  
  clearSelection() {
    this.selectedCard = null;
    this.selectedMinion = null;
    this.isWaitingForTarget = false;
    this.pendingAction = null;
    
    // Clear UI highlights
    document.querySelectorAll('.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });
  }
  
  cancelAction() {
    this.clearSelection();
    this.renderer.addLogMessage('Action cancelled');
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HearthstoneSimulator();
});
