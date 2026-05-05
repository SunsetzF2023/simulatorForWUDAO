# 武道轮回模拟器 (Wudao Reincarnation Simulator)

A modular web-based martial arts cultivation simulator with roguelike elements.

## 🎮 Play Online

**GitHub Pages Live Demo:** [https://sunsetzf2023.github.io/simulatorForWUDAO/](https://sunsetzf2023.github.io/simulatorForWUDAO/)

Click the link above to play the game directly in your browser!

## 📖 About the Game

Wudao Reincarnation Simulator is a text-based cultivation game where players progress through martial arts realms, make strategic choices, and experience reincarnation cycles. The game features a sophisticated attribute system, random events, and permanent progression through karma points.

### 🎯 Core Features

- **9 Cultivation Realms**: From "Beginner" to "Martial Emperor"
- **Dynamic Progress Bar**: Golden breathing animation showing realm progression
- **Quarterly Decision System**: Make choices every 3 months
- **Attribute Requirements**: Choices locked behind stat thresholds
- **Cultivation Backup**: Always available "Secluded Cultivation" option
- **Destiny System**: 8 unique destinies with stat bonuses
- **Reincarnation Cycle**: Convert achievements to permanent upgrades
- **Mobile Responsive**: Optimized for all devices

## 🏗️ Architecture

The project follows a modular ES6 architecture:

```
simulatorWUDAO/
├── index.html          # Pure HTML container structure
├── style.css           # All styles and animations
└── js/
    ├── config.js       # Game configuration (realms, destinies, constants)
    ├── events.js       # Event library (categorized by age groups)
    ├── core.js         # Game engine and state management
    ├── ui.js           # UI operations and DOM management
    └── main.js         # Entry point and module coordination
```

### 🧩 Module Breakdown

- **config.js**: Static game data and configuration
- **events.js**: Comprehensive event library with age-based categorization
- **core.js**: Game logic, state management, and data persistence
- **ui.js**: DOM manipulation and user interface updates
- **main.js**: Game initialization and module coordination

## 🎮 How to Play

1. **Starting the Game**: Begin with randomized stats and destiny
2. **Making Choices**: Every 3 months, choose from 3 random events
3. **Attribute Requirements**: Some choices require minimum stats (shown when locked)
4. **Secluded Cultivation**: Always available option to gain +1 random stat
5. **Realm Progression**: Advance through 9 cultivation realms based on power
6. **Reincarnation**: When lifespan ends, convert achievements to karma points
7. **Permanent Upgrades**: Use karma to boost starting stats for next life

### 📊 Attributes

- **Physique (体魄)**: Affects health上限 and combat events
- **Intelligence (悟性)**: Determines learning efficiency and insight events
- **Mind (心性)**: Influences breakthrough success and mental fortitude

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript ES6+**: Modular architecture with import/export
- **LocalStorage**: Game state persistence
- **GitHub Pages**: Static hosting and deployment

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/SunsetzF2023/simulatorForWUDAO.git
   ```

2. Navigate to the project directory:
   ```bash
   cd simulatorForWUDAO
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

4. Access the game at `http://localhost:8000`

## 📱 Mobile Compatibility

The game is fully responsive and optimized for mobile devices:
- Touch-friendly buttons and interactions
- Adaptive layout for different screen sizes
- Optimized performance for mobile browsers

## 🎨 Design Features

- **Dark Theme**: Easy on the eyes with gold accent colors (#121212 background, #f1c40f accents)
- **Breathing Animation**: Golden progress bar with pulsing effect
- **Smooth Transitions**: CSS animations for all interactive elements
- **Color-coded Logs**: Different colors for breakthroughs, injuries, and normal events

## 🔄 Game Loop

1. **Event Phase**: Choose from 3 random events with stat requirements
2. **Time Progression**: Each choice advances time by 3 months
3. **Stat Growth**: Gain attributes through choices or cultivation
4. **Realm Breakthrough**: Automatically advance when power thresholds are met
5. **Life Cycle**: Age increases yearly, lifespan decreases
6. **Reincarnation**: Convert lifetime achievements to permanent bonuses

## 📈 Progression Systems

- **Power Calculation**: `Power = Physique × 2 + Intelligence × 3 + Mind × 2`
- **Realm Thresholds**: Fixed power requirements for each realm
- **Karma Calculation**: Based on highest realm and survival years
- **Destiny Bonuses**: Percentage modifiers to stat gains

## 🤝 Contributing

This project is open for contributions! Feel free to:
- Report bugs or issues
- Suggest new events and features
- Improve the modular architecture
- Enhance the UI/UX design

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: [https://sunsetzf2023.github.io/simulatorForWUDAO/](https://sunsetzf2023.github.io/simulatorForWUDAO/)
- **Repository**: [https://github.com/SunsetzF2023/simulatorForWUDAO](https://github.com/SunsetzF2023/simulatorForWUDAO)
- **Issues**: [https://github.com/SunsetzF2023/simulatorForWUDAO/issues](https://github.com/SunsetzF2023/simulatorForWUDAO/issues)

---

**Built with ❤️ using modern web technologies and modular JavaScript architecture**
