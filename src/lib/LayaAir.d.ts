/** LayaAir 3.x 引擎最小类型声明 */

declare namespace Laya {
    function init(width: number, height: number): Promise<void>;
    const stage: Stage;

    class Stage {
        static SCALE_SHOWALL: string;
        static SCALE_FIXED_WIDTH: string;
        static SCALE_FIXED_HEIGHT: string;
        scaleMode: string;
        on(type: string, caller: any, listener: Function, args?: any[]): void;
        off(type: string, caller: any, listener: Function): void;
        addChild(node: Node): void;
        removeChild(node: Node): void;
        width: number;
        height: number;
        bgColor: string;
        size(w: number, h: number): void;
    }

    class Sprite extends Node {
        graphics: Graphics;
    }

    class Node {
        x: number;
        y: number;
        width: number;
        height: number;
        visible: boolean;
        alpha: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        pos(x: number, y: number): void;
        removeSelf(): void;
        destroy(): void;
    }

    class Graphics {
        drawRect(x: number, y: number, width: number, height: number, fillColor: string, lineColor?: string, lineWidth?: number): void;
        drawCircle(x: number, y: number, radius: number, fillColor: string, lineColor?: string, lineWidth?: number): void;
        clear(): void;
    }

    class Text extends Sprite {
        text: string;
        fontSize: number;
        color: string;
        font: string;
        bold: boolean;
        align: string;
        valign: string;
    }

    class Event {
        static KEY_DOWN: string;
        static KEY_UP: string;
        keyCode: number;
        key: number;
    }

    class Keyboard {
        static LEFT: number;
        static RIGHT: number;
        static UP: number;
        static DOWN: number;
        static SPACE: number;
        static A: number;
        static D: number;
        static W: number;
        static S: number;
    }

    class Handler {
        static create(caller: any, method: Function, args?: any[]): Handler;
    }

    class Tween {
        static to(target: any, props: any, duration: number, ease?: any, handler?: Handler): void;
    }

    class Ease {
        static linearNone: any;
        static easeOut: any;
        static easeIn: any;
    }

    class Timer {
        frameLoop(delay: number, caller: any, method: Function, args?: any[]): void;
        clearAll(caller: any): void;
        callLater(caller: any, method: Function, args?: any[]): void;
    }

    const timer: Timer;
}
