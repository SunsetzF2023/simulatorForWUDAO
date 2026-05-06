// UI渲染和DOM操作管理 - KARDS风格界面

export class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.gameEngine = null;
        this.draggedCard = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    initializeElements() {
        console.log("🔍 InitializeElements: Starting DOM element detection...");
        
        const elements = {
            // 资源栏
            playerSalary: document.getElementById('player-salary'),
            deckCount: document.getElementById('deck-count'),
            turnNumber: document.getElementById('turn-number'),
            
            // 英雄HP
            opponentHp: document.getElementById('opponent-hp'),
            opponentHpFill: document.getElementById('opponent-hp-fill'),
            playerHeroHp: document.getElementById('player-hero-hp'),
            playerHpFill: document.getElementById('player-hp-fill'),
            
            // 按钮
            endTurnBtn: document.getElementById('end-turn-btn'),
            
            // 游戏区域
            playerHand: document.getElementById('player-hand'),
            playerMinions: document.getElementById('player-minions'),
            opponentMinions: document.getElementById('opponent-minions'),
            
            // 信息面板
            gameLog: document.getElementById('game-log'),
            cardDetails: document.getElementById('card-details'),
            
            // 模态框
            modal: document.getElementById('modal-overlay'),
            modalTitle: document.getElementById('modal-title'),
            modalMessage: document.getElementById('modal-message'),
            modalClose: document.getElementById('modal-close')
        };
        
        // 检查关键元素
        const criticalElements = ['playerHand', 'playerMinions', 'opponentMinions', 'playerSalary', 'opponentHp'];
        criticalElements.forEach(elementName => {
            const element = elements[elementName];
            if (!element) {
                console.error(`❌ InitializeElements: Critical element #${elementName} not found!`);
            } else {
                console.log(`✅ InitializeElements: #${elementName} found`);
            }
        });
        
        console.log("🔍 InitializeElements: DOM element detection complete");
        return elements;
    }

    setGameEngine(engine) {
        this.gameEngine = engine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 结束回合按钮
        this.elements.endTurnBtn.addEventListener('click', () => {
            if (this.gameEngine && this.gameEngine.state.isPlayerTurn) {
                this.gameEngine.endTurn();
            }
        });

        // 模态框关闭
        this.elements.modalClose.addEventListener('click', () => {
            this.hideModal();
        });

        // 点击模态框外部关闭
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });
    }

    render() {
        console.log("🎮 UI Render: Starting render process...");
        
        if (!this.gameEngine) {
            console.error("❌ UI Render: No game engine found!");
            return;
        }

        const state = this.gameEngine.getState();
        console.log("📊 UI Render: Game state loaded", { 
            playerHand: state.playerHand?.length || 0,
            playerMinions: state.playerMinions?.length || 0,
            opponentMinions: state.opponentMinions?.length || 0
        });
        
        try {
            // 更新头部信息
            console.log("🔄 UI Render: Updating header...");
            this.updateHeader(state);
            
            // 渲染游戏区域
            console.log("🃏 UI Render: Rendering player hand...");
            this.renderHand(state.playerHand, true);
            
            console.log("⚔️ UI Render: Rendering player minions...");
            this.renderMinions(state.playerMinions, true);
            
            console.log("👹 UI Render: Rendering opponent minions...");
            this.renderMinions(state.opponentMinions, false);
            
            // 渲染英雄信息
            console.log("🦸 UI Render: Rendering heroes...");
            this.renderHero(state.playerHero, true);
            this.renderHero(state.opponentHero, false);
            
            // 更新按钮状态
            console.log("🔘 UI Render: Updating button states...");
            this.updateEndTurnButton(state);
            
            console.log("✅ UI Render: Render completed successfully!");
        } catch (error) {
            console.error("❌ UI Render: Error during render:", error);
        }
    }

    updateHeader(state) {
        this.elements.playerSalary.textContent = state.playerSalary;
        this.elements.deckCount.textContent = state.playerDeck.length;
        this.elements.turnNumber.textContent = state.turn;
        this.elements.opponentHp.textContent = state.opponentHero.hp;
    }

    renderHand(hand, isPlayer) {
        console.log(`🃏 RenderHand: ${isPlayer ? 'Player' : 'Opponent'} hand with ${hand?.length || 0} cards`);
        
        if (!isPlayer) {
            console.log("🃏 RenderHand: Skipping opponent hand rendering");
            return; // 暂时不显示对手手牌
        }
        
        const container = this.elements.playerHand;
        if (!container) {
            console.error("❌ RenderHand: Player hand container not found!");
            return;
        }
        
        console.log("🃏 RenderHand: Clearing container and adding cards...");
        container.innerHTML = '';
        
        if (!hand || hand.length === 0) {
            console.log("🃏 RenderHand: No cards to render");
            container.innerHTML = '<div style="color: #666; padding: 10px;">No cards in hand</div>';
            return;
        }
        
        hand.forEach((card, index) => {
            console.log(`🃏 RenderHand: Creating card ${index + 1}: ${card.name}`);
            try {
                const cardElement = this.createCardElement(card, true);
                cardElement.addEventListener('click', () => this.onCardClick(card, index));
                container.appendChild(cardElement);
                console.log(`✅ RenderHand: Card ${card.name} added to DOM`);
            } catch (error) {
                console.error(`❌ RenderHand: Error creating card ${card.name}:`, error);
            }
        });
        
        console.log(`✅ RenderHand: Player hand rendering complete with ${container.children.length} elements`);
    }

    renderMinions(minions, isPlayer) {
        console.log(`⚔️ RenderMinions: ${isPlayer ? 'Player' : 'Opponent'} minions with ${minions?.length || 0} units`);
        
        const container = isPlayer ? this.elements.playerMinions : this.elements.opponentMinions;
        if (!container) {
            console.error(`❌ RenderMinions: ${isPlayer ? 'Player' : 'Opponent'} minion container not found!`);
            return;
        }
        
        console.log(`⚔️ RenderMinions: Clearing ${isPlayer ? 'player' : 'opponent'} minion container...`);
        container.innerHTML = '';
        
        if (!minions || minions.length === 0) {
            console.log(`⚔️ RenderMinions: No ${isPlayer ? 'player' : 'opponent'} minions to render`);
            container.innerHTML = '<div style="color: #666; padding: 10px;">No minions on field</div>';
            return;
        }
        
        minions.forEach((minion, index) => {
            console.log(`⚔️ RenderMinions: Creating minion ${index + 1}: ${minion.name}`);
            try {
                const minionElement = this.createCardElement(minion, false);
                
                if (isPlayer) {
                    minionElement.addEventListener('click', () => this.onMinionClick(minion, index));
                    
                    // 添加攻击目标选择
                    minionElement.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        this.showAttackTargets(minion);
                    });
                }
                
                container.appendChild(minionElement);
                console.log(`✅ RenderMinions: Minion ${minion.name} added to DOM`);
            } catch (error) {
                console.error(`❌ RenderMinions: Error creating minion ${minion.name}:`, error);
            }
        });
        
        console.log(`✅ RenderMinions: ${isPlayer ? 'Player' : 'Opponent'} minion rendering complete with ${container.children.length} elements`);
    }

    renderHero(hero, isPlayer) {
        console.log(`🦸 RenderHero: ${isPlayer ? 'Player' : 'Opponent'} hero - HP: ${hero.hp}/${hero.maxHp}`);
        
        // 更新英雄HP显示
        const hpElement = isPlayer ? this.elements.playerHeroHp : this.elements.opponentHp;
        const hpFillElement = isPlayer ? this.elements.playerHpFill : this.elements.opponentHpFill;
        
        if (!hpElement) {
            console.error(`❌ RenderHero: ${isPlayer ? 'Player' : 'Opponent'} HP element not found!`);
        } else {
            hpElement.textContent = hero.hp;
            console.log(`✅ RenderHero: Updated ${isPlayer ? 'player' : 'opponent'} HP to ${hero.hp}`);
        }
        
        if (!hpFillElement) {
            console.error(`❌ RenderHero: ${isPlayer ? 'Player' : 'Opponent'} HP fill element not found!`);
        } else {
            const hpPercentage = (hero.hp / hero.maxHp) * 100;
            hpFillElement.style.width = `${hpPercentage}%`;
            console.log(`✅ RenderHero: Updated ${isPlayer ? 'player' : 'opponent'} HP bar to ${hpPercentage}%`);
        }
    }

    createCardElement(card, isInHand) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardId = card.id;
        cardDiv.draggable = isInHand; // 只有手牌可以拖拽
        
        // 添加稀有度样式
        const rarityClass = `rarity-${card.rarity.toLowerCase()}`;
        cardDiv.classList.add(rarityClass);
        
        // 检查是否可出牌
        if (isInHand && this.gameEngine) {
            const state = this.gameEngine.getState();
            const canPlay = this.gameEngine.canPlayCard(card, state.playerSalary, state.playerMinions);
            cardDiv.classList.add(canPlay ? 'playable' : 'unplayable');
        }
        
        // 卡牌内容
        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-name">${card.name}</div>
                <div class="card-cost">${card.cost}</div>
            </div>
            <div class="card-stats">
                <div class="card-attack">${card.attack}</div>
                <div class="card-hp">${card.hp}</div>
            </div>
        `;
        
        // 添加稀有度标签
        if (card.rarity !== 'Common') {
            const rarityBadge = document.createElement('div');
            rarityBadge.className = `card-rarity ${rarityClass}`;
            rarityBadge.textContent = this.getRarityAbbreviation(card.rarity);
            cardDiv.appendChild(rarityBadge);
        }
        
        // 添加关键词标签
        if (card.keywords && card.keywords.length > 0) {
            const keywordsDiv = document.createElement('div');
            keywordsDiv.style.cssText = 'margin-top: 4px;';
            
            card.keywords.slice(0, 2).forEach(keyword => {
                const keywordSpan = document.createElement('span');
                keywordSpan.className = 'keyword';
                keywordSpan.textContent = this.getKeywordDisplay(keyword);
                keywordsDiv.appendChild(keywordSpan);
            });
            
            cardDiv.appendChild(keywordsDiv);
        }
        
        // 事件监听
        this.setupCardEvents(cardDiv, card, isInHand);
        
        return cardDiv;
    }

    setupCardEvents(cardElement, card, isInHand) {
        // 鼠标悬停显示详情
        cardElement.addEventListener('mouseenter', () => this.showCardDetails(card));
        cardElement.addEventListener('mouseleave', () => this.hideCardDetails());
        
        // 点击事件（保留原有功能）
        if (isInHand) {
            cardElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.onCardClick(card, cardElement);
            });
        }
        
        // 拖拽事件
        if (isInHand) {
            cardElement.addEventListener('dragstart', (e) => this.handleDragStart(e, card));
            cardElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // 触摸事件支持
            cardElement.addEventListener('touchstart', (e) => this.handleTouchStart(e, card), { passive: false });
            cardElement.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            cardElement.addEventListener('touchend', (e) => this.handleTouchEnd(e, card));
        }
        
        // 右键攻击（随从）
        if (!isInHand) {
            cardElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showAttackTargets(card);
            });
        }
    }

    handleDragStart(e, card) {
        this.draggedCard = card;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.id);
        
        // 添加拖拽样式
        e.target.style.opacity = '0.7';
        e.target.style.transform = 'scale(1.1) rotate(5deg)';
        
        // 高亮可放置区域
        this.highlightDropZones(card);
    }

    handleDragEnd(e) {
        e.target.style.opacity = '';
        e.target.style.transform = '';
        this.clearHighlights();
        this.draggedCard = null;
    }

    handleTouchStart(e, card) {
        e.preventDefault();
        this.draggedCard = card;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('card')) {
            element.style.opacity = '0.7';
            element.style.transform = 'scale(1.1) rotate(5deg)';
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.draggedCard) return;
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // 检查是否在随从区域
        if (element && element.closest('.player-field')) {
            this.highlightDropZones(this.draggedCard);
        }
    }

    handleTouchEnd(e, card) {
        e.preventDefault();
        if (!this.draggedCard) return;
        
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // 清除样式
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '';
            card.style.transform = '';
        });
        
        // 检查是否放置在有效区域
        if (element && element.closest('.player-field')) {
            this.onCardClick(card, element);
        }
        
        this.clearHighlights();
        this.draggedCard = null;
    }

    highlightDropZones(card) {
        if (!this.gameEngine) return;
        
        const state = this.gameEngine.getState();
        const canPlay = this.gameEngine.canPlayCard(card, state.playerSalary, state.playerMinions);
        
        if (canPlay) {
            const playerField = document.querySelector('.player-field');
            if (playerField) {
                playerField.style.background = 'rgba(39, 174, 96, 0.2)';
                playerField.style.border = '2px dashed #27ae60';
            }
        }
    }

    clearHighlights() {
        document.querySelectorAll('.player-field, .enemy-field').forEach(field => {
            field.style.background = '';
            field.style.border = '';
        });
    }

    getRarityAbbreviation(rarity) {
        const abbreviations = {
            'Common': 'C',
            'Uncommon': 'U',
            'Rare': 'R',
            'SuperRare': 'SR',
            'Epic': 'E',
            'Mythic': 'M',
            'Legendary': 'L'
        };
        return abbreviations[rarity] || rarity[0];
    }

    getKeywordDisplay(keyword) {
        const displays = {
            'Battlecry': '战吼',
            'SeverancePay': '离职补偿',
            'LegacyBug': '遗留Bug',
            'EmergencySupport': '紧急支援',
            'Scapegoat': '背锅',
            'ShiftingBlame': '甩锅',
            'Overtime': '加班',
            'Lethargic': '嗜睡',
            'PerformanceReview': '绩效考核',
            'Slacking': '摸鱼',
            'WorkplacePUA': '职场PUA'
        };
        return displays[keyword] || keyword;
    }

    onCardClick(card, index) {
        if (!this.gameEngine || !this.gameEngine.state.isPlayerTurn) return;
        
        const state = this.gameEngine.getState();
        const canPlay = this.gameEngine.canPlayCard(card, state.playerSalary, state.playerMinions);
        
        if (canPlay) {
            this.gameEngine.playCard(card, true);
        }
    }

    onMinionClick(minion, index) {
        if (!this.gameEngine || !this.gameEngine.state.isPlayerTurn) return;
        
        if (minion.canAttack && !minion.hasAttacked) {
            this.showAttackTargets(minion);
        }
    }

    showAttackTargets(attacker) {
        const state = this.gameEngine.getState();
        const targets = this.gameEngine.getAttackTargets(true);
        
        // 高亮可攻击目标
        this.highlightTargets(targets);
        
        // 为每个目标添加点击事件
        targets.forEach(target => {
            const targetElement = this.findCardElement(target.id);
            if (targetElement) {
                targetElement.addEventListener('click', () => {
                    this.gameEngine.attack(attacker, target, true);
                    this.clearHighlights();
                }, { once: true });
            }
        });
    }

    highlightTargets(targets) {
        this.clearHighlights();
        targets.forEach(target => {
            const element = this.findCardElement(target.id);
            if (element) {
                element.style.border = '3px solid #ff5252';
                element.style.boxShadow = '0 0 10px rgba(255, 82, 82, 0.5)';
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll('.card').forEach(card => {
            card.style.border = '';
            card.style.boxShadow = '';
        });
    }

    findCardElement(cardId) {
        return document.querySelector(`[data-card-id="${cardId}"]`);
    }

    showCardDetails(card) {
        const details = this.elements.cardDetails;
        
        let keywordsHtml = '';
        if (card.keywords && card.keywords.length > 0) {
            keywordsHtml = '<div style="margin-top: 10px;"><strong>关键词:</strong><br>';
            card.keywords.forEach(keyword => {
                keywordsHtml += `<span class="keyword">${this.getKeywordDisplay(keyword)}</span> `;
            });
            keywordsHtml += '</div>';
        }
        
        details.innerHTML = `
            <div><strong>${card.name}</strong></div>
            <div>稀有度: ${card.rarity}</div>
            <div>工资: ${card.cost}</div>
            <div>攻击: ${card.attack} | 生命: ${card.hp}</div>
            <div style="margin-top: 8px; font-size: 0.9em;">${card.description || ''}</div>
            ${keywordsHtml}
        `;
    }

    hideCardDetails() {
        this.elements.cardDetails.innerHTML = '<p>将鼠标悬停在卡牌上查看详情</p>';
    }

    updateEndTurnButton(state) {
        const btn = this.elements.endTurnBtn;
        btn.disabled = !state.isPlayerTurn || state.gameOver;
        
        if (state.gameOver) {
            btn.textContent = '游戏结束';
        } else if (state.isPlayerTurn) {
            btn.textContent = '结束回合';
        } else {
            btn.textContent = '对手回合';
        }
    }

    addLog(message, type = 'normal') {
        const logContainer = this.elements.gameLog;
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // 限制日志数量
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.lastChild);
        }
        
        // 自动滚动到顶部
        logContainer.scrollTop = 0;
    }

    showModal(title, message) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalMessage.textContent = message;
        this.elements.modal.classList.remove('hidden');
    }

    hideModal() {
        this.elements.modal.classList.add('hidden');
    }

    showDamageAnimation(cardElement) {
        cardElement.classList.add('card-damaged');
        setTimeout(() => {
            cardElement.classList.remove('card-damaged');
        }, 300);
    }

    showPlayAnimation(cardElement) {
        cardElement.classList.add('card-playing');
        setTimeout(() => {
            cardElement.classList.remove('card-playing');
        }, 500);
    }
}
