// 游戏机制处理 - 关键词效果和特殊规则

export class GameMechanics {
    constructor() {
        this.keywordHandlers = {
            'Battlecry': this.handleBattlecry.bind(this),
            'SeverancePay': this.handleSeverancePay.bind(this),
            'LegacyBug': this.handleLegacyBug.bind(this),
            'EmergencySupport': this.handleEmergencySupport.bind(this),
            'Scapegoat': this.handleScapegoat.bind(this),
            'ShiftingBlame': this.handleShiftingBlame.bind(this),
            'Overtime': this.handleOvertime.bind(this),
            'Lethargic': this.handleLethargic.bind(this),
            'PerformanceReview': this.handlePerformanceReview.bind(this),
            'Slacking': this.handleSlacking.bind(this),
            'WorkplacePUA': this.handleWorkplacePUA.bind(this)
        };
    }

    // 处理卡牌打出时的关键词效果
    async handleCardPlay(card, gameState) {
        for (const keyword of card.keywords) {
            if (this.keywordHandlers[keyword]) {
                await this.keywordHandlers[keyword](card, gameState);
            }
        }
    }

    // 战吼：卡牌打出时触发
    async handleBattlecry(card, gameState) {
        console.log(`${card.name} 触发战吼效果`);
        
        if (card.name === "IT Support Officer" || card.name === "Sales Client Manager") {
            // 召唤一个随机的Common随从
            await this.summonRandomJunior(gameState);
        }
    }

    // 离职补偿：死亡时触发正面效果
    handleSeverancePay(card, gameState) {
        console.log(`${card.name} 触发离职补偿效果`);
        // TODO: 实现具体的补偿效果
    }

    // 遗留Bug：死亡时触发负面效果
    handleLegacyBug(card, gameState) {
        console.log(`${card.name} 触发遗留Bug效果`);
        // TODO: 实现具体的Bug效果
    }

    // 紧急支援：可以立即攻击
    handleEmergencySupport(card, gameState) {
        console.log(`${card.name} 获得紧急支援效果`);
        card.canAttack = true;
    }

    // 背锅：嘲讽效果，必须优先攻击
    handleScapegoat(card, gameState) {
        console.log(`${card.name} 获得背锅效果`);
        card.taunt = true;
    }

    // 甩锅：转移伤害到友军
    handleShiftingBlame(card, gameState) {
        console.log(`${card.name} 获得甩锅效果`);
        card.shiftingBlame = true;
    }

    // 加班：减少工资消耗
    handleOvertime(card, gameState) {
        console.log(`${card.name} 获得加班效果`);
        card.cost = Math.max(0, card.cost - 1);
    }

    // 嗜睡：第一回合睡眠，但获得免疫
    handleLethargic(card, gameState) {
        console.log(`${card.name} 获得嗜睡效果`);
        card.sleeping = true;
        card.immune = true;
    }

    // 绩效考核：受伤时获得+2/+2
    handlePerformanceReview(card, gameState) {
        console.log(`${card.name} 获得绩效考核效果`);
        // 在takeDamage时处理
    }

    // 摸鱼：潜行效果，不能被指定
    handleSlacking(card, gameState) {
        console.log(`${card.name} 获得摸鱼效果`);
        card.stealth = true;
    }

    // 职场PUA：毒药效果，摧毁稀有度低于使用者的目标
    handleWorkplacePUA(card, gameState) {
        console.log(`${card.name} 获得职场PUA效果`);
        card.poisonous = true;
    }

    // 召唤随机初级员工
    async summonRandomJunior(gameState) {
        const juniorCards = gameState.allCards.filter(card => 
            card.rarity === 'Common' && 
            card.name.includes('Junior') || 
            card.name.includes('Staff')
        );
        
        if (juniorCards.length > 0) {
            const randomJunior = juniorCards[Math.floor(Math.random() * juniorCards.length)];
            const summonedCard = randomJunior.clone();
            gameState.playerMinions.push(summonedCard);
            
            gameState.ui.addLog(`召唤了 ${summonedCard.name}`, 'player-turn');
            gameState.ui.render();
        }
    }

    // 处理攻击逻辑
    async handleAttack(attacker, defender, gameState) {
        // 检查攻击条件
        if (!this.canAttack(attacker, defender, gameState)) {
            return false;
        }

        // 执行攻击
        const damageToDefender = attacker.attack;
        const damageToAttacker = defender.attack || 0;
        const isHeroDefender = typeof defender.hp !== 'undefined' && !defender.attack; // 简单的英雄判断

        // 处理攻击伤害
        let actualDamageToDefender;
        if (isHeroDefender) {
            // 攻击英雄
            actualDamageToDefender = damageToDefender;
            defender.hp = Math.max(0, defender.hp - actualDamageToDefender);
            gameState.ui.addLog(`${attacker.name} 直接攻击了 ${defender.name}，造成 ${actualDamageToDefender} 点伤害`, 'combat');
        } else {
            // 攻击随从
            actualDamageToDefender = defender.takeDamage(damageToDefender);
        }
        
        // 处理反击伤害（只有随从会反击）
        if (!isHeroDefender && defender.attack) {
            const actualDamageToAttacker = attacker.takeDamage(damageToAttacker);
        }

        // 标记已攻击
        attacker.hasAttacked = true;

        // 处理毒药效果（只对随从生效）
        if (attacker.poisonous && !isHeroDefender) {
            if (this.shouldPUAApply(attacker, defender)) {
                defender.hp = 0; // 直接摧毁
                gameState.ui.addLog(`${attacker.name} 的职场PUA摧毁了 ${defender.name}`, 'combat');
            }
        }

        // 处理绩效考核效果（只对随从生效）
        if (!isHeroDefender && defender.keywords && defender.keywords.includes('PerformanceReview') && actualDamageToDefender > 0) {
            defender.attack += 2;
            defender.maxHp += 2;
            defender.hp += 2;
            gameState.ui.addLog(`${defender.name} 的绩效考核触发，获得+2/+2`, 'combat');
        }

        // 清理死亡的随从
        this.cleanupDeadMinions(gameState);

        return true;
    }

    // 检查是否可以攻击
    canAttack(attacker, target, gameState) {
        if (!attacker.canAttack || attacker.hasAttacked) {
            return false;
        }

        if (attacker.sleeping) {
            return false;
        }

        // 检查嘲讽
        if (target.taunt && !this.isTauntTarget(target, gameState)) {
            return false;
        }

        // 检查潜行
        if (target.stealth && !attacker.ranged) {
            return false;
        }

        return true;
    }

    // 检查嘲讽目标
    isTauntTarget(target, gameState) {
        const enemyMinions = target.isHero ? gameState.opponentMinions : gameState.playerMinions;
        return enemyMinions.some(minion => minion.taunt && minion !== target);
    }

    // 检查PUA是否应该生效
    shouldPUAApply(attacker, defender) {
        if (!attacker.poisonous || defender.isHero) {
            return false;
        }

        const rarityOrder = ['Common', 'Uncommon', 'Rare', 'SuperRare', 'Legendary'];
        const attackerRarityIndex = rarityOrder.indexOf(attacker.rarity);
        const defenderRarityIndex = rarityOrder.indexOf(defender.rarity);
        
        return attackerRarityIndex > defenderRarityIndex;
    }

    // 清理死亡的随从
    cleanupDeadMinions(gameState) {
        gameState.playerMinions = gameState.playerMinions.filter(minion => {
            if (minion.hp <= 0) {
                this.triggerDeathrattle(minion, gameState);
                gameState.ui.addLog(`${minion.name} 离职了`, 'combat');
                return false;
            }
            return true;
        });

        gameState.opponentMinions = gameState.opponentMinions.filter(minion => {
            if (minion.hp <= 0) {
                this.triggerDeathrattle(minion, gameState);
                gameState.ui.addLog(`${minion.name} 离职了`, 'combat');
                return false;
            }
            return true;
        });
    }

    // 触发死亡效果
    triggerDeathrattle(minion, gameState) {
        for (const keyword of minion.keywords) {
            if (keyword === 'SeverancePay') {
                this.handleSeverancePay(minion, gameState);
            } else if (keyword === 'LegacyBug') {
                this.handleLegacyBug(minion, gameState);
            }
        }
    }

    // 回合开始时处理
    async handleTurnStart(gameState, isPlayer) {
        const minions = isPlayer ? gameState.playerMinions : gameState.opponentMinions;
        
        for (const minion of minions) {
            // 唤醒嗜睡的随从
            if (minion.sleeping) {
                minion.sleeping = false;
                minion.immune = false;
                gameState.ui.addLog(`${minion.name} 醒来了`, 'player-turn');
            }
            
            // 重置攻击状态
            minion.hasAttacked = false;
            minion.canAttack = minion.attack > 0;
        }
    }

    // 回合结束时处理
    async handleTurnEnd(gameState, isPlayer) {
        // TODO: 实现回合结束效果
    }
}
