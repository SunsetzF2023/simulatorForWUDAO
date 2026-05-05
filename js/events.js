// 事件库文件 - 存放所有游戏事件

export const EVENTS = {
    childhood: [
        {
            text: "你在村口看到老武师教导弟子，是否上前观摩？",
            choices: [
                { text: "认真学习", requirement: { intelligence: 5 }, effect: { intelligence: 2 } },
                { text: "暗中模仿", requirement: { mind: 8 }, effect: { mind: 1, intelligence: 1 } },
                { text: "直接拜师", requirement: {}, effect: { physique: 1, intelligence: 1 } }
            ]
        },
        {
            text: "山中采药时发现一株稀有草药，如何处理？",
            choices: [
                { text: "仔细研究", requirement: { intelligence: 10 }, effect: { intelligence: 3 } },
                { text: "直接服用", requirement: { physique: 8 }, effect: { physique: 2 } },
                { text: "卖掉换钱", requirement: {}, effect: { mind: 2 } }
            ]
        },
        {
            text: "村中举办武艺比试，你是否参加？",
            choices: [
                { text: "全力比试", requirement: { physique: 12 }, effect: { physique: 3, power: 5 } },
                { text: "观摩学习", requirement: { intelligence: 8 }, effect: { intelligence: 2 } },
                { text: "暗中练习", requirement: { mind: 10 }, effect: { mind: 2, physique: 1 } }
            ]
        },
        {
            text: "遇到受伤的小动物，如何处理？",
            choices: [
                { text: "细心照料", requirement: { mind: 15 }, effect: { mind: 3 } },
                { text: "学习医术", requirement: { intelligence: 12 }, effect: { intelligence: 3 } },
                { text: "顺其自然", requirement: {}, effect: { mind: 1 } }
            ]
        },
        {
            text: "老者传授吐纳之法，是否学习？",
            choices: [
                { text: "刻苦修炼", requirement: { mind: 10 }, effect: { mind: 2, physique: 1 } },
                { text: "请教原理", requirement: { intelligence: 15 }, effect: { intelligence: 3 } },
                { text: "浅尝辄止", requirement: {}, effect: { physique: 1 } }
            ]
        }
    ],
    youth: [
        {
            text: "江湖中听闻有秘籍出世，你是否前往争夺？",
            choices: [
                { text: "全力争夺", requirement: { physique: 20 }, effect: { physique: 5, power: 10 } },
                { text: "智取秘籍", requirement: { intelligence: 25 }, effect: { intelligence: 5, power: 8 } },
                { text: "观望时机", requirement: { mind: 20 }, effect: { mind: 3, power: 5 } }
            ]
        },
        {
            text: "遇到受伤的武者，是否出手相助？",
            choices: [
                { text: "全力救治", requirement: { mind: 15 }, effect: { mind: 4 } },
                { text: "趁机夺宝", requirement: { physique: 18 }, effect: { physique: 3, power: 5 } },
                { text: "默默离开", requirement: {}, effect: { mind: 1 } }
            ]
        },
        {
            text: "武馆招收弟子，你是否应征？",
            choices: [
                { text: "展现实力", requirement: { power: 30 }, effect: { power: 15, physique: 3 } },
                { text: "表现悟性", requirement: { intelligence: 20 }, effect: { intelligence: 4 } },
                { text: "谦逊求学", requirement: { mind: 18 }, effect: { mind: 3, intelligence: 2 } }
            ]
        },
        {
            text: "发现神秘洞穴，是否探索？",
            choices: [
                { text: "勇闯洞穴", requirement: { physique: 25 }, effect: { physique: 4, power: 8 } },
                { text: "破解机关", requirement: { intelligence: 30 }, effect: { intelligence: 5, power: 6 } },
                { text: "谨慎探索", requirement: { mind: 22 }, effect: { mind: 3, power: 4 } }
            ]
        },
        {
            text: "武林前辈指点，如何应对？",
            choices: [
                { text: "虚心求教", requirement: { mind: 20 }, effect: { intelligence: 3, mind: 2 } },
                { text: "切磋武艺", requirement: { physique: 28 }, effect: { physique: 3, power: 6 } },
                { text: "请教心得", requirement: { intelligence: 25 }, effect: { intelligence: 4, mind: 1 } }
            ]
        }
    ],
    adult: [
        {
            text: "武林大会召开，你是否参加？",
            choices: [
                { text: "挑战高手", requirement: { power: 100 }, effect: { power: 20, physique: 5 } },
                { text: "观摩学习", requirement: { intelligence: 30 }, effect: { intelligence: 8 } },
                { text: "结交豪杰", requirement: { mind: 25 }, effect: { mind: 6, power: 10 } }
            ]
        },
        {
            text: "发现古洞府遗迹，是否探索？",
            choices: [
                { text: "勇闯洞府", requirement: { physique: 40 }, effect: { power: 30, physique: 10 } },
                { text: "破解机关", requirement: { intelligence: 45 }, effect: { intelligence: 12, power: 25 } },
                { text: "谨慎探索", requirement: { mind: 35 }, effect: { mind: 8, power: 15 } }
            ]
        },
        {
            text: "魔教入侵，如何应对？",
            choices: [
                { text: "挺身而出", requirement: { power: 80 }, effect: { power: 25, mind: 5 } },
                { text: "智退敌军", requirement: { intelligence: 50 }, effect: { intelligence: 10, power: 15 } },
                { text: "保护百姓", requirement: { mind: 40 }, effect: { mind: 8, physique: 3 } }
            ]
        },
        {
            text: "神兵利器现世，是否争夺？",
            choices: [
                { text: "力压群雄", requirement: { physique: 60 }, effect: { physique: 8, power: 20 } },
                { text: "智取神兵", requirement: { intelligence: 55 }, effect: { intelligence: 10, power: 18 } },
                { text: "顺势而为", requirement: { mind: 45 }, effect: { mind: 6, power: 12 } }
            ]
        },
        {
            text: "宗门邀请，如何选择？",
            choices: [
                { text: "加入宗门", requirement: { power: 70 }, effect: { power: 15, intelligence: 5 } },
                { text: "婉言谢绝", requirement: { mind: 35 }, effect: { mind: 8 } },
                { text: "保持中立", requirement: {}, effect: { intelligence: 3, mind: 3 } }
            ]
        }
    ],
    elder: [
        {
            text: "年轻武者前来挑战，如何应对？",
            choices: [
                { text: "全力应战", requirement: { power: 200 }, effect: { power: 15 } },
                { text: "指点后辈", requirement: { intelligence: 50 }, effect: { mind: 10, intelligence: 5 } },
                { text: "婉言谢绝", requirement: { mind: 40 }, effect: { mind: 8 } }
            ]
        },
        {
            text: "感悟天道，寻求突破之道",
            choices: [
                { text: "闭关修炼", requirement: { mind: 60 }, effect: { power: 40, realmProgress: 10 } },
                { text: "游历天下", requirement: { physique: 50 }, effect: { mind: 15, power: 20 } },
                { text: "传授武学", requirement: { intelligence: 55 }, effect: { intelligence: 10, mind: 10 } }
            ]
        },
        {
            text: "武道瓶颈，如何突破？",
            choices: [
                { text: "生死历练", requirement: { physique: 70 }, effect: { power: 35, physique: 5 } },
                { text: "静心参悟", requirement: { mind: 65 }, effect: { mind: 15, power: 25 } },
                { text: "博采众长", requirement: { intelligence: 60 }, effect: { intelligence: 12, power: 20 } }
            ]
        },
        {
            text: "传承武学，如何选择传人？",
            choices: [
                { text: "严格考验", requirement: { mind: 70 }, effect: { mind: 12, intelligence: 8 } },
                { text: "因材施教", requirement: { intelligence: 65 }, effect: { intelligence: 15, mind: 5 } },
                { text: "顺其自然", requirement: {}, effect: { mind: 6 } }
            ]
        },
        {
            text: "武道巅峰，何去何从？",
            choices: [
                { text: "追求极致", requirement: { power: 300 }, effect: { power: 50, realmProgress: 15 } },
                { text: "回归平淡", requirement: { mind: 80 }, effect: { mind: 20 } },
                { text: "开宗立派", requirement: { intelligence: 70 }, effect: { intelligence: 18, power: 30 } }
            ]
        }
    ]
};

// 获取对应年龄段的事件池
export function getEventPool(age) {
    if (age < 20) return EVENTS.childhood;
    if (age < 40) return EVENTS.youth;
    if (age < 60) return EVENTS.adult;
    return EVENTS.elder;
}

// 随机获取一个事件
export function getRandomEvent(age) {
    const eventPool = getEventPool(age);
    return eventPool[Math.floor(Math.random() * eventPool.length)];
}
