# 分类与作品浏览技术说明

## 入口与模块

- `src/app/page.tsx`：读取介绍和分类，渲染首页。
- `src/app/works/[categorySlug]/page.tsx`：await params、按 slug 查找，generateStaticParams 枚举五类，未知调用 notFound；按类目设置 metadata。
- `src/app/not-found.tsx`：未知路径反馈和首页链接。
- `src/components/site-header.tsx`：唯一客户端组件，用 usePathname 识别当前项，Link 导航及 aria-current。
- `src/components/category-card.tsx`：整卡链接，lucide-react ArrowUpRight。
- `src/components/work-grid.tsx`：WorkGrid / WorkCard，静态 article，空集合显示空态。
- `src/lib/portfolio.ts`：只读 Portfolio / Category / Work、CategorySlug、categoryPath、findCategory。
- `src/fixtures/portfolio.ts`：五类三十卡和介绍，无数据库、storage、API 或密钥。

## 数据与链路

URL → findCategory → 类目标题、说明与 works → WorkGrid。slug 固定，名称可修改；workId 全站唯一。空集合仍是有效类目，非法 slug 不回退。

## 日志与安全

没有 API / IPC / 第三方调用，因此没有业务调用日志；文本由 React 转义，不解析 HTML。后续新增远程调用必须记录入口、脱敏参数摘要、结果和错误原因，不输出敏感信息。

## 验证

- `src/lib/portfolio.test.ts`：3 项测试，覆盖配置归属 / 唯一 ID、未知 slug、改名隔离 / 空集合查找。
- `tests/smoke.spec.ts`：2 条桌面 / 手机核心路径通过；定位见 TODO §3 与 TESTING_CHECKLIST.md。
- 页面使用 home-link-category-{slug}、layout-link-category-{slug}、category-list-works 等稳定 testid。
- 未覆盖的全五类直接访问 / history、UI 空态、配置变更 UI 验收保持 TODO 未勾选。

## 最近同步

2026-10-19；对应 TODO §2.1–§2.3 / §3–§4。首次全量扫描，无旧同步点；当前 HEAD 402e986f95e817df68f91ba39af57d0ac90b2a23，包含本轮未提交实现，不代表已提交或部署版本。
