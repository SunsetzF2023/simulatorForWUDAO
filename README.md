# Office War - Corporate CCG

A modern web-based Collectible Card Game (CCG) inspired by Hearthstone mechanics, themed around corporate office life and workplace dynamics.

## 🎮 Play Online

**GitHub Pages Live Demo:** [https://sunsetzf2023.github.io/simulatorForWUDAO/](https://sunsetzf2023.github.io/simulatorForWUDAO/)

Click the link above to play the game directly in your browser!

## 📖 About the Game

Office War is a strategic card game where players deploy corporate employees as minions to battle against opponents. The game features a unique corporate theme with mechanics like "Salary" (mana), "Resignation" (death), and various workplace-themed keywords.

### 🎯 Core Features

- **Turn-Based Combat**: Strategic gameplay with draw, play, attack, and end phases
- **Salary System**: Resource system starting at 1, increasing by 1 each turn (max 10)
- **7 Rarity Tiers**: Common, Uncommon, Rare, SuperRare, Epic, Mythic, Legendary
- **Faction System**: Different corporate departments (Admin, Ops, IT, Sales, etc.)
- **Keyword Mechanics**: Complex abilities like Battlecry, Deathrattle, Taunt, Poison, etc.
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean interface with animations and visual feedback

## 🏗️ Architecture

The project follows a modular ES6 architecture:

```
simulatorWUDAO/
├── data/
│   └── cards.json           # Card database with all card definitions
├── src/
│   ├── engine.js           # Core game engine and state management
│   ├── entities.js         # Card classes and factory patterns
│   ├── mechanics.js        # Game mechanics and keyword handlers
│   ├── ui.js             # UI rendering and DOM manipulation
│   └── main.js           # Entry point and module coordination
├── index.html             # Main HTML structure
├── style.css              # Complete styling and animations
└── backup/               # Previous project backup
```

### 🧩 Module Breakdown

- **engine.js**: Game loop, turn management, state control
- **entities.js**: Card, Hero classes, and CardFactory for data management
- **mechanics.js**: Keyword processing and special effect handling
- **ui.js**: DOM rendering, event handling, and user interactions
- **main.js**: Game initialization and module orchestration

## 🎮 How to Play

### Basic Rules
1. **Start**: Each player begins with 30 Health (Cash Flow) and 3 cards
2. **Salary**: Gain 1 Salary per turn (max 10) to play cards
3. **Deploy**: Play cards from hand by paying their Salary cost
4. **Attack**: Use minions to attack enemy minions or heroes
5. **Win**: Reduce opponent's Health to 0

### Card Types
- **Minions**: Units with Attack and Health that can attack
- **Heroes**: Players' main characters with 30 Health

### Keywords System
- **Battlecry**: Effect when played from hand
- **SeverancePay**: Positive effect on resignation (death)
- **LegacyBug**: Negative deathrattle effect
- **EmergencySupport**: Can attack immediately (Rush)
- **Scapegoat**: Must be attacked first (Taunt)
- **ShiftingBlame**: Redirect damage to allies
- **Overtime**: Costs 1 less Salary
- **Lethargic**: Sleeps first turn but gains Immunity
- **PerformanceReview**: +2/+2 when damaged
- **Slacking**: Cannot be targeted until attacks (Stealth)
- **WorkplacePUA**: Destroys lower rarity targets (Poison)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript ES6+**: Modular architecture with import/export
- **JSON**: Card data storage and management
- **GitHub Pages**: Static hosting and deployment

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/SunsetzF2023/simulatorForWUDAO.git
   ```

2. Navigate to the project directory:
   ```bash
   cd simulatorWUDAO
   ```

3. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## 📱 Mobile Compatibility

- **Responsive Design**: Adapts to all screen sizes
- **Touch Controls**: Optimized for mobile interactions
- **Performance**: Lightweight and fast on mobile devices
- **Cross-Browser**: Compatible with all modern browsers

## 🎨 Design Features

- **Modern UI**: Clean, professional interface
- **Smooth Animations**: Card play, attack, and damage effects
- **Color Coding**: Rarity-based visual hierarchy
- **Interactive Feedback**: Hover states and visual indicators
- **Dark Theme**: Easy on the eyes with professional color scheme

## � Current Card Pool

### Basic Test Cards
1. **Basic Office Intern** (Common, Admin) - 1/1, 1 Salary
2. **Basic Office Staff** (Common, Admin) - 1/2, 1 Salary  
3. **Basic Admin Staff** (Common, Admin) - 2/4, 3 Salary

### Rarity System
- **Common** (C): Gray - Basic cards
- **Uncommon** (U): Green - Slightly enhanced abilities
- **Rare** (R): Blue - Strong effects
- **SuperRare** (SR): Purple - Very powerful
- **Epic** (E): Orange-Red - Game-changing effects
- **Mythic** (M): Brown - Legendary status
- **Legendary** (L): Gold - Ultimate abilities

## � Game Loop

1. **Draw Phase**: Draw 1 card
2. **Main Phase**: Play cards and use abilities
3. **Combat Phase**: Attack with minions
4. **End Phase**: End turn, trigger effects

## 🤝 Contributing

This project is open for contributions! Areas for improvement:

- **Card Design**: Create new cards and mechanics
- **AI Enhancement**: Improve opponent AI logic
- **Visual Effects**: Add animations and particle effects
- **Sound Design**: Implement audio feedback
- **Balance**: Test and refine game balance
- **Mobile Optimization**: Enhance touch controls

## 🐛 Known Issues

- Limited card pool (currently 3 test cards)
- Basic AI opponent logic
- No sound effects implemented
- Missing advanced mechanics (factions synergies, etc.)

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: [https://sunsetzf2023.github.io/simulatorForWUDAO/](https://sunsetzf2023.github.io/simulatorForWUDAO/)
- **Repository**: [https://github.com/SunsetzF2023/simulatorForWUDAO](https://github.com/SunsetzF2023/simulatorForWUDAO)
- **Issues**: [https://github.com/SunsetzF2023/simulatorForWUDAO/issues](https://github.com/SunsetzF2023/simulatorForWUDAO/issues)

## 🚀 Roadmap

### Phase 1: Core Features
- [x] Basic game loop
- [x] Card playing mechanics
- [x] Attack system
- [x] Turn management
- [x] UI framework

### Phase 2: Content Expansion
- [ ] 50+ cards with diverse abilities
- [ ] Faction synergy system
- [ ] Advanced keyword implementations
- [ ] Card collection system

### Phase 3: Polish & Features
- [ ] Sound effects and music
- [ ] Advanced animations
- [ ] Statistics tracking
- [ ] Replay system
- [ ] Tournament mode

---

**Built with ❤️ using modern web technologies and modular JavaScript architecture**

*A strategic CCG experience where corporate warfare meets card game mechanics*
