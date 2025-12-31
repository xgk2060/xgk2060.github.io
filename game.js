// 游戏主逻辑
class BrickBreakerGame {
    constructor() {
        // 游戏元素
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 5; // 增加生命值，降低难度
        this.gameMode = 'level'; // 现在只有关卡模式
        
        // 速度系统 - 降低速度
        this.baseSpeed = 3; // 降低基础速度
        this.currentSpeedMultiplier = 1.0; // 当前速度倍数
        this.maxSpeedMultiplier = 2.0; // 降低最大速度倍数
        this.speedIncreaseInterval = 30; // 每30秒增加一次速度
        this.lastSpeedIncreaseTime = 0; // 上次增加速度的时间
        this.levelBricksDestroyed = 0; // 当前关卡击碎的砖块数
        
        // 游戏元素
        this.paddle = {
            x: this.canvas.width / 2 - 60,
            y: this.canvas.height - 20,
            width: 140, // 增加挡板宽度
            height: 15,
            speed: 6, // 降低挡板移动速度
            color: '#e94560'
        };
        
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 35,
            radius: 10,
            speedX: 3, // 降低初始速度
            speedY: -3, // 降低初始速度
            color: '#ffffff'
        };
        
        // 砖块
        this.bricks = [];
        this.brickConfig = {
            width: 70,
            height: 20,
            padding: 5,
            offsetTop: 60
        };
        
        // 键盘控制状态
        this.rightPressed = false;
        this.leftPressed = false;
        
        // 游戏循环
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0; // 游戏运行时间
        
        // 初始化
        this.init();
    }

    // 初始化游戏
    init() {
        // 初始化关卡选择器
        this.initLevelSelector();
        
        // 初始化事件监听器
        this.initEventListeners();
        
        // 初始化游戏元素
        this.resetGame();
        
        // 更新难度显示
        this.updateDifficultyDisplay();
        
        // 开始游戏循环
        this.gameLoop(0);
    }

    // 初始化关卡选择器
    initLevelSelector() {
        const levelButtonsContainer = document.getElementById('levelButtons');
        levelButtonsContainer.innerHTML = '';
        
        for (let i = 1; i <= 30; i++) {
            const button = document.createElement('button');
            button.className = 'level-btn';
            button.textContent = i;
            button.dataset.level = i;
            
            // 根据难度设置颜色
            if (i <= 10) {
                button.classList.add('easy');
            } else if (i <= 20) {
                button.classList.add('medium');
            } else {
                button.classList.add('hard');
            }
            
            button.addEventListener('click', () => {
                this.selectLevel(i);
            });
            
            levelButtonsContainer.appendChild(button);
        }
    }

    // 选择关卡
    selectLevel(level) {
        if (!this.gameRunning) return;
        
        this.currentLevel = level;
        document.getElementById('currentLevel').textContent = level;
        this.resetGame();
        this.generateBricks();
        
        // 更新按钮状态
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === level) {
                btn.classList.add('active');
            }
        });
        
        // 更新难度显示
        this.updateDifficultyDisplay();
    }

    // 生成砖块
    generateBricks() {
        this.bricks = LEVELS.generateBricks(this.currentLevel);
        // 根据关卡难度设置基础速度
        this.setLevelSpeed();
    }

    // 设置关卡速度
    setLevelSpeed() {
        const config = LEVELS.getLevelConfig(this.currentLevel);
        this.baseSpeed = config.ballSpeed;
        
        // 重置速度倍数
        this.currentSpeedMultiplier = 1.0;
        this.levelBricksDestroyed = 0;
        
        // 根据关卡难度设置不同的速度增加规则
        if (this.currentLevel <= 10) {
            // 简单关卡：每击碎6个砖块速度增加3%
            this.speedIncreasePerBrick = 0.03;
            this.bricksPerSpeedIncrease = 6;
        } else if (this.currentLevel <= 20) {
            // 中等关卡：每击碎5个砖块速度增加4%
            this.speedIncreasePerBrick = 0.04;
            this.bricksPerSpeedIncrease = 5;
        } else {
            // 困难关卡：每击碎4个砖块速度增加5%
            this.speedIncreasePerBrick = 0.05;
            this.bricksPerSpeedIncrease = 4;
        }
    }

    // 重置速度系统
    resetSpeedSystem() {
        this.currentSpeedMultiplier = 1.0;
        this.gameTime = 0;
        this.lastSpeedIncreaseTime = 0;
        this.levelBricksDestroyed = 0;
        
        // 根据当前关卡设置基础速度
        const config = LEVELS.getLevelConfig(this.currentLevel);
        this.baseSpeed = config.ballSpeed;
    }

    // 增加速度
    increaseSpeed() {
        if (this.currentSpeedMultiplier < this.maxSpeedMultiplier) {
            this.currentSpeedMultiplier += this.speedIncreasePerBrick;
            
            // 限制最大速度倍数
            if (this.currentSpeedMultiplier > this.maxSpeedMultiplier) {
                this.currentSpeedMultiplier = this.maxSpeedMultiplier;
            }
            
            return true;
        }
        return false;
    }

    // 更新速度系统
    updateSpeedSystem() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        this.gameTime += this.deltaTime / 1000; // 转换为秒
    }

    // 初始化事件监听器
    initEventListeners() {
        // 键盘控制 - 按下
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'Right':
                    this.rightPressed = true;
                    break;
                case 'ArrowLeft':
                case 'Left':
                    this.leftPressed = true;
                    break;
                case ' ':
                    e.preventDefault(); // 防止空格键滚动页面
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.resetGame();
                    break;
                case 'n':
                case 'N':
                    if (this.gameRunning && !this.gamePaused) {
                        this.nextLevel();
                    }
                    break;
            }
        });
        
        // 键盘控制 - 释放
        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'Right':
                    this.rightPressed = false;
                    break;
                case 'ArrowLeft':
                case 'Left':
                    this.leftPressed = false;
                    break;
            }
        });
        
        // 按钮事件
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartLevelBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
    }

    // 开始游戏
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.gamePaused = false;
        
        document.getElementById('startOverlay').style.display = 'none';
        document.getElementById('pauseOverlay').style.display = 'none';
        document.getElementById('gameOverOverlay').style.display = 'none';
        
        this.resetGame();
        
        // 更新难度显示
        this.updateDifficultyDisplay();
    }

    // 重置游戏
    resetGame() {
        this.score = 0;
        this.lives = 5; // 重置为5条命
        this.gameOver = false;
        
        // 重置速度系统
        this.resetSpeedSystem();
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        
        this.resetBallAndPaddle();
        this.generateBricks();
        
        // 重置键盘状态
        this.rightPressed = false;
        this.leftPressed = false;
        
        // 更新难度显示
        this.updateDifficultyDisplay();
        
        document.getElementById('gameOverOverlay').style.display = 'none';
    }

    // 重置球和挡板
    resetBallAndPaddle() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 35;
        
        // 根据当前速度和倍数设置球速
        const currentSpeed = this.baseSpeed * this.currentSpeedMultiplier;
        this.ball.speedX = (Math.random() > 0.5 ? 1 : -1) * currentSpeed;
        this.ball.speedY = -currentSpeed;
        
        this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
        this.paddle.y = this.canvas.height - 20;
    }

    // 暂停/继续游戏
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            document.getElementById('pauseOverlay').style.display = 'flex';
        } else {
            document.getElementById('pauseOverlay').style.display = 'none';
        }
    }

    // 下一关
    nextLevel() {
        if (!this.gameRunning || this.gameOver) return;
        
        if (this.currentLevel < 30) {
            this.currentLevel++;
            document.getElementById('currentLevel').textContent = this.currentLevel;
            
            // 更新按钮状态
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.classList.remove('active');
                if (parseInt(btn.dataset.level) === this.currentLevel) {
                    btn.classList.add('active');
                }
            });
            
            this.resetGame();
            this.generateBricks();
            
            // 更新难度显示
            this.updateDifficultyDisplay();
        }
    }

    // 更新难度显示
    updateDifficultyDisplay() {
        const difficulty = LEVELS.getDifficultyName(this.currentLevel);
        document.getElementById('gameDifficulty').textContent = difficulty;
    }

    // 绘制游戏元素
    drawPaddle() {
        // 绘制挡板主体
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.fill();
        this.ctx.closePath();
        
        // 添加高光效果
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, 4);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
        
        // 绘制控制提示
        if (this.gameRunning && !this.gamePaused && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('← 方向键 →', this.paddle.x + this.paddle.width / 2, this.paddle.y - 5);
        }
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ball.color;
        this.ctx.fill();
        this.ctx.closePath();
        
        // 添加高光效果
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - this.ball.radius/3, this.ball.y - this.ball.radius/3, this.ball.radius/3, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fill();
        this.ctx.closePath();
        
        // 在球上绘制速度指示器
        if (this.gameRunning && !this.gamePaused && !this.gameOver && this.currentSpeedMultiplier > 1.1) {
            const speedLevel = Math.min(5, Math.floor(this.currentSpeedMultiplier));
            this.ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⚡'.repeat(speedLevel), this.ball.x, this.ball.y + this.ball.radius + 15);
        }
    }

    drawBricks() {
        for (let col of this.bricks) {
            for (let brick of col) {
                if (brick && brick.status === 1) {
                    // 绘制砖块
                    this.ctx.beginPath();
                    this.ctx.rect(brick.x, brick.y, brick.width, brick.height);
                    this.ctx.fillStyle = brick.color;
                    this.ctx.fill();
                    this.ctx.closePath();
                    
                    // 绘制边框
                    this.ctx.beginPath();
                    this.ctx.rect(brick.x, brick.y, brick.width, brick.height);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.closePath();
                    
                    // 绘制生命值（如果需要）
                    if (brick.health > 1) {
                        this.ctx.fillStyle = 'white';
                        this.ctx.font = '12px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(brick.health, brick.x + brick.width/2, brick.y + brick.height/2 + 4);
                    }
                }
            }
        }
    }

    // 碰撞检测
    collisionDetection() {
        for (let col of this.bricks) {
            for (let brick of col) {
                if (brick && brick.status === 1) {
                    if (
                        this.ball.x + this.ball.radius > brick.x &&
                        this.ball.x - this.ball.radius < brick.x + brick.width &&
                        this.ball.y + this.ball.radius > brick.y &&
                        this.ball.y - this.ball.radius < brick.y + brick.height
                    ) {
                        // 减少砖块生命值
                        brick.health--;
                        
                        if (brick.health <= 0) {
                            brick.status = 0;
                            this.levelBricksDestroyed++;
                            
                            // 关卡模式：速度越快得分越高
                            const basePoints = brick.points;
                            const speedBonus = Math.floor(basePoints * (this.currentSpeedMultiplier - 1) * 0.3);
                            this.score += basePoints + speedBonus;
                            
                            document.getElementById('score').textContent = this.score;
                            
                            // 检查是否清除了所有砖块
                            this.checkLevelComplete();
                            
                            // 检查是否需要增加速度
                            this.checkSpeedIncrease();
                        }
                        
                        // 改变球的运动方向
                        this.ball.speedY = -this.ball.speedY;
                    }
                }
            }
        }
    }

    // 检查速度增加
    checkSpeedIncrease() {
        // 关卡模式：根据击碎的砖块数增加速度
        if (this.levelBricksDestroyed % this.bricksPerSpeedIncrease === 0) {
            if (this.increaseSpeed()) {
                // 速度增加效果提示
                this.showSpeedIncreaseEffect();
            }
        }
    }

    // 显示速度增加效果
    showSpeedIncreaseEffect() {
        // 可以在球周围显示特效（这里简化处理）
        console.log(`速度提升！当前速度倍数: ${this.currentSpeedMultiplier.toFixed(2)}`);
    }

    // 检查关卡是否完成
    checkLevelComplete() {
        let allBricksCleared = true;
        
        for (let col of this.bricks) {
            for (let brick of col) {
                if (brick && brick.status === 1) {
                    allBricksCleared = false;
                    break;
                }
            }
            if (!allBricksCleared) break;
        }
        
        if (allBricksCleared) {
            // 关卡模式：进入下一关
            if (this.currentLevel < 30) {
                // 完成当前关卡，显示速度倍数奖励分
                const speedBonus = Math.floor(this.score * (this.currentSpeedMultiplier - 1) * 0.2);
                this.score += speedBonus;
                document.getElementById('score').textContent = this.score;
                
                this.currentLevel++;
                document.getElementById('currentLevel').textContent = this.currentLevel;
                
                // 更新按钮状态
                document.querySelectorAll('.level-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (parseInt(btn.dataset.level) === this.currentLevel) {
                        btn.classList.add('active');
                    }
                });
                
                // 更新难度显示
                this.updateDifficultyDisplay();
                
                // 重置游戏状态
                this.resetBallAndPaddle();
                this.generateBricks();
            } else {
                // 完成所有关卡
                this.gameOver = true;
                document.getElementById('gameOverTitle').textContent = "恭喜！";
                document.getElementById('gameOverSubtitle').textContent = "你完成了所有关卡！";
                document.getElementById('gameOverMessage').textContent = 
                    `最终得分: ${this.score}\n最高速度倍数: ${this.currentSpeedMultiplier.toFixed(2)}x`;
                document.getElementById('gameOverOverlay').style.display = 'flex';
            }
        }
    }

    // 绘制背景
    drawBackground() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // 绘制游戏信息
    drawGameInfo() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 20, 30);
        this.ctx.fillText(`生命: ${this.lives}`, 20, 55);
        
        // 绘制速度信息
        if (this.currentSpeedMultiplier > 1.0) {
            this.ctx.fillStyle = this.getSpeedColor();
            this.ctx.fillText(`速度: x${this.currentSpeedMultiplier.toFixed(2)}`, this.canvas.width - 120, 30);
        } else {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText(`速度: x1.00`, this.canvas.width - 120, 30);
        }
        
        this.ctx.fillText(`关卡: ${this.currentLevel}/30`, this.canvas.width - 120, 55);
    }

    // 根据速度获取颜色
    getSpeedColor() {
        if (this.currentSpeedMultiplier < 1.5) {
            return 'rgba(76, 175, 80, 0.9)'; // 绿色
        } else if (this.currentSpeedMultiplier < 2.0) {
            return 'rgba(255, 193, 7, 0.9)'; // 黄色
        } else if (this.currentSpeedMultiplier < 2.5) {
            return 'rgba(255, 152, 0, 0.9)'; // 橙色
        } else {
            return 'rgba(244, 67, 54, 0.9)'; // 红色
        }
    }

    // 绘制游戏
    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制游戏元素
        this.drawBricks();
        this.drawPaddle();
        this.drawBall();
        
        // 绘制游戏信息
        this.drawGameInfo();
    }

    // 更新游戏状态
    update() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        // 更新速度系统
        this.updateSpeedSystem();
        
        // 移动球
        this.ball.x += this.ball.speedX * this.currentSpeedMultiplier;
        this.ball.y += this.ball.speedY * this.currentSpeedMultiplier;
        
        // 边界碰撞检测
        if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.speedX = -this.ball.speedX;
        }
        
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.speedY = -this.ball.speedY;
        }
        
        // 球落到底部
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.lives--;
            document.getElementById('lives').textContent = this.lives;
            
            if (this.lives <= 0) {
                this.gameOver = true;
                const finalSpeed = this.currentSpeedMultiplier.toFixed(2);
                document.getElementById('gameOverTitle').textContent = "游戏结束";
                document.getElementById('gameOverSubtitle').textContent = "生命值已用完";
                document.getElementById('gameOverMessage').textContent = 
                    `最终得分: ${this.score}\n最高速度: ${finalSpeed}x`;
                document.getElementById('gameOverOverlay').style.display = 'flex';
            } else {
                this.resetBallAndPaddle();
            }
        }
        
        // 球与挡板碰撞检测
        if (
            this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width
        ) {
            // 根据击中挡板的位置改变反弹角度
            let hitPoint = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
            this.ball.speedX = hitPoint * 5 * this.currentSpeedMultiplier; // 降低反弹力度
            this.ball.speedY = -Math.abs(this.ball.speedY);
        }
        
        // 移动挡板 - 仅键盘控制
        if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        } else if (this.leftPressed && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        
        // 碰撞检测
        this.collisionDetection();
        
        // 绘制游戏
        this.draw();
    }

    // 游戏主循环
    gameLoop(timestamp) {
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new BrickBreakerGame();
});
