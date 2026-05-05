/// <reference path="lib/LayaAir.d.ts" />

/** 平台：可站立的水平方块 */
class Platform {

    sprite: Laya.Sprite;
    x: number;
    y: number;
    width: number;
    height: number = 16;

    /** 是否可穿透（从下方跳上去不撞头） */
    oneWay: boolean = false;

    constructor(x: number, y: number, width: number, color: string = "#8B5E3C", oneWay: boolean = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.oneWay = oneWay;

        this.sprite = new Laya.Sprite();
        this.draw(color);
        this.sprite.pos(x, y);
    }

    private draw(color: string): void {
        const g = this.sprite.graphics;
        const w = this.width;
        const h = this.height;

        // 主体
        g.drawRect(0, 0, w, h, color, this.darken(color, 0.3), 1);

        // 顶部高光线（像素风）
        g.drawRect(2, 2, w - 4, 3, this.lighten(color, 0.25), null, 0);

        // 底部阴影线
        g.drawRect(2, h - 4, w - 4, 3, this.darken(color, 0.2), null, 0);

        // 装饰纹理点
        if (w > 100) {
            const dotCount = Math.floor(w / 30);
            for (let i = 0; i < dotCount; i++) {
                const dx = 15 + i * 30 + (i % 3) * 5;
                g.drawRect(dx, 7, 3, 3, this.darken(color, 0.15), null, 0);
            }
        }
    }

    /** 颜色变亮 */
    private lighten(hex: string, amount: number): string {
        return this.adjust(hex, amount);
    }

    /** 颜色变暗 */
    private darken(hex: string, amount: number): string {
        return this.adjust(hex, -amount);
    }

    private adjust(hex: string, amount: number): string {
        const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount * 255));
        const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount * 255));
        const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount * 255));
        return '#' + [r, g, b].map(c => {
            const s = Math.round(c).toString(16);
            return s.length === 1 ? '0' + s : s;
        }).join('');
    }
}
