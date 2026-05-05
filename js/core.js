// 游戏核心引擎 - 负责游戏逻辑、状态管理和数据处理

import { REALMS, DESTINIES, GAME_CONFIG, KARMA_CONFIG } from './config.js';
import { getRandomEvent } from './events.js';

export class GameCore {
    constructor() {
        this.state = this.initializeState();
        this.loadGameState();
    }

    // 初始化游戏状态
    initializeState() {
        return {
            age: GAME_CONFIG.INITIAL_AGE,
            lifespan: GAME_CONFIG.INITIAL_LIFESPAN,
            physique: GAME_CONFIG.INITIAL_STATS.physique,
            intelligence: GAME_CONFIG.INITIAL_STATS.intelligence,
            mind: GAME_CONFIG.INITIAL_STATS.mind,
            power: 0,
            realm: 0,
            realmProgress: 0,
            destiny: null,
            karma: 0,
            currentEvent: null,
            season: 0,
            year: 1
        };
    }

    // 选择命格
    selectDestiny() {
        const randomDestiny = DESTINIES[Math.floor(Math.random() * DESTINIES.length)];
        this.state.destiny = randomDestiny;
        return randomDestiny;
    }

    // 生成新事件
    generateEvent() {
        this.state.currentEvent = getRandomEvent(this.state.age);
        return this.state.currentEvent;
    }

    // 检查属性需求
    checkRequirement(requirement) {
        for (let stat in requirement) {
            if (this.state[stat] < requirement[stat]) {
                return false;
            }
        }
        return true;
    }

    // 应用选择效果
    applyChoiceEffect(choice) {
        for (let stat in choice.effect) {
            if (stat === 'realmProgress') {
                this.state.realmProgress += choice.effect[stat];
            } else if (this.state.destiny && this.state.destiny.effect[stat]) {
                this.state[stat] += Math.floor(choice.effect[stat] * this.state.destiny.effect[stat]);
            } else {
                this.state[stat] += choice.effect[stat];
            }
        }
        this.updatePower();
        this.checkRealmBreakthrough();
        this.passTime(GAME_CONFIG.QUARTER_MONTHS);
    }

    // 闭关苦修
    cultivate() {
        const stats = ['physique', 'intelligence', 'mind'];
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        const increase = 1;
        
        if (this.state.destiny && this.state.destiny.effect[randomStat]) {
            this.state[randomStat] += Math.floor(increase * this.state.destiny.effect[randomStat]);
        } else {
            this.state[randomStat] += increase;
        }
        
        this.updatePower();
        this.checkRealmBreakthrough();
        this.passTime(GAME_CONFIG.CULTIVATION_MONTHS);
        
        return { stat: randomStat, amount: increase };
    }

    // 时间流逝
    passTime(months) {
        this.state.age += months / 12;
        this.state.season = (this.state.season + months) % 12;
        this.state.year = Math.floor(this.state.age);
        
        // 每年减少寿命
        if (this.state.season === 0) {
            this.state.lifespan--;
            if (this.state.lifespan <= 0) {
                this.state.lifespan = 0;
                return false; // 寿命耗尽
            }
        }
        return true; // 继续存活
    }

    // 更新战力
    updatePower() {
        this.state.power = this.state.physique * 2 + this.state.intelligence * 3 + this.state.mind * 2;
        if (this.state.destiny && this.state.destiny.effect.power) {
            this.state.power = Math.floor(this.state.power * this.state.destiny.effect.power);
        }
    }

    // 检查境界突破
    checkRealmBreakthrough() {
        for (let i = REALMS.length - 1; i >= 0; i--) {
            if (this.state.power >= REALMS[i].power && i > this.state.realm) {
                this.state.realm = i;
                this.state.realmProgress = 0;
                return REALMS[i].name; // 返回新境界名称
            }
        }
        return null;
    }

    // 计算轮回点
    calculateKarma() {
        const realmWeight = (this.state.realm + 1) * KARMA_CONFIG.REALM_WEIGHT_MULTIPLIER;
        const survivalBonus = Math.floor(this.state.age) * KARMA_CONFIG.SURVIVAL_BONUS_MULTIPLIER;
        return realmWeight + survivalBonus;
    }

    // 轮回结算
    processRebirth() {
        const totalKarma = this.calculateKarma();
        this.state.karma += totalKarma;
        
        return {
            realm: REALMS[this.state.realm].name,
            age: Math.floor(this.state.age),
            power: this.state.power,
            karma: totalKarma,
            totalKarma: this.state.karma
        };
    }

    // 升级属性
    upgradeStat(stat) {
        if (this.state.karma >= GAME_CONFIG.KARMA_UPGRADE_COST) {
            this.state.karma -= GAME_CONFIG.KARMA_UPGRADE_COST;
            this.state[stat] += GAME_CONFIG.KARMA_UPGRADE_AMOUNT;
            return true;
        }
        return false;
    }

    // 开始新人生
    startNewLife() {
        const savedStats = {
            physique: this.state.physique,
            intelligence: this.state.intelligence,
            mind: this.state.mind,
            karma: this.state.karma
        };
        
        // 重置游戏状态但保留部分属性
        this.state = this.initializeState();
        this.state.physique = Math.max(GAME_CONFIG.INITIAL_STATS.physique, savedStats.physique);
        this.state.intelligence = Math.max(GAME_CONFIG.INITIAL_STATS.intelligence, savedStats.intelligence);
        this.state.mind = Math.max(GAME_CONFIG.INITIAL_STATS.mind, savedStats.mind);
        this.state.karma = savedStats.karma;
        
        this.selectDestiny();
        this.updatePower();
        this.generateEvent();
    }

    // 获取进度百分比
    getProgressPercentage() {
        if (this.state.realm >= REALMS.length - 1) return 100;
        
        const currentRealmPower = REALMS[this.state.realm].power;
        const nextRealmPower = REALMS[this.state.realm + 1].power;
        const progress = currentRealmPower === 0 ? 0 : 
            Math.min(((this.state.power - currentRealmPower) / (nextRealmPower - currentRealmPower)) * 100, 100);
        
        return Math.floor(progress);
    }

    // 获取季节文本
    getSeasonText() {
        const seasons = ['春', '夏', '秋', '冬'];
        return seasons[Math.floor(this.state.season / 3)];
    }

    // 保存游戏状态
    saveGameState() {
        localStorage.setItem('wudaoGameState', JSON.stringify(this.state));
    }

    // 加载游戏状态
    loadGameState() {
        const saved = localStorage.getItem('wudaoGameState');
        if (saved) {
            const loadedState = JSON.parse(saved);
            Object.assign(this.state, loadedState);
        }
    }

    // 获取当前状态
    getState() {
        return { ...this.state };
    }
}
