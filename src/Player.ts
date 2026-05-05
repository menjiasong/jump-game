/// <reference path="lib/LayaAir.d.ts" />

/** 玩家角色：支持左右移动、跳跃、重力 */
class Player {

    sprite: Laya.Sprite;

    x: number = 400;
    y: number = 520;
    width: number = 44;
    height: number = 56;

    vx: number = 0;
    vy: number = 0;

    speed: number = 6;
    jumpForce: number = 13;
    gravity: number = 0.7;
    maxFallSpeed: number = 15;

    isGrounded: boolean = false;
    facingRight: boolean = true;

    private _moveLeft: boolean = false;
    private _moveRight: boolean = false;
    private _jumpPressed: boolean = false;
    private _jumpWasPressed: boolean = false;

    constructor() {
        this.sprite = new Laya.Sprite();
        this.drawCharacter();
        this.sprite.pos(this.x, this.y);
    }

    /** 绘制像素风格小人 */
    private drawCharacter(): void {
        const g = this.sprite.graphics;
        const w = this.width;
        const h = this.height;

        // --- 身体 (蓝色) ---
        g.drawRect(6, 16, w - 12, h - 22, "#4488cc", "#336699", 1);

        // --- 头 (肤色) ---
        g.drawRect(10, 2, w - 16, 16, "#ffcc88", "#dd9966", 1);

        // --- 头发 ---
        g.drawRect(10, 2, w - 16, 6, "#664422", "#442200", 1);

        // --- 眼睛 (白) ---
        g.drawRect(22, 7, 6, 5, "#ffffff", null, 0);
        g.drawRect(32, 7, 6, 5, "#ffffff", null, 0);

        // --- 瞳孔 ---
        g.drawRect(25, 8, 3, 3, "#222222", null, 0);
        g.drawRect(35, 8, 3, 3, "#222222", null, 0);

        // --- 腿 ---
        g.drawRect(10, h - 6, 8, 6, "#335577", "#224466", 1);
        g.drawRect(w - 14, h - 6, 8, 6, "#335577", "#224466", 1);

        // --- 手臂 ---
        g.drawRect(0, 20, 6, 14, "#ffcc88", "#dd9966", 1);
        g.drawRect(w - 6, 20, 6, 14, "#ffcc88", "#dd9966", 1);
    }

    /** 处理键盘输入 */
    onKeyDown(keyCode: number): void {
        if (keyCode === 37 /*LEFT*/ || keyCode === 65 /*A*/) this._moveLeft = true;
        if (keyCode === 39 /*RIGHT*/ || keyCode === 68 /*D*/) this._moveRight = true;
        if (keyCode === 38 /*UP*/ || keyCode === 87 /*W*/ || keyCode === 32 /*SPACE*/) {
            this._jumpPressed = true;
        }
    }

    onKeyUp(keyCode: number): void {
        if (keyCode === 37 || keyCode === 65) this._moveLeft = false;
        if (keyCode === 39 || keyCode === 68) this._moveRight = false;
        if (keyCode === 38 || keyCode === 87 || keyCode === 32) this._jumpPressed = false;
    }

    /** 每帧更新物理和碰撞 */
    update(platforms: Platform[]): void {
        // --- 水平移动 ---
        if (this._moveLeft) {
            this.vx = -this.speed;
            this.facingRight = false;
        } else if (this._moveRight) {
            this.vx = this.speed;
            this.facingRight = true;
        } else {
            this.vx = 0;
        }

        // --- 跳跃 ---
        if (this._jumpPressed && !this._jumpWasPressed && this.isGrounded) {
            this.vy = -this.jumpForce;
            this.isGrounded = false;
        }
        this._jumpWasPressed = this._jumpPressed;

        // --- 重力 ---
        if (!this.isGrounded) {
            this.vy += this.gravity;
            if (this.vy > this.maxFallSpeed) this.vy = this.maxFallSpeed;
        }

        // --- 移动 ---
        this.x += this.vx;
        this.y += this.vy;

        // --- 水平边界 (不超出屏幕) ---
        const stageW = 960;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > stageW) this.x = stageW - this.width;

        // --- 碰撞检测 ---
        this.isGrounded = false;
        const all = platforms; // 复用引用

        // 先检查地面和其他平台
        for (let i = 0; i < all.length; i++) {
            const p = all[i];
            const pLeft = p.x;
            const pRight = p.x + p.width;
            const pTop = p.y;
            const pBottom = p.y + p.height;

            const playerLeft = this.x;
            const playerRight = this.x + this.width;
            const playerTop = this.y;
            const playerBottom = this.y + this.height;

            // 水平重叠？
            if (playerRight > pLeft && playerLeft < pRight) {

                // 从上方落下 → 着陆
                if (this.vy >= 0 &&
                    playerBottom >= pTop &&
                    playerBottom - this.vy <= pTop + 4) {
                    this.y = pTop - this.height;
                    this.vy = 0;
                    this.isGrounded = true;
                }

                // 从下方撞头
                if (this.vy < 0 &&
                    playerTop <= pBottom &&
                    playerTop - this.vy >= pBottom - 4) {
                    this.y = pBottom;
                    this.vy = 0;
                }
            }
        }

        // 掉出屏幕底部 → 重置
        if (this.y > 700) {
            this.reset();
        }

        // --- 更新精灵位置 ---
        this.sprite.pos(this.x, this.y);

        // --- 翻转朝向 ---
        this.sprite.scaleX = this.facingRight ? 1 : -1;
    }

    /** 重置到初始位置 */
    reset(): void {
        this.x = 400;
        this.y = 520;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
    }

    /** 获取底部 Y 坐标 */
    get bottom(): number {
        return this.y + this.height;
    }
}
