// 游戏核心引擎 - 回合管理、状态控制、游戏循环

export class GameEngine {
    constructor() {
        this.state = {
            turn: 1,
            currentPhase: 'draw', // draw, play, attack, end
            isPlayerTurn: true,
            playerSalary: 1,
            maxSalary: 10,
            playerHero: new Hero('Player', 30),
            opponentHero: new Hero('Opponent', 30),
            playerHand: [],
            opponentHand: [],
            playerMinions: [],
            opponentMinions: [],
            playerDeck: [],
            opponentDeck: [],
            gameOver: false,
            winner: null
        };
        
        this.mechanics = null;
        this.ui = null;
        this.allCards = [];
    }

    async initialize(ui) {
        this.ui = ui;
        const mechanicsModule = await import('./mechanics.js');
        this.mechanics = new mechanicsModule.GameMechanics();
        
        // 加载卡牌数据
        const entitiesModule = await import('./entities.js');
        this.allCards = await entitiesModule.CardFactory.loadCards();
        
        // 初始化卡组
        this.state.playerDeck = this.createDeck();
        this.state.opponentDeck = this.createDeck();
        
        // 洗牌
        this.shuffleDeck(this.state.playerDeck);
        this.shuffleDeck(this.state.opponentDeck);
        
        // 抽起始手牌
        for (let i = 0; i < 3; i++) {
            this.drawCard(true);
            this.drawCard(false);
        }
        
        // 开始第一回合
        this.startTurn();
    }

    createDeck() {
        // 临时实现：创建基础卡组
        const deck = [];
        const basicStaff = this.allCards.find(card => card.name === 'Basic Staff');
        
        if (basicStaff) {
            for (let i = 0; i < 20; i++) {
                deck.push(basicStaff.clone());
            }
        } else {
            // 如果没有找到基础卡牌，创建临时卡牌
            for (let i = 0; i < 20; i++) {
                const tempCard = {
                    Card_Name: "Basic Staff",
                    Rarity: "Common",
                    Faction: ["Ops"],
                    Salary: 1,
                    Stats: { ATK: 1, HP: 1 },
                    Abilities: { Passive: "None", Active: "None" },
                    description: "普通办公室职员"
                };
                deck.push(new Card(tempCard));
            }
        }
        
        return deck;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    drawCard(isPlayer) {
        const deck = isPlayer ? this.state.playerDeck : this.state.opponentDeck;
        const hand = isPlayer ? this.state.playerHand : this.state.opponentHand;
        
        if (deck.length === 0) return null;
        
        const card = deck.pop();
        hand.push(card);
        
        if (isPlayer) {
            this.ui.addLog(`抽到了 ${card.name}`, 'player-turn');
        }
        
        return card;
    }

    async playCard(card, isPlayer) {
        const hand = isPlayer ? this.state.playerHand : this.state.opponentHand;
        const salary = isPlayer ? this.state.playerSalary : this.state.playerSalary; // 简化：对手使用相同工资系统
        const minions = isPlayer ? this.state.playerMinions : this.state.opponentMinions;
        
        // 检查是否可以出牌
        if (!this.canPlayCard(card, salary, minions)) {
            return false;
        }
        
        // 支付工资
        if (isPlayer) {
            this.state.playerSalary -= card.cost;
        }
        
        // 从手牌移除
        const cardIndex = hand.indexOf(card);
        if (cardIndex > -1) {
            hand.splice(cardIndex, 1);
        }
        
        // 添加到场地
        minions.push(card);
        
        // 处理战吼等效果
        await this.mechanics.handleCardPlay(card, this.state);
        
        // 处理嗜睡效果
        if (card.keywords.includes('Lethargic')) {
            card.sleeping = true;
            card.canAttack = false;
        } else {
            card.canAttack = true;
        }
        
        this.ui.addLog(`${isPlayer ? '玩家' : '对手'} 打出了 ${card.name}`, isPlayer ? 'player-turn' : 'opponent-turn');
        this.ui.render();
        
        return true;
    }

    canPlayCard(card, salary, minions) {
        // 检查工资是否足够
        if (salary < card.cost) {
            return false;
        }
        
        // 检查场地是否有空位（最多7个随从）
        if (minions.length >= 7) {
            return false;
        }
        
        return true;
    }

    async attack(attacker, defender, isPlayer) {
        const success = await this.mechanics.handleAttack(attacker, defender, this.state);
        
        if (success) {
            this.ui.addLog(
                `${attacker.name} 攻击了 ${defender.name}，造成 ${attacker.attack} 点伤害`,
                'combat'
            );
            this.ui.render();
        }
        
        return success;
    }

    startTurn() {
        this.state.currentPhase = 'draw';
        
        if (this.state.isPlayerTurn) {
            // 玩家回合开始
            this.state.playerSalary = Math.min(this.state.maxSalary, this.state.playerSalary + 1);
            this.drawCard(true);
            
            // 处理回合开始效果
            this.mechanics.handleTurnStart(this.state, true);
            
            this.ui.addLog(`回合 ${this.state.turn} - 玩家回合开始`, 'player-turn');
        } else {
            // 对手回合开始（简化AI）
            this.drawCard(false);
            this.mechanics.handleTurnStart(this.state, false);
            
            this.ui.addLog(`回合 ${this.state.turn} - 对手回合开始`, 'opponent-turn');
            
            // 简单AI：随机出牌
            setTimeout(() => this.opponentTurn(), 1000);
        }
        
        this.state.currentPhase = 'play';
        this.ui.render();
    }

    opponentTurn() {
        // 简单AI逻辑
        const playableCards = this.state.opponentHand.filter(card => 
            this.canPlayCard(card, this.state.playerSalary, this.state.opponentMinions)
        );
        
        if (playableCards.length > 0 && this.state.opponentMinions.length < 7) {
            // 随机出一张牌
            const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
            this.playCard(cardToPlay, false);
        }
        
        // 简单攻击逻辑
        setTimeout(() => {
            if (this.state.opponentMinions.some(minion => minion.canAttack && !minion.hasAttacked)) {
                const attacker = this.state.opponentMinions.find(minion => minion.canAttack && !minion.hasAttacked);
                if (attacker && this.state.playerMinions.length > 0) {
                    const target = this.state.playerMinions[Math.floor(Math.random() * this.state.playerMinions.length)];
                    this.attack(attacker, target, false);
                } else if (attacker) {
                    this.attack(attacker, this.state.playerHero, false);
                }
            }
            
            setTimeout(() => this.endTurn(), 1000);
        }, 1500);
    }

    endTurn() {
        this.state.currentPhase = 'end';
        
        // 处理回合结束效果
        this.mechanics.handleTurnEnd(this.state, this.state.isPlayerTurn);
        
        // 切换玩家
        this.state.isPlayerTurn = !this.state.isPlayerTurn;
        
        if (!this.state.isPlayerTurn) {
            this.state.turn++;
        }
        
        // 检查游戏结束
        if (this.checkGameOver()) {
            this.endGame();
        } else {
            setTimeout(() => this.startTurn(), 1000);
        }
        
        this.ui.render();
    }

    checkGameOver() {
        if (this.state.playerHero.hp <= 0) {
            this.state.gameOver = true;
            this.state.winner = 'opponent';
            return true;
        }
        
        if (this.state.opponentHero.hp <= 0) {
            this.state.gameOver = true;
            this.state.winner = 'player';
            return true;
        }
        
        return false;
    }

    endGame() {
        const message = this.state.winner === 'player' ? '恭喜你赢得了胜利！' : '很遗憾，你输掉了比赛。';
        this.ui.showModal('游戏结束', message);
        this.ui.addLog(`游戏结束 - ${message}`, 'combat');
    }

    // 获取可攻击目标
    getAttackTargets(isPlayer) {
        const targets = [];
        
        if (isPlayer) {
            // 玩家可以攻击对手的随从和英雄
            targets.push(...this.state.opponentMinions);
            targets.push(this.state.opponentHero);
        } else {
            // 对手可以攻击玩家的随从和英雄
            targets.push(...this.state.playerMinions);
            targets.push(this.state.playerHero);
        }
        
        return targets;
    }

    // 获取可出牌的手牌
    getPlayableCards(isPlayer) {
        const hand = isPlayer ? this.state.playerHand : this.state.opponentHand;
        const salary = isPlayer ? this.state.playerSalary : this.state.playerSalary;
        const minions = isPlayer ? this.state.playerMinions : this.state.opponentMinions;
        
        return hand.filter(card => this.canPlayCard(card, salary, minions));
    }

    // 获取当前游戏状态
    getState() {
        return { ...this.state };
    }
}
