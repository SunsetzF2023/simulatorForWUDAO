// 游戏配置文件 - 存放所有静态配置数据

// 境界体系配置
export const REALMS = [
    { name: "初出茅庐", power: 0 },
    { name: "登堂入室", power: 50 },
    { name: "三流武者", power: 150 },
    { name: "二流武者", power: 300 },
    { name: "一流武者", power: 600 },
    { name: "武道宗师", power: 1200 },
    { name: "武道圣人", power: 2400 },
    { name: "武道至尊", power: 4800 },
    { name: "武道帝皇", power: 9600 }
];

// 命格系统配置
export const DESTINIES = [
    { name: "天生神力", effect: { physique: 1.2 }, description: "体魄获取+20%" },
    { name: "聪慧过人", effect: { intelligence: 1.2 }, description: "悟性获取+20%" },
    { name: "心如止水", effect: { mind: 1.2 }, description: "心性获取+20%" },
    { name: "武学奇才", effect: { intelligence: 1.3 }, description: "悟性获取+30%" },
    { name: "铜皮铁骨", effect: { physique: 1.3 }, description: "体魄获取+30%" },
    { name: "道心坚定", effect: { mind: 1.3 }, description: "心性获取+30%" },
    { name: "均衡发展", effect: { physique: 1.1, intelligence: 1.1, mind: 1.1 }, description: "全属性+10%" },
    { name: "武痴", effect: { power: 1.2 }, description: "战力成长+20%" }
];

// 属性名称映射
export const STAT_NAMES = {
    physique: '体魄',
    intelligence: '悟性',
    mind: '心性',
    power: '战力'
};

// 季节名称映射
export const SEASONS = ['春', '夏', '秋', '冬'];

// 游戏基础配置
export const GAME_CONFIG = {
    INITIAL_AGE: 16,
    INITIAL_LIFESPAN: 80,
    INITIAL_STATS: {
        physique: 10,
        intelligence: 10,
        mind: 10
    },
    QUARTER_MONTHS: 3,
    CULTIVATION_MONTHS: 3,
    KARMA_UPGRADE_COST: 10,
    KARMA_UPGRADE_AMOUNT: 5,
    LOG_MAX_ENTRIES: 50
};

// 轮回点计算配置
export const KARMA_CONFIG = {
    REALM_WEIGHT_MULTIPLIER: 10,
    SURVIVAL_BONUS_MULTIPLIER: 2
};
