# 黑场作品集开发规格书与计划

## 1. 项目框架

- 当前产品事实：[prd/README.md](prd/README.md)；设计合同：[MASTER.md](design-system/黑场作品集/MASTER.md)。本文件保留开发合同与验收进度；03 首版已实现并通过轻量验证。
- 工具形态：网站，优先在桌面使用，同时适配手机。
- 主框架：Next.js App Router + React + TypeScript；Tailwind CSS + CSS variables。
- 框架映射：网站 → Next.js；桌面软件 → Electron；浏览器插件 → vite-web-extension。本项目仅使用 Next.js。
- 选择理由：复用首页与类目列表模板，支持独立 URL、直达、刷新和静态展示。
- Agent 启用矩阵：
  - 必选：mvp-requirement-analyst、project-architecture-planner、qa-acceptance-planner；已由 requirements、architecture、acceptance 三个独立子 Agent 并行审查。
  - 条件启用：ui-interaction-planner；当前未加载对应 Profile，由主会话按职责完成界面、状态、素材和响应式专项。
  - 未启用：api-integration-planner（展示 AI 作品不等于调用 AI 服务，本期无 API）；platform-capability-planner（无特殊平台权限）。
- 多 Agent 需求拆解结果：五类独立列表；稳定 slug 与显示名称分离；作品卡片为静态内容占位；未知路径 404；当前导航由 URL 决定。QA 覆盖五条路径、直达刷新、配置隔离和手机布局。
- 合并裁决：范围以 PRD 为准；不因通用设计推荐新增订阅表单、彩色 CTA、社交证明或复杂动效。
- 规划默认值：产品暂名“黑场作品集”，类目一至五，每类六卡；PRD 示例人物不作为真实个人资料展示。

## 已完成模块（详见 prd/）

已实现代码与轻量验证见 [分类与浏览](prd/portfolio/README.md)、[展示骨架](prd/presentation/README.md)。尚未完成全量 project-verify，不卸货仍待验收的 §2 功能块。

## 2. MVP 功能拆解

### 2.6 当前迭代：参考新视频的连续交互（用户已确认）

- [x] 刷新首页后完整头像自下而上进入，再自动展开工具；取消手动开合入口。图片加载完成才开始，避免空白入场。
- [x] 鼠标左右移动时眼部有限跟随，悬停工具时向上看，离开复位；四个工具独立悬停抬升、显示名称，键盘聚焦和触屏点击同样可查看名称。
- [x] 向下滚动驱动姓名缩小、头像上移和翻转露出白色背面，再进入现有五类作品区；回滚恢复。使用原生滚动，不劫持滚轮。
- [x] 保持白底、粉字、选定人物及白色撕纸边；1440×900 验收入场、四工具、眼神、退场和反向恢复；390px 无横向溢出；减弱动态时直接展示静态展开态。
- [x] 执行 lint / test / typecheck 与浏览器回归，截图并记录素材与视觉模拟的边界。

### 2.5 前版首页动效（已归档）

- [x] 已验证历史实现已归档至 [展示与首页交互](prd/presentation/README.md)。按钮开合与整体视差已由 §2.6 连续交互取代。

### 2.1 分类首页

- 用户目标：让潜在客户快速选择感兴趣的视觉 / AI 创意设计方向。
- 使用入口：`/`。
- 子功能：
  - [x] 渲染共享顶部导航：首页与五类，首页声明当前页。
  - [x] 渲染个人介绍占位，不使用虚构姓名或业绩。
  - [x] 从统一配置按固定顺序展示五个真实链接入口。
- 主流程：打开首页 → 浏览介绍和五类 → 点击类目 → 对应独立列表。
- 输入 / 输出 / 反馈：目标 slug → 对应 URL；链接有悬停、按下和键盘焦点反馈。
- 状态要求：默认五类；类目集合为空显示“类目待更新”；本地同步配置无业务加载态、不造假延迟；成功为路由跳转；非法目标显示 404，配置错误在验证中报告。
- 数据需求：介绍标题 / 描述、类目 slug / 名称 / 说明 / 排序，只读不持久化。
- 数据来源：`FIXTURE`；用户明确要求内容占位，不冒充真实作品。
- 演示策略：`FIXTURE_DEMO`；`src/fixtures/portfolio.ts` 集中配置五类，页面标注“内容占位，待更新”。
- 首屏可演示形态：可点击的五类入口，不增加示例模式开关。
- MVP 边界：固定五类和真实导航；暂不实现分类编辑、后台、联系表单。
- 验收标准：
  - [x] 打开 `/`，`home-status-introduction-placeholder` 可见，`home-list-categories` 内恰有五个入口。
  - [ ] 逐一点击 `home-link-category-{slug}`，category-1 至 category-5 分别到达 `/works/{slug}`。
  - [ ] `layout-link-home` 有 aria-current="page"，其他导航不声明当前页。

### 2.2 独立类目页面

- 用户目标：直接访问、分享某类作品并切换其他类目。
- 使用入口：`/works/category-1` 至 `/works/category-5`，统一模板 `/works/[categorySlug]`。
- 子功能：
  - [x] 按 slug 查找类目，渲染标题、说明与所属作品网格。
  - [x] 枚举五条静态路由，未知 slug 调用 notFound，不回退到任意有效类目。
  - [x] 导航高亮当前类目，可返回首页、切换类目、浏览器后退 / 前进。
- 主流程：直达或点击类目 → 根据 URL 读取配置 → 标题和六卡 → 切换 / 返回。
- 输入 / 输出 / 反馈：URL slug → 类目数据；标题、导航和卡片集合保持一致。
- 状态要求：默认六卡；有效类目无作品显示“该类目作品待更新”；无远程加载；成功为内容一致；未知类目或路径显示“页面未找到”和首页链接。若存在框架 pending 回退，预留空间且加载完成后消失。
- 数据需求：只读当前类目和作品，URL 是当前类目唯一事实来源。
- 数据来源：`FIXTURE`；演示策略：`FIXTURE_DEMO`；复用 `src/fixtures/portfolio.ts`，每类六条、共三十条，卡片明确标记待更新。
- 首屏可演示形态：类目标题、说明占位及六卡。
- MVP 边界：五类共享模板、可刷新独立地址；暂不实现详情、分页和筛选。
- 验收标准：
  - [ ] 五条 URL 逐个直接打开和刷新，`category-status-title` 匹配配置，`category-list-works` 各有六卡。
  - [ ] 当前 `layout-link-category-{slug}` 有 aria-current="page"，其余导航不声明当前页。
  - [ ] 类目一切换类目五再返回首页，URL、内容与高亮同步；后退 / 前进后同样一致。
  - [ ] `/works/unknown` 和 `/unknown` 显示 `notfound-status-message`；`notfound-link-home` 可返回首页。

### 2.3 可替换作品卡片

- 用户目标：先确认展示结构，后续补内容不改布局。
- 使用入口：类目列表作品网格。
- 子功能：
  - [x] 每卡含 4:3 灰色封面、名称、描述和“作品待更新”。
  - [x] 使用非交互 article，无详情链接、按钮、点击处理或手形光标。
  - [x] 使用全站稳定唯一 ID，所有占位内容集中配置，不在 JSX 散落 mock。
- 主流程：读取当前类目作品 → 按稳定 ID 渲染 → 浏览占位内容。
- 输入 / 输出 / 反馈：作品配置 → 静态卡片，无写操作与网络反馈。
- 状态要求：默认静态灰块；空集合由列表空态处理；无持续 shimmer、aria-busy 或伪加载；成功为完整占位展示；无封面仍显示灰块，无无效图片请求。未来真实图片失败回退灰块，本期不新增上传能力。
- 数据需求：id / categorySlug / title / description / status="placeholder"；封面统一由 CSS 绘制。
- 数据来源：`FIXTURE`；演示策略：`FIXTURE_DEMO`；`src/fixtures/portfolio.ts` 每类六条，“作品待更新”为可见标记。
- 首屏可演示形态：灰色封面及名称、描述占位。
- MVP 边界：配置可替换、布局复用；暂不实现编辑 UI、上传、详情或互动。
- 验收标准：
  - [ ] 每个 `category-item-work-{workId}` 都含封面、标题、描述及 `category-status-placeholder-{workId}`。
  - [ ] 卡片无链接、按钮，不进入 Tab 顺序，无破图请求。
  - [ ] 临时测试 fixture 替换一个类目名称、说明和一张卡片文案，首页 / 导航 / 列表同步更新；其余四类不变，slug 不变。通过依赖注入或临时副本验证，不污染交付数据。

### 2.4 响应式视觉骨架

- 用户目标：电脑展示清晰，手机所有入口同样可用。
- 使用入口：首页、五类列表和 404。
- 子功能：
  - [x] 落实 MASTER 黑灰 token、留白、圆角与字体。
  - [x] 小于 640px 一列、640–1023px 两列、1024px 起三列；首页五入口与作品网格均遵循此规则。
  - [x] 顶部六项导航可换行，不增加隐藏菜单，保持全部可达。
  - [x] 键盘焦点、跳到主内容、语义标题及减弱动效支持。
- 主流程：打开页面 → 随视口重排 → 使用相同导航路径。
- 输入 / 输出 / 反馈：视口、键盘与系统动效偏好 → 布局和焦点反馈。
- 状态要求：默认黑灰布局；空 / 错误页沿用主题；无独立业务加载或服务未配置态；成功为无溢出且可操作；长文自然换行，不裁掉导航。
- 数据来源：`FIXTURE`；演示策略：`FIXTURE_DEMO`；沿用前述配置，无额外数据。
- 首屏可演示形态：桌面三列、手机一列，全部导航可达。
- MVP 边界：静态网格和明度过渡；暂不实现环形动效、错落展陈、主题切换。
- 验收标准：
  - [ ] 1440×900、768×1024、390×844、320×568 下检查首页和列表，scrollWidth <= innerWidth，无遮挡，导航全部可操作。
  - [ ] 仅 Tab / Enter 完成首页 → 类目一 → 类目五 → 首页，焦点可见、顺序合理、无陷阱。
  - [ ] 200% 字号与长文下仍可操作；reduced-motion 下无装饰动画；正文对比度至少 4.5:1。

## 3. 界面与交互规格

- [x] 全站中文 lang、语义页头和 main、唯一 h1；路由切换后标题和主内容可感知。
- [x] 所有链接有真实 href，不使用空链接或虚假详情入口。
- [x] testid：`layout-nav-primary`、`layout-link-home`、`layout-link-category-{slug}`、`layout-link-skip-main`。
- [x] 首页：`home-status-introduction-placeholder`、`home-list-categories`、`home-link-category-{slug}`。
- [x] 列表：`category-status-title`、`category-status-description-placeholder`、`category-list-works`、`category-item-work-{workId}`、`category-status-placeholder-{workId}`、`category-status-empty`。
- [x] 异常：`notfound-status-message`、`notfound-link-home`；若实际实现框架回退，再用 `layout-status-loading`、`layout-status-error`、`layout-btn-retry`，不为凑状态造控件。
- [x] slug 为 category-1 至 category-5，workId 如 category-1-work-1；显式配置、全站唯一，不随排序或文案改变。

## 4. 架构与模块边界

- [x] 开发阶段初始化 Next.js App Router + TypeScript，锁文件固定实际依赖；已安装依赖并生成 package-lock.json。
- [x] `src/app/layout.tsx`、`page.tsx`、`works/[categorySlug]/page.tsx`、`not-found.tsx`、`globals.css`。
- [x] `src/components/`：SiteHeader、CategoryCard、WorkCard、WorkGrid；默认 Server Components；如用 usePathname，仅导航采用最小客户端边界。
- [x] `src/fixtures/portfolio.ts` 存占位配置，`src/lib/portfolio.ts` 放类型、查找和路径构造，禁止五页复制。
- [x] 数据合同：Portfolio 含 introduction、categories；Category 含 slug / name / description / works；Work 含 id / categorySlug / title / description / status。均只读。
- [x] 初始配置五个固定唯一 slug、每类六卡、三十个唯一作品 ID、归属一致；运行时允许有效类目空作品数组显示空态。初始数量通过 seed 测试验收。
- [x] 状态流：入口 URL → slug 查找 → 同一类目 → 标题 / 导航 / 网格；无数据库、浏览器持久化、API Route、登录、密钥或状态库。
- [x] generateStaticParams 枚举五类，非法 slug 调用 notFound；采用 Next.js 默认部署模式，不提前开启静态导出。
- [x] React 转义文本，禁止 dangerouslySetInnerHTML。本期无 API / IPC / 第三方请求，不制造调用日志；未来增加调用须覆盖入口、脱敏参数摘要、结果、错误原因，不输出敏感信息。
- [x] 开发顺序：工程 / 配置 → 全局样式 / 导航 → 首页 → 类目 / 404 → 状态 / 响应式 → 验证。

## 5. 设计系统

- [x] 已读取 PRD UI 风格及 ui-ux-pro-max，完成 UI 专项。
- [x] 创建 design-system/黑场作品集/MASTER.md，含画像、UI 栈、图标、媒体、数据、token、状态及尺寸。
- [x] 将 MASTER 落地到 Tailwind 与 CSS variables。
- [x] 单一图标库 lucide-react；按需使用方向提示，不使用 emoji 或多库。
- [x] CSS 灰块占位，IMAGE_PROVIDER=none，不依赖 Unsplash Key、远程图片或字体。

## 6. API 与集成

当前 MVP 不需要远程 API。AI 是作品类型；不需要模型服务、账号同步、鉴权、图库、分析追踪或后台，不增加 API 接入章节。

## 7. 平台能力与权限

纯网站导航与静态内容，无文件系统、剪贴板、通知权限；无 Electron、manifest 或扩展 background。

## 8. 验证

- [ ] 开发后运行 project-verify，逐条执行 §2 并回写，不将规划标记为 UI 已通过。
- [x] 已提供 npm run lint（ESLint）、npm run test（Vitest）、npm run typecheck（tsc --noEmit），另建议 npm run test:e2e（Playwright）。
- [ ] 非 UI 测试覆盖 slug 查找、未知 slug、路径生成、初始配置不变量、配置修改隔离和有效类目空数组。
- [ ] Playwright 覆盖五类点击 / 直达 / 刷新、导航 / history、标题 / 六卡 / aria-current、404。
- [ ] 生成 TESTING_CHECKLIST.md，以 §3 稳定 testid 验收；test-results/ 保存日志和四视口首页及至少一个类目页截图。
- [ ] 空态用 fixture 覆盖；无 LIVE 未配置或远程加载，记录不适用，不伪造状态。
- [ ] 检查无运行时错误、破图；长文、键盘、焦点、对比度、减弱动态效果按 §2.4 验证。
- [ ] 发布时在实际预览 / 托管环境复验五条独立路径刷新；开发服务器通过不替代部署验收。
- [ ] 记录所有失败 / 跳过项；脚本缺失记“⚠️ 未提供该 script”并追加补齐任务。build 只在发布、打包或构建产物验证时按需执行。

## 9. 开发完成后更新 PRD

- [x] 调用 update-prd，基于实际代码生成 prd/ 已实现文档和验证记录。
- [x] 对照原始 PRD 把差距回写 §10；按 Skill 要求归档原稿，不提前移动。
- [x] 协议或入口变化时同步 AGENTS.md。

## 10. 未完成目标 / 后续功能

- [x] 首版骨架已实现，依赖已安装，轻量验证通过；全量验收保留未勾选项。
- [ ] 补真实个人介绍、类目名及作品；不阻塞骨架。
- 详情、筛选、后台、联系表单、上传和复杂展陈不在首版，需另行确认。

### 10.1 手机端设计师协作与 AI 使用调查（用户已确认）
- [x] 创建独立 `/survey` 手机端问卷和 `/survey/analysis` 数据可视化页面；不改变作品集首页。
  - 验收：手机宽度问卷首屏、分步页面、题目选择/输入、前后导航、必填校验、提交成功/失败均可操作；可用 `data-testid` 稳定定位。
- [x] 落实 5 个部分、26 题的调查内容，保留原问卷并加入用户新增的行业/角色/公司 Agent、项目启动协作、Agent 跨部门沟通、项目返工协作与修改方案等问题；Q8–Q10 保留逐阶段成员/部门/AI 参与矩阵。
  - 验收：每题答案可汇总为结构化 JSON，必填题完整校验，开放题可选；服务端验证请求结构并拒绝超限文本。
- [ ] 接入 Google Sheets 收集与分析数据；表结构支持提交时间、问卷答案及分析聚合。
  - 验收：Sheets 未配置时清晰显示未连接提示；配置后 POST 写入新行、GET 返回脱敏聚合统计；所有服务端调用记录入口摘要、结果、耗时和失败原因，不记答案原文/密钥。
- [x] 数据分析页面用手机图表展示样本量、AI 使用阶段、公司 Agent 状态、跨部门协作与返工方式；空数据/加载/失败均有状态。
  - 验收：仅使用 API 返回的真实汇总；预览示例必须由用户主动切换并明确标注；图表具备文字摘要和可访问标签。
- 进度：手机端交互、问卷校验、图表状态、API Route、Apps Script 代码与表格模板已完成。原生表格已创建；真实 POST/聚合 GET 尚未验收，需表格所有者按 `google-apps-script/DEPLOY.md` 部署 Web App，并配置 `GOOGLE_SHEETS_WEB_APP_URL`、`GOOGLE_SHEETS_WEB_APP_TOKEN` 后完成一次真实提交验证。

### 10.2 独立 HTML 交付（用户已确认）
- [x] 生成一个可独立使用的响应式问卷 HTML，所有 CSS 与 JavaScript 均内嵌，不依赖外部框架或资源。
  - 验收：单 HTML 文件可直接打开；含 5 部分/26 题、必答和矩阵交互、提交成功态、全题分析；窄屏与宽屏均无横向溢出；默认本地保存，并可通过同源 `/api/survey` 对接服务端。
- 验收结果：`npm run lint`、`npm run test`（7/7）、`npm run typecheck` 与 `npm run test:e2e -- tests/survey-standalone.spec.ts --reporter=line`（2/2）通过；测试确认无外部 CSS/JS 引用、手机与桌面无横向溢出、逐步填答、本地分析和同源接口未配置提示可用。
- 进度：文件为 `public/survey-standalone.html`，开发服务可经 `/survey-standalone.html` 提供；Google Sheets 访问凭据仍由服务端管理，HTML 不内嵌密钥。
- [x] 另生成 public/survey-all-files-in-one.html，在可用问卷后附可展开的 Playwright 测试源码与 TODO 原文，均以转义纯文本嵌入；不加载外部 CSS / JS。

## 开发进度

### 2026-10-19 / 01 阶段（保留）
- 已澄清桌面兼容手机、视觉 / AI 设计面向客户与合作方、五类独立页面；生成 PRD 与参考图风格。示例人物、暂名和六卡为规划默认值，网站未实现。

### 2026-10-19 / 02 阶段
- 三个独立 Agent 与主会话 UI 专项已合并为本规格及 MASTER。
- 本地 ui-ux-pro-max 检索成功；订阅模式、浅底蓝色和远程字体与 PRD 不符，未采用；吸收间距、过渡、无障碍补充。
- 仅规划文档，无代码、依赖安装、脚手架。下一步：用户确认后 03 开发。

## 验证记录

### 2026-10-19 / 01 阶段（保留）
- PRD 文档检查完成；无 package.json，lint / test / typecheck 未运行，后续补齐；未执行 build。

### 2026-10-19 / 02 阶段
- 已核对四个 MVP 的入口、子功能、数据、演示、状态及验收，与 PRD 五类、独立 URL、占位及手机适配一致。
- 文档结构检查通过：TODO §1–§10 齐全，MASTER 九个必备章节齐全；git diff --check 无报错（新增文档尚未纳入 Git，另以内容结构检查为依据）。
- ⚠️ 未提供 lint / test / typecheck script：根目录无 package.json。本轮仅文档，未进行业务验证或声明页面通过。
- 未执行 build，无发布或构建产物任务。

## TODO 卸货记录

暂无；实现并验证稳定后按 codex/rules/todo-prd-archive.md 归档。

### 2026-10-28 / 手机问卷与数据分析迭代
- 独立手机路径 `/survey` 与 `/survey/analysis` 已实现；Q8–Q10 按项目 7 个阶段分别收集角色、AI 使用占比和对接部门；分析页按主题覆盖 Q1–Q25 的全部选择题，新增协作/返工问题保留在原有题目之后。
- Google Sheets 模板： [视觉设计师跨部门协作与AI使用情况调查数据](https://docs.google.com/spreadsheets/d/1HNU0oSaxioA_FYmHC4lR29ff7twFrDEbgoWr8Sbh0V0/edit)。包含 `回答数据`（提交时间、Q1–Q26）及 `分析概览` 汇总公式。`google-apps-script/Code.gs` 为服务端数据桥接和聚合脚本。
- `npm run lint`、`npm run test`（7/7）与 `npm run typecheck` 通过；`npm run test:e2e -- tests/survey.spec.ts --reporter=line` 通过（2/2）。390px 冒烟覆盖分步填写、逐阶段矩阵题、必答错误、未配置提交提示、分析图表数据映射、分析空态与横向溢出；截图 `test-results/survey-mobile.png`、`test-results/survey-analysis-mobile.png`。
- 未配置环境时真实提交被 API 明确拒绝（503）；尚未部署 Apps Script，也未在生产/云端部署网站。配置凭据并验证实际写入为本模块唯一阻塞项。


## 03 开发进度与验证记录

### 2026-10-19 / 开发过程（历史）
- 已写入页面、导航、配置、响应式样式、404 和测试。依赖安装进行中，未声明验收通过。


### 2026-10-19 / 03 首版交付
- 已实现首页、五类列表、共享导航、三十张卡片、404、手机网格、键盘焦点和稳定 testid。依赖与锁文件已安装；TypeScript 固定 6 系列以兼容 ESLint。
- npm run lint：退出码 0，无警告；npm run test：3/3 通过；npm run typecheck：退出码 0；npm run test:e2e：2/2 通过。
- 冒烟证据：类目一进入与刷新、切换类目五、返回首页；390px 首页无溢出、类目二与未知类目回退；截图位于 test-results/。
- 未执行全量 project-verify：其余 §2 验收保持未勾选；UI 空态、配置修改后的 UI 同步、全五类 history、四视口、长文 / 字号 / 完整键盘与对比度待验。
- 未执行 build、未部署；实际托管五类直达与刷新待发布阶段验证。
- update-prd 已全量扫描当前代码与配置，生成 prd/ 两模块及 sync 状态；README 和 AGENTS 已同步，原 PRD 已归档为 prd.original.md。
- Node.js 22.11 安装产生部分工具 engine 提示，当前检查通过；README 建议 22.13+。开发预览 http://127.0.0.1:3000 。
- 本次只完成代码与轻量验证，不将未验证的完整验收项当作通过。


## 2026-10-19 / 首页动效迭代结果
- 用户最终选定白底、白色撕纸边版本，未采用蓝边。按桌面首屏实现 Zier Min、Work / About / Contact 和大头像。
- 透明素材由内置 imagegen 提取 / 编辑并保存在 public/hero/，标题、导航与开合按钮均为真实 HTML。开合为匹配素材的淡化与工具显隐，工具区整体浮动 / 视差，是 2.5D 原型。
- lint 退出码0；test 3/3通过；typecheck退出码0；浏览器4/4通过（2条新动效 + 2条分类回归）。额外加入空格键检查后，新动效2/2复验通过。
- 截图：test-results/hero-open.png、hero-closed.png、hero-mobile.png；已检查桌面展开 / 合拢，修正头像比例和头发拼接线。
- 待后续：独立工具Logo交互、真实3D、眼球跟随尚未实现；保持工具整体示意；真实联系方式待补。手机仅基础适配与减弱动效验证，桌面优先。
- 未执行全量旧§2验收、未build / 部署；相关未勾项继续保留。文档按本轮增量同步，未全量重建。




### 2026-10-19 / 新视频连续交互完成

- 用户确认五步方案及滚动触发退场后实现 §2.6，已验收项全部勾选；前版 §2.5 已卸货至 prd/presentation。
- lint、typecheck、3 项单测通过；最终浏览器回归 4/4，通过自动入场、四工具、眼神左右响应、键盘标签、滚动退场 / 回滚、手机减弱动态和原分类流程。
- 第一轮发现工具 enter 与 pointermove 同帧造成抬眼覆盖，已修复并回归。测试本机服务受沙箱套接字限制时使用已授权的浏览器测试命令重跑。
- 图片未更换；眼部为照片羽化局部位移，工具为 SVG 分区动画，背面为 CSS 纸片。未加入视频中的张嘴表情、真实三维模型或工具点击业务。无新增依赖，无构建 / 发布。
- 待后续：用户体验当前节奏后细调；其他旧验收待办继续保留，未冒充全量验收。


### 10.3 GitHub 与 Cloudflare 部署准备
- [x] 本地开发服务器监听  .0.0.0，便于同一局域网手机预览。
- [x] README 增加 Cloudflare Workers / vinext 导入流程与 Google Sheets 变量说明；敏感变量继续由 Cloudflare Secret 管理。
- [ ] 推送至用户指定的 GitHub 仓库，并在 Cloudflare Workers Builds 完成授权、自动配置 PR 审阅/合并与预览部署。
- [ ] Cloudflare 配置 Google Sheets 服务端变量后验证真实问卷提交及分析读取。

