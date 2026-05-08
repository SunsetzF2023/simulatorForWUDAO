// Safe version of main.js with error handling
console.log('🚀 Loading Hearthstone Simulator...');

class HearthstoneSimulator {
  constructor() {
    console.log('📦 Creating simulator instance...');
    this.gameState = null;
    this.renderer = null;
    this.init();
  }

  async init() {
    try {
      console.log('🔧 Loading modules...');
      
      // Load modules dynamically with error handling
      const modules = await this.loadModules();
      
      console.log('✅ All modules loaded successfully');
      
      // Initialize game
      this.gameState = new modules.GameState();
      const turnManager = new modules.TurnManager(this.gameState);
      const ruleEngine = new modules.RuleEngine(this.gameState);
      const effectResolver = new modules.EffectResolver(this.gameState);
      const actionHandler = new modules.ActionHandler(this.gameState, turnManager, effectResolver);
      
      this.renderer = new modules.GameRenderer();
      
      console.log('🎮 Initializing game...');
      await this.initializeGame(modules);
      
      console.log('🎯 Game ready!');
      
    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      this.showError(error.message);
    }
  }

  async loadModules() {
    const moduleImports = {
      GameState: () => import('./core/gameState.js'),
      TurnManager: () => import('./core/turnManager.js'),
      RuleEngine: () => import('./core/ruleEngine.js'),
      ActionHandler: () => import('./core/actionHandler.js'),
      EffectResolver: () => import('./core/effectResolver.js'),
      DrawSystem: () => import('./systems/drawSystem.js'),
      DamageSystem: () => import('./systems/damageSystem.js'),
      CombatSystem: () => import('./systems/combatSystem.js'),
      SummonSystem: () => import('./systems/summonSystem.js'),
      KeywordSystem: () => import('./systems/keywordSystem.js'),
      SimpleAI: () => import('./ai/simpleAI.js'),
      GameRenderer: () => import('./ui/renderGame.js'),
      renderLog: () => import('./ui/renderLog.js'),
      shuffleDeck: () => import('./utils/shuffle.js'),
      findTarget: () => import('./utils/findTarget.js')
    };

    const modules = {};
    
    for (const [name, importFn] of Object.entries(moduleImports)) {
      try {
        console.log(`📦 Loading ${name}...`);
        const module = await importFn();
        modules[name] = module[name] || module.default;
        console.log(`✅ ${name} loaded`);
      } catch (error) {
        console.error(`❌ Failed to load ${name}:`, error);
        throw new Error(`Module ${name} failed to load: ${error.message}`);
      }
    }
    
    return modules;
  }

  async initializeGame(modules) {
    try {
      console.log('📊 Loading game data...');
      
      // Load game data
      const [heroesData, cardsData, decksData] = await Promise.all([
        fetch('data/heroes.json').then(r => {
          if (!r.ok) throw new Error('Failed to load heroes.json');
          return r.json();
        }),
        fetch('data/cards.json').then(r => {
          if (!r.ok) throw new Error('Failed to load cards.json');
          return r.json();
        }),
        fetch('data/decks.json').then(r => {
          if (!r.ok) throw new Error('Failed to load decks.json');
          return r.json();
        })
      ]);
      
      console.log('✅ Game data loaded');
      
      // Get heroes
      const playerHero = heroesData.heroes.find(h => h.id === 'mage');
      const opponentHero = heroesData.heroes.find(h => h.id === 'warrior');
      
      if (!playerHero || !opponentHero) {
        throw new Error('Heroes not found in data');
      }
      
      // Build decks
      const playerDeckData = decksData.decks.find(d => d.id === 'basic_mage');
      const opponentDeckData = decksData.decks.find(d => d.id === 'basic_warrior');
      
      if (!playerDeckData || !opponentDeckData) {
        throw new Error('Decks not found in data');
      }
      
      const playerDeck = this.buildDeck(playerDeckData.cards, cardsData.cards, modules.shuffleDeck);
      const opponentDeck = this.buildDeck(opponentDeckData.cards, cardsData.cards, modules.shuffleDeck);
      
      console.log('🎯 Initializing game state...');
      
      // Initialize game
      this.gameState.initializeGame(playerHero, opponentHero, playerDeck, opponentDeck);
      
      // Start first turn
      const turnManager = new modules.TurnManager(this.gameState);
      turnManager.startTurn();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Render initial state
      this.renderer.render(this.gameState);
      
      this.renderer.addLogMessage('Game started! You go first.');
      
      console.log('🎮 Game fully initialized!');
      
    } catch (error) {
      console.error('❌ Game initialization failed:', error);
      this.showError(error.message);
    }
  }

  buildDeck(deckCards, allCards, shuffleDeck) {
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
    console.log('🎧 Setting up event listeners...');
    
    // End turn button
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', () => {
        console.log('🔄 End turn clicked');
        this.renderer.addLogMessage('Turn ended (demo)');
      });
    }
    
    // Hero power button
    const heroPowerBtn = document.getElementById('hero-power-btn');
    if (heroPowerBtn) {
      heroPowerBtn.addEventListener('click', () => {
        console.log('⚡ Hero power clicked');
        this.renderer.addLogMessage('Hero power used (demo)');
      });
    }
    
    console.log('✅ Event listeners ready');
  }

  showError(message) {
    // Remove any existing overlay
    const existingOverlay = document.querySelector('.error-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Create error overlay
    const overlay = document.createElement('div');
    overlay.className = 'error-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(220, 53, 69, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2>⚠️ Game Loading Error</h2>
        <p>${message}</p>
        <button onclick="location.reload()" style="
          padding: 10px 20px;
          background: white;
          color: #dc3545;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        ">Reload Page</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, starting game...');
  
  // Remove any loading overlay
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
  
  try {
    new HearthstoneSimulator();
  } catch (error) {
    console.error('❌ Critical error:', error);
    document.body.innerHTML += `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
      ">
        <h2>❌ Critical Error</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  }
});
