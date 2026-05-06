// UI操作模块 - 负责所有DOM操作和界面更新

import { STAT_NAMES, GAME_CONFIG } from './config.js';

export class UIManager {
    constructor() {
        this.elements = this.initializeElements();
    }

    // 初始化DOM元素引用
    initializeElements() {
        return {
            realmTitle: document.getElementById('realmTitle'),
            lifespan: document.getElementById('lifespan'),
            progressBar: document.getElementById('progressBar'),
            progressText: document.getElementById('progressText'),
            destiny: document.getElementById('destiny'),
            physique: document.getElementById('physique'),
            intelligence: document.getElementById('intelligence'),
            mind: document.getElementById('mind'),
            eventText: document.getElementById('eventText'),
            choicesContainer: document.getElementById('choicesContainer'),
            cultivationBtn: document.getElementById('cultivationBtn'),
            logContainer: document.getElementById('logContainer'),
            rebirthModal: document.getElementById('rebirthModal'),
            rebirthStats: document.getElementById('rebirthStats'),
            karmaDisplay: document.getElementById('karmaDisplay'),
            upgradeModal: document.getElementById('upgradeModal'),
            karmaPoints: document.getElementById('karmaPoints')
        };
    }

    // 更新整个游戏界面
    updateDisplay(gameState, realms) {
        this.updateRealmSection(gameState, realms);
        this.updateStats(gameState);
        this.updateProgressBar(gameState);
    }

    // 更新境界区域
    updateRealmSection(gameState, realms) {
        this.elements.realmTitle.textContent = realms[gameState.realm].name;
        this.elements.lifespan.textContent = `寿命: ${gameState.lifespan}岁`;
        
        if (gameState.destiny) {
            this.elements.destiny.textContent = `命格: ${gameState.destiny.name}`;
        }
    }

    // 更新属性显示
    updateStats(gameState) {
        this.elements.physique.textContent = gameState.physique;
        this.elements.intelligence.textContent = gameState.intelligence;
        this.elements.mind.textContent = gameState.mind;
    }

    // 更新进度条
    updateProgressBar(gameState) {
        const progress = gameState.getProgressPercentage ? gameState.getProgressPercentage() : 0;
        this.elements.progressBar.style.width = progress + '%';
        this.elements.progressText.textContent = progress + '%';
    }

    // 显示事件
    displayEvent(gameState) {
        if (!gameState.currentEvent) return;
        
        const seasonText = gameState.getSeasonText ? gameState.getSeasonText() : '春';
        this.elements.eventText.textContent = 
            `${Math.floor(gameState.age)}岁，${seasonText} - ${gameState.currentEvent.text}`;
        
        this.elements.choicesContainer.innerHTML = '';
        
        gameState.currentEvent.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice.text;
            
            const canChoose = gameState.checkRequirement ? 
                gameState.checkRequirement(choice.requirement) : true;
            
            if (!canChoose) {
                btn.disabled = true;
                let reqText = '<div class="requirement">需要: ';
                for (let stat in choice.requirement) {
                    reqText += `${STAT_NAMES[stat]} ${choice.requirement[stat]} `;
                }
                reqText += '</div>';
                btn.innerHTML += reqText;
            } else {
                btn.onclick = () => {
                    if (window.gameController) {
                        window.gameController.makeChoice(index);
                    }
                };
            }
            
            this.elements.choicesContainer.appendChild(btn);
        });
    }

    // 添加日志
    addLog(text, type = 'normal') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = text;
        this.elements.logContainer.insertBefore(logEntry, this.elements.logContainer.firstChild);
        
        // 限制日志数量
        while (this.elements.logContainer.children.length > GAME_CONFIG.LOG_MAX_ENTRIES) {
            this.elements.logContainer.removeChild(this.elements.logContainer.lastChild);
        }
    }

    // 显示轮回结算模态框
    showRebirthModal(rebirthData) {
        const stats = this.elements.rebirthStats;
        stats.innerHTML = `
            <p>最高境界: ${rebirthData.realm}</p>
            <p>享年: ${rebirthData.age}岁</p>
            <p>最终战力: ${rebirthData.power}</p>
            <p>本次轮回点: +${rebirthData.karma}</p>
        `;
        
        this.elements.karmaDisplay.textContent = `总轮回点: ${rebirthData.totalKarma}`;
        this.elements.rebirthModal.style.display = 'flex';
    }

    // 显示升级模态框
    showUpgradeModal(karma) {
        this.elements.karmaPoints.textContent = karma;
        this.elements.upgradeModal.style.display = 'flex';
    }

    // 隐藏模态框
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 清空日志
    clearLogs() {
        this.elements.logContainer.innerHTML = 
            '<div class="log-entry normal">新的轮回，新的开始...</div>';
    }

    // 设置闭关苦修按钮回调
    setCultivationCallback(callback) {
        this.elements.cultivationBtn.onclick = callback;
    }

    // 设置轮回转世按钮回调
    setRebirthCallback(callback) {
        const rebirthBtn = this.elements.rebirthModal.querySelector('.modal-btn');
        if (rebirthBtn) {
            rebirthBtn.onclick = callback;
        }
    }

    // 设置升级按钮回调
    setUpgradeCallbacks(callbacks) {
        const upgradeBtns = this.elements.upgradeModal.querySelectorAll('.modal-btn');
        upgradeBtns.forEach((btn, index) => {
            if (callbacks[index]) {
                btn.onclick = callbacks[index];
            }
        });
    }

    // 显示加载状态
    showLoading() {
        this.elements.eventText.textContent = '加载中...';
        this.elements.choicesContainer.innerHTML = '';
    }

    // 显示错误信息
    showError(message) {
        this.addLog(`错误: ${message}`, 'injury');
    }
}
