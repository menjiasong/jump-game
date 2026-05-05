/// <reference path="lib/LayaAir.d.ts" />

/** 主游戏：初始化、关卡创建、游戏循环、计分 */
class GameMain {

    private player!: Player;
    private platforms: Platform[] = [];
    private score: number = 0;
    private highScore: number = 0;
    private scoreText!: Laya.Text;
    private infoText!: Laya.Text;
    private gameOverText!: Laya.Text;

    private stageW: number = 960;
    private stageH: number = 640;
    private timer: number = 0;

    constructor() {
        // LayaAir 3.x: init 返回 Promise，等待完成后再初始化游戏
        Laya.init(this.stageW, this.stageH).then(() => {
            this.onEngineReady();
        });
    }

    private onEngineReady(): void {
        Laya.stage.bgColor = "#1a1a2e";
        Laya.stage.scaleMode = "showall";

        this.drawBackground();
        this.createPlatforms();
        this.createPlayer();
        this.createUI();

        // 输入监听
        Laya.stage.on("keydown", this, this.onKeyDown);
        Laya.stage.on("keyup", this, this.onKeyUp);

        // 游戏循环 - 60fps
        Laya.timer.frameLoop(1, this, this.gameLoop);
    }

    /** 绘制像素风背景 */
    private drawBackground(): void {
        const bg = new Laya.Sprite();
        const g = bg.graphics;

        // 天空渐变 (用多条色带模拟)
        const skyColors = ["#1a1a2e", "#16213e", "#0f3460", "#1a1a4e",
            "#1a1a2e", "#16213e", "#0f3460", "#1a1a4e"];
        const bandH = Math.ceil(this.stageH / skyColors.length);
        for (let i = 0; i < skyColors.length; i++) {
            g.drawRect(0, i * bandH, this.stageW, bandH + 1, skyColors[i], null, 0);
        }

        // 星星
        for (let i = 0; i < 40; i++) {
            const sx = (i * 137 + 31) % this.stageW;
            const sy = (i * 97 + 17) % (this.stageH * 0.65);
            const brightness = 140 + (i % 5) * 25;
            const c = '#' +
                brightness.toString(16).padStart(2, '0') +
                brightness.toString(16).padStart(2, '0') +
                (brightness + 20).toString(16).padStart(2, '0');
            g.drawRect(sx, sy, 2, 2, c, null, 0);
        }

        Laya.stage.addChild(bg);
    }

    /** 创建地面和平台 */
    private createPlatforms(): void {
        // 主地面
        const ground = new Platform(0, this.stageH - 24, this.stageW, "#3d5a1e");
        this.platforms.push(ground);

        // 各层平台 (颜色、位置、宽度各有不同)
        const platformDefs: [number, number, number, string, boolean][] = [
            [80, 500, 160, "#8B5E3C", false],
            [300, 430, 140, "#7B6B4A", false],
            [560, 370, 150, "#9B6E4A", false],
            [160, 310, 130, "#6B7B5A", false],
            [450, 260, 180, "#8B5E3C", false],
            [680, 200, 200, "#7B6B4A", false],
            [100, 160, 150, "#9B6E4A", true],   // 可穿透平台
            [380, 120, 160, "#6B7B5A", true],    // 可穿透平台
            [600, 80, 140, "#8B5E3C", true],     // 可穿透平台
        ];

        for (const def of platformDefs) {
            const p = new Platform(def[0], def[1], def[2], def[3], def[4]);
            this.platforms.push(p);
            Laya.stage.addChild(p.sprite);
        }

        // 地面最后绘制 (在最上层视觉上)
        Laya.stage.addChild(ground.sprite);
    }

    private createPlayer(): void {
        this.player = new Player();
        Laya.stage.addChild(this.player.sprite);
    }

    private createUI(): void {
        // 分数
        this.scoreText = new Laya.Text();
        this.scoreText.text = "SCORE: 0";
        this.scoreText.fontSize = 20;
        this.scoreText.color = "#ffffff";
        this.scoreText.font = "monospace";
        this.scoreText.bold = true;
        this.scoreText.pos(16, 12);
        Laya.stage.addChild(this.scoreText);

        // 操作提示
        this.infoText = new Laya.Text();
        this.infoText.text = "A/D 移动    SPACE 跳跃";
        this.infoText.fontSize = 14;
        this.infoText.color = "#aaaacc";
        this.infoText.font = "monospace";
        this.infoText.pos(16, this.stageH - 48);
        Laya.stage.addChild(this.infoText);

        // 游戏结束文本 (初始隐藏)
        this.gameOverText = new Laya.Text();
        this.gameOverText.text = "";
        this.gameOverText.fontSize = 28;
        this.gameOverText.color = "#ff6666";
        this.gameOverText.font = "monospace";
        this.gameOverText.bold = true;
        this.gameOverText.align = "center";
        this.gameOverText.pos(this.stageW / 2 - 100, this.stageH / 2 - 20);
        Laya.stage.addChild(this.gameOverText);
    }

    /** 游戏主循环 */
    private gameLoop(): void {
        this.timer++;

        // 更新玩家
        this.player.update(this.platforms);

        // 分数 (每帧+1，站在高处额外加分)
        const heightBonus = Math.max(0, Math.floor((this.stageH - 24 - this.player.bottom) / 10));
        this.score += 1 + heightBonus;

        // 每 6 帧更新 UI
        if (this.timer % 6 === 0) {
            this.scoreText.text = "SCORE: " + this.score;
            if (this.score > this.highScore) {
                this.highScore = this.score;
            }
        }

        // 检测掉落
        if (this.player.y > 680) {
            this.gameOverText.text = "GAME OVER\n\n按 R 重新开始";
            this.infoText.text = "最高分: " + this.highScore;
        } else {
            if (this.gameOverText.text !== "") {
                this.gameOverText.text = "";
            }
        }
    }

    private onKeyDown(e: any): void {
        const code = e.keyCode || e.key;
        if (code === 82 /*R*/) { this.resetGame(); return; }
        this.player.onKeyDown(code);
    }

    private onKeyUp(e: any): void {
        this.player.onKeyUp(e.keyCode || e.key);
    }

    private resetGame(): void {
        this.player.reset();
        this.score = 0;
        this.timer = 0;
        this.gameOverText.text = "";
        this.scoreText.text = "SCORE: 0";
        this.infoText.text = "A/D 移动    SPACE 跳跃";
    }
}

// 启动游戏
(function () {
    new GameMain();
})();
