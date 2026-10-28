# 展示骨架技术说明

## 首页动效增量（2026-10-19）

src/components/interactive-hero.tsx 是首页客户端边界：open / contactVisible 管理按钮状态；鼠标通过 CSS 变量更新有限视差，不逐帧更新 React。原生按钮有 aria-expanded 与稳定 testid；装饰素材以 CSS 背景呈现，父级提供可读图片描述。

public/hero/zier-open.png 与 zier-closed.png 为内置 imagegen 生成的同尺寸本地透明素材，来源与提示摘要见同目录 README。下半头像、上半工具通过 CSS clip-path 分层，合拢采用对齐素材交叉淡化避免头发接缝；工具组 CSS 浮动，非独立 3D 对象。无远程请求或新增依赖。

tests/hero.spec.ts 验证白底、按钮 / Enter / Space、aria-expanded、工具 opacity、视差改变 / 复位、Work / Contact、手机 390px 与 reduced-motion。标题和导航是 HTML，未将整张概念图用作页面背景。对应 TODO §2.5；独立工具点击、真实 3D 和眼球动画尚未实现。

## 实现入口

- `src/app/layout.tsx`：zh-CN、全站 metadata、跳到主内容链接、页头 / 页脚。
- `src/app/globals.css`：Tailwind v4 入口、语义色 token、系统字体、共享容器、网格、导航及焦点 / reduced-motion。
- `src/components/category-card.tsx`、`src/components/work-grid.tsx`：4:3 灰块、12px 圆角、明确占位文字。
- `postcss.config.mjs`、`next.config.ts`：Tailwind PostCSS；关闭开发指示器与自动 Agent 协议写入，避免覆盖既有协作约定。

## 数据与状态

引用集中 FIXTURE，策略 FIXTURE_DEMO；无外部图片 / 字体、图库 Key 或服务配置。永久占位不设置 aria-busy。无作品数组显示空态；404 保留相同主题。

## 日志与验收

纯展示无 I/O，不加虚假日志。`tests/smoke.spec.ts` 保留 `test-results/home-desktop.png`、`home-mobile.png`、`category-mobile.png`；日志见 TODO。

实现要求正文与次级文字至少 4.5:1，可见焦点 2px；当前为代码规则，完整 a11y 实测未完成，不当作全量通过。其他视口和特殊文本边界见 TESTING_CHECKLIST.md。

## 最近同步

2026-10-19，TODO §2.4 / §5 / §8；全量扫描当前未提交工作区。基准 HEAD 为 402e986f95e817df68f91ba39af57d0ac90b2a23。未生产构建或部署，生产刷新待验证。
