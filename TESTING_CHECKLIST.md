# 验证清单

## 首页动效增量

tests/hero.spec.ts：1440×900 白底、展开 / 合拢、按钮 / Enter / Space、工具 opacity、视差改变与离开复位、Contact 待补提示、Work 跳转分类；390px 无溢出、reduced-motion 无循环动画。展开 / 合拢截图为 test-results/hero-open.png 和 hero-closed.png。

本轮 03 默认轻量验证；完整 §2 验收尚需后续 project-verify。实际执行结果见 TODO 验证记录。

## 轻量自动验证

- `npm run lint`：源码与测试静态规则。
- `npm run test`：五类 / 三十卡唯一归属、非法 slug、稳定路径、配置隔离和有效空集合查找。
- `npm run typecheck`：TypeScript 严格检查。
- `npm run test:e2e`：首页五入口数量 → 类目一六卡与导航高亮 → 刷新 → 类目五 → 首页；手机 390px 首页不溢出 → 类目二 → 未知类目 404 → 首页，保留截图。

## 待全量验收

- [ ] 所有五类从首页点击、直达、刷新、前进 / 后退，标题、六卡和 aria-current 同步。
- [ ] 卡片无交互语义、无无效图片请求、每卡均有待更新状态。
- [ ] 更改单类目名称 / 说明和作品文案后所有入口同步，其余四类不变。
- [ ] 1440、768、390、320px 首页 / 列表无溢出，导航均可操作。
- [ ] Tab / Enter 完整路径、可见焦点、200% 字号、长文、reduced-motion、正文对比度。
- [ ] UI 空态使用临时 fixture 验证；不把静态占位当作加载态。
- [ ] 实际托管环境五类 URL 直达 / 刷新；本轮未部署。

定位合同见 TODO §3：所有链接使用稳定 data-testid，卡片用 category-item-work-{workId}，非法地址用 notfound-status-message。

## 2026-10-19 新视频交互回归

- 自动入场后工具展开，无手动开合按钮。
- 四工具悬停 / 键盘聚焦 / 手机点击显示名称；工具分别抬升，眼部有限响应。
- 原生滚动退场 / 回滚恢复，作品区在后段接入。
- 1440×900、390×844、reduced-motion 和原分类 smoke：4/4 通过。
- lint、typecheck 和单测 3/3 通过，未运行 build。此前“按钮开合”的清单属于历史版本，已由当前场景替代。
