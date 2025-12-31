// 关卡数据配置
const LEVELS = {
    // 砖块类型定义
    BRICK_TYPES: {
        NORMAL: { health: 1, points: 10, color: '#CCCCCC' },
        BLUE: { health: 1, points: 20, color: '#2196F3' },
        GREEN: { health: 1, points: 30, color: '#4CAF50' },
        YELLOW: { health: 1, points: 40, color: '#FFEB3B' },
        RED: { health: 1, points: 50, color: '#F44336' },
        TOUGH: { health: 2, points: 30, color: '#795548' },
        EXTRA_TOUGH: { health: 3, points: 50, color: '#9C27B0' }
    },

    // 关卡配置 (1-30关) - 降低速度配置
    CONFIG: [
        // 第1-10关：简单难度 - 降低速度
        {
            rows: 4,
            cols: 8,
            brickHealth: 1,
            ballSpeed: 1.5, // 降低球速
            brickTypes: ['NORMAL', 'BLUE'],
            difficulty: '简单'
        },
        {
            rows: 4,
            cols: 9,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['NORMAL', 'BLUE', 'GREEN'],
            difficulty: '简单'
        },
        {
            rows: 5,
            cols: 8,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['BLUE', 'GREEN'],
            difficulty: '简单'
        },
        {
            rows: 5,
            cols: 9,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['NORMAL', 'BLUE', 'GREEN'],
            difficulty: '简单'
        },
        {
            rows: 5,
            cols: 10,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['GREEN', 'YELLOW'],
            difficulty: '简单'
        },
        {
            rows: 6,
            cols: 9,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['BLUE', 'GREEN', 'YELLOW'],
            difficulty: '简单'
        },
        {
            rows: 6,
            cols: 10,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['GREEN', 'YELLOW'],
            difficulty: '简单'
        },
        {
            rows: 6,
            cols: 10,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['GREEN', 'YELLOW', 'RED'],
            difficulty: '简单'
        },
        {
            rows: 7,
            cols: 9,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['YELLOW', 'RED'],
            difficulty: '简单'
        },
        {
            rows: 7,
            cols: 10,
            brickHealth: 1,
            ballSpeed: 1.5,
            brickTypes: ['BLUE', 'GREEN', 'YELLOW', 'RED'],
            difficulty: '简单'
        },

        // 第11-20关：中等难度 - 降低速度
        {
            rows: 7,
            cols: 11,
            brickHealth: 1,
            ballSpeed: 2.0, // 降低球速
            brickTypes: ['BLUE', 'GREEN', 'YELLOW', 'RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 7,
            cols: 12,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['GREEN', 'YELLOW', 'RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 8,
            cols: 11,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['YELLOW', 'RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 8,
            cols: 12,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 8,
            cols: 13,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['GREEN', 'YELLOW', 'RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 9,
            cols: 12,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['YELLOW', 'RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 9,
            cols: 13,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['RED', 'TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 9,
            cols: 13,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['RED', 'TOUGH', 'EXTRA_TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 10,
            cols: 12,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '中等'
        },
        {
            rows: 10,
            cols: 13,
            brickHealth: 1,
            ballSpeed: 2.0,
            brickTypes: ['RED', 'TOUGH', 'EXTRA_TOUGH'],
            difficulty: '中等'
        },

        // 第21-30关：困难难度 - 降低速度
        {
            rows: 10,
            cols: 14,
            brickHealth: 2,
            ballSpeed: 1.0, // 降低球速
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 10,
            cols: 15,
            brickHealth: 2,
            ballSpeed: 1.0,
            brickTypes: ['EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 11,
            cols: 14,
            brickHealth: 2,
            ballSpeed: 1.0,
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 11,
            cols: 15,
            brickHealth: 2,
            ballSpeed: 1.0,
            brickTypes: ['EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 11,
            cols: 16,
            brickHealth: 2,
            ballSpeed: 1.0,
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 12,
            cols: 15,
            brickHealth: 2,
            ballSpeed: 1.0,
            brickTypes: ['EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 12,
            cols: 16,
            brickHealth: 3,
            ballSpeed: 1.0,
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 12,
            cols: 17,
            brickHealth: 3,
            ballSpeed: 1.0,
            brickTypes: ['EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 13,
            cols: 16,
            brickHealth: 3,
            ballSpeed: 1.0,
            brickTypes: ['TOUGH', 'EXTRA_TOUGH'],
            difficulty: '困难'
        },
        {
            rows: 13,
            cols: 17,
            brickHealth: 3,
            ballSpeed: 1.0,
            brickTypes: ['EXTRA_TOUGH'],
            difficulty: '困难'
        }
    ],

    // 获取关卡配置
    getLevelConfig(level) {
        if (level < 1 || level > this.CONFIG.length) {
            return this.CONFIG[0]; // 默认返回第一关配置
        }
        return this.CONFIG[level - 1];
    },

    // 获取难度名称
    getDifficultyName(level) {
        if (level <= 10) return '简单';
        if (level <= 20) return '中等';
        return '困难';
    },

    // 获取难度颜色
    getDifficultyColor(level) {
        if (level <= 10) return '#2e7d32';
        if (level <= 20) return '#f57c00';
        return '#d32f4e';
    },

    // 生成关卡砖块
    generateBricks(level) {
        const config = this.getLevelConfig(level);
        const bricks = [];
        
        // 计算砖块布局
        const brickWidth = 70;
        const brickHeight = 20;
        const brickPadding = 5;
        const totalWidth = config.cols * (brickWidth + brickPadding) - brickPadding;
        const offsetLeft = (800 - totalWidth) / 2;
        const offsetTop = 60;

        for (let c = 0; c < config.cols; c++) {
            bricks[c] = [];
            for (let r = 0; r < config.rows; r++) {
                // 随机选择砖块类型
                const brickTypeName = config.brickTypes[Math.floor(Math.random() * config.brickTypes.length)];
                const brickType = this.BRICK_TYPES[brickTypeName];
                
                bricks[c][r] = {
                    x: c * (brickWidth + brickPadding) + offsetLeft,
                    y: r * (brickHeight + brickPadding) + offsetTop,
                    width: brickWidth,
                    height: brickHeight,
                    status: 1,
                    health: config.brickHealth * brickType.health,
                    maxHealth: config.brickHealth * brickType.health,
                    color: brickType.color,
                    points: brickType.points * config.brickHealth
                };
            }
        }

        return bricks;
    }
};
