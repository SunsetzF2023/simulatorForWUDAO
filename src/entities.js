// 卡牌实体和工厂类

export class Card {
    constructor(data) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = data.Card_Name;
        this.rarity = data.Rarity;
        this.faction = data.Faction;
        this.cost = data.Salary;
        this.attack = data.Stats.ATK;
        this.hp = data.Stats.HP;
        this.maxHp = data.Stats.HP;
        this.abilities = data.Abilities;
        this.description = data.description || '';
        this.canAttack = false;
        this.hasAttacked = false;
        this.sleeping = false;
        this.immune = false;
        this.keywords = this.parseKeywords();
    }

    parseKeywords() {
        const keywords = [];
        const abilities = this.abilities.Passive + ' ' + this.abilities.Active;
        
        if (abilities.includes('Battlecry')) keywords.push('Battlecry');
        if (abilities.includes('SeverancePay')) keywords.push('SeverancePay');
        if (abilities.includes('LegacyBug')) keywords.push('LegacyBug');
        if (abilities.includes('EmergencySupport')) keywords.push('EmergencySupport');
        if (abilities.includes('Scapegoat')) keywords.push('Scapegoat');
        if (abilities.includes('ShiftingBlame')) keywords.push('ShiftingBlame');
        if (abilities.includes('Overtime')) keywords.push('Overtime');
        if (abilities.includes('Lethargic')) keywords.push('Lethargic');
        if (abilities.includes('PerformanceReview')) keywords.push('PerformanceReview');
        if (abilities.includes('Slacking')) keywords.push('Slacking');
        if (abilities.includes('WorkplacePUA')) keywords.push('WorkplacePUA');
        
        return keywords;
    }

    takeDamage(damage) {
        if (this.immune) return 0;
        
        const actualDamage = Math.max(0, damage);
        this.hp -= actualDamage;
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.triggerDeathrattle();
        }
        
        return actualDamage;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    triggerDeathrattle() {
        // 处理离职补偿等死亡触发效果
        if (this.keywords.includes('SeverancePay')) {
            // 正面死亡效果
            console.log(`${this.name} 触发离职补偿效果`);
        }
        if (this.keywords.includes('LegacyBug')) {
            // 负面死亡效果
            console.log(`${this.name} 触发遗留Bug效果`);
        }
    }

    clone() {
        const cloned = new Card({
            Card_Name: this.name,
            Rarity: this.rarity,
            Faction: [...this.faction],
            Salary: this.cost,
            Stats: { ATK: this.attack, HP: this.maxHp },
            Abilities: { ...this.abilities },
            description: this.description
        });
        cloned.hp = this.hp;
        cloned.canAttack = this.canAttack;
        cloned.hasAttacked = this.hasAttacked;
        cloned.sleeping = this.sleeping;
        cloned.immune = this.immune;
        return cloned;
    }

    getRarityColor() {
        const colors = {
            'Common': '#757575',
            'Uncommon': '#4caf50',
            'Rare': '#2196f3',
            'SuperRare': '#9c27b0',
            'Epic': '#ff5722',
            'Mythic': '#795548',
            'Legendary': '#ff9800'
        };
        return colors[this.rarity] || '#757575';
    }
}

export class Hero {
    constructor(name, hp) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.armor = 0;
    }

    takeDamage(damage) {
        const actualDamage = Math.max(0, damage - this.armor);
        this.hp -= actualDamage;
        return actualDamage;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    gainArmor(amount) {
        this.armor += amount;
    }
}

export class CardFactory {
    static async loadCards() {
        try {
            const response = await fetch('data/cards.json');
            const data = await response.json();
            return data.cards.map(cardData => new Card(cardData));
        } catch (error) {
            console.error('加载卡牌数据失败:', error);
            return [];
        }
    }

    static createStarterDeck() {
        // 创建基础卡组（临时实现，后续从卡牌数据库中随机选择）
        return [
            new Card({
                Card_Name: "Basic Staff",
                Rarity: "Common",
                Faction: ["Ops"],
                Salary: 1,
                Stats: { ATK: 1, HP: 1 },
                Abilities: { Passive: "None", Active: "None" },
                description: "普通办公室职员，职场炮灰"
            })
        ];
    }

    static getRandomCard(cardPool) {
        if (!cardPool || cardPool.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * cardPool.length);
        return cardPool[randomIndex].clone();
    }
}
