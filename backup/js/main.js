// 游戏入口文件 - 负责初始化和模块协调

import { GameCore } from './core.js';
import { UIManager } from './ui.js';
import { REALMS, GAME_CONFIG } from './config.js';

class GameController {
    constructor() {
        this.core = new GameCore();
        this.ui = new UIManager();
        this.init();
    }

    // 初始化游戏
    init() {
        // 设置UI回调
        this.setupUICallbacks();
        
        // 如果没有命格，先选择命格
        if (!this.core.state.destiny) {
            const destiny = this.core.selectDestiny();
            this.ui.addLog(`命格觉醒: ${destiny.name} - ${destiny.description}`, 'breakthrough');
        }
        
        // 更新界面
        this.updateUI();
        
        // 生成初始事件
        this.core.generateEvent();
        this.ui.displayEvent(this.core.state);
        
        // 保存游戏状态
        this.core.saveGameState();
        
        // 设置全局引用
        window.gameController = this;
        
        // 页面关闭前保存
        window.onbeforeunload = () => this.core.saveGameState();
    }

    // 设置UI回调
    setupUICallbacks() {
        // 闭关苦修回调
        this.ui.setCultivationCallback(() => this.cultivate());
        
        // 轮回转世回调
        this.ui.setRebirthCallback(() => this.rebirth());
        
        // 升级按钮回调
        this.ui.setUpgradeCallbacks([
            () => this.upgradeStat('physique'),
            () => this.upgradeStat('intelligence'),
            () => this.upgradeStat('mind'),
            () => this.startNewLife()
        ]);
    }

    // 更新UI
    updateUI() {
        this.ui.updateDisplay(this.core.state, REALMS);
    }

    // 做出选择
    makeChoice(choiceIndex) {
        const choice = this.core.state.currentEvent.choices[choiceIndex];
        
        // 应用效果
        this.core.applyChoiceEffect(choice);
        
        // 记录日志
        this.ui.addLog(`选择: ${choice.text}`, 'normal');
        
        // 检查是否存活
        if (!this.core.state.lifespan || this.core.state.lifespan <= 0) {
            this.processDeath();
            return;
        }
        
        // 生成新事件
        this.core.generateEvent();
        this.ui.displayEvent(this.core.state);
        
        // 更新界面
        this.updateUI();
        
        // 保存游戏
        this.core.saveGameState();
    }

    // 闭关苦修
    cultivate() {
        const result = this.core.cultivate();
        const statName = this.getStatName(result.stat);
        
        this.ui.addLog(`闭关苦修3个月，${statName}+${result.amount}`, 'normal');
        
        // 检查是否存活
        if (!this.core.state.lifespan || this.core.state.lifespan <= 0) {
            this.processDeath();
            return;
        }
        
        // 生成新事件
        this.core.generateEvent();
        this.ui.displayEvent(this.core.state);
        
        // 更新界面
        this.updateUI();
        
        // 保存游戏
        this.core.saveGameState();
    }

    // 处理死亡
    processDeath() {
        const rebirthData = this.core.processRebirth();
        this.ui.showRebirthModal(rebirthData);
        this.core.saveGameState();
    }

    // 轮回转世
    rebirth() {
        this.ui.hideModal('rebirthModal');
        this.ui.showUpgradeModal(this.core.state.karma);
    }

    // 升级属性
    upgradeStat(stat) {
        if (this.core.upgradeStat(stat)) {
            const statName = this.getStatName(stat);
            this.ui.addLog(`轮回加持: ${statName}永久+${GAME_CONFIG.KARMA_UPGRADE_AMOUNT}`, 'breakthrough');
            this.ui.showUpgradeModal(this.core.state.karma);
        }
    }

    // 开始新人生
    startNewLife() {
        this.ui.hideModal('upgradeModal');
        this.ui.clearLogs();
        
        this.core.startNewLife();
        
        const destiny = this.core.state.destiny;
        this.ui.addLog(`命格觉醒: ${destiny.name} - ${destiny.description}`, 'breakthrough');
        
        this.updateUI();
        this.ui.displayEvent(this.core.state);
        
        this.core.saveGameState();
    }

    // 获取属性名称
    getStatName(stat) {
        const names = {
            physique: '体魄',
            intelligence: '悟性',
            mind: '心性',
            power: '战力'
        };
        return names[stat] || stat;
    }
}

// 页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
