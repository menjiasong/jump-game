# Jump Game - LayaAir 跳跃小人游戏

基于 LayaAir 3.x 引擎的 2D 像素风平台跳跃游戏。

## 操作

| 按键 | 功能 |
|------|------|
| A/D 或 ←/→ | 左右移动 |
| Space/W/↑ | 跳跃 |
| R | 掉落死亡后重新开始 |

## 多台机器上运行

```bash
# 1. 克隆项目
git clone https://github.com/menjiasong/jump-game.git
cd jump-game

# 2. 复制 LayaAir 引擎文件（必须已安装 LayaAir IDE）
#    从 IDE 安装目录复制以下文件到 libs/ 下：
#    - laya.core.js
#    - laya.webgl_2D.js
#    - laya.ui.js
#    源路径: C:\Program Files\LayaAirIDE\resources\engine\libs\

# 3. 编译 TypeScript（可选，js/game.js 已预编译好可直接用）
npm install
npm run build

# 4. 启动
# 方式一：直接双击 index.html
# 方式二：启动本地服务器
powershell -File server.ps1
# 然后访问 http://localhost:8080
```

## 项目结构

```
jump-game/
├── index.html        # 入口
├── libs/             # LayaAir 引擎（需自行复制）
├── js/               # 编译后的游戏逻辑
├── src/              # TypeScript 源码
│   ├── GameMain.ts   # 主游戏逻辑
│   ├── Player.ts     # 玩家控制器
│   ├── Platform.ts   # 平台类
│   └── lib/          # 类型声明
├── server.ps1        # 简易 HTTP 服务器
└── package.json
```
