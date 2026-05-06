// Office War - 主入口文件
// 导入所有模块并初始化游戏

import { GameEngine } from './engine.js';
import { UIManager } from './ui.js';

class OfficeWarGame {
    constructor() {
        this.engine = null;
        this.ui = null;
    }

    async initialize() {
        try {
            // 初始化UI管理器
            this.ui = new UIManager();
            
            // 初始化游戏引擎
            this.engine = new GameEngine();
            
            // 设置相互引用
            this.ui.setGameEngine(this.engine);
            this.engine.ui = this.ui;
            
            // 初始化游戏
            await this.engine.initialize(this.ui);
            
            // 初始渲染
            this.ui.render();
            
            console.log('Office War 游戏初始化完成');
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.ui.showModal('初始化错误', '游戏加载失败，请刷新页面重试。');
        }
    }
}

// 页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', async () => {
    const game = new OfficeWarGame();
    await game.initialize();
});

// 导出游戏类供调试使用
window.OfficeWarGame = OfficeWarGame;
