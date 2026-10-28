# 黑场作品集

黑灰风格的视觉 / AI 创意作品集骨架：首页五个类目，每个类目进入独立列表，默认六张明确标注“作品待更新”的卡片。桌面三列、平板两列、手机一列；支持顶部导航、键盘操作与未知地址 404。

## 本地运行

建议使用 Node.js 22.13+（或兼容的更新 LTS）、npm。首次安装运行 `npm install`，锁文件保证版本一致；若本地 npm 10 的可选 peer 依赖解析报 edgesOut，可使用 `npm install --legacy-peer-deps`。本轮在 Node.js 22.11 上运行，安装产生部分工具的 engine 提示，验证结果见 TODO。

```sh
npm run dev
```

访问 http://127.0.0.1:3000 。无需 API Key、数据库或远程素材。

## 修改内容

修改 `src/fixtures/portfolio.ts` 中的个人介绍、类目名称和作品文案；保留 category-1 至 category-5 的 slug，避免分享链接失效。卡片当前为静态 CSS 占位，不是加载动画，也不进入详情页。真实图片与详情可在后续迭代扩展。

## 验证与发布

```sh
npm run lint
npm run test
npm run typecheck
npm run test:e2e
```

浏览器冒烟默认使用已安装的 Microsoft Edge；Playwright 会复用或启动本地开发服务。测试日志、失败 trace 和截图在 `test-results/`，报告在 `playwright-report/`。

按需发布时运行 `npm run build`，然后 `npm start`；build 不属于默认轻量验证。上线后仍需在真实托管环境验证五条类目 URL 的直接访问和刷新。

## 技术与目录

- Next.js App Router、React、TypeScript、Tailwind CSS、lucide-react。
- `src/app/`：首页、类目路由、404 与全局样式。
- `src/components/`：共享导航、类目卡片和作品网格。
- `src/fixtures/portfolio.ts`：集中占位数据；`src/lib/`：类型、路径和查找函数及单测。
- `tests/smoke.spec.ts`：桌面与手机核心路径。
- `design-system/黑场作品集/MASTER.md`：设计合同。

继续开发请读 [TODO.md](TODO.md)、[AGENTS.md](AGENTS.md) 与 [产品文档](prd/README.md)。原始需求归档后仅供人类回顾，不作为后续 Agent 开发入口。


## 部署到 Cloudflare Workers

本项目使用 Next.js 16，Cloudflare Workers 可通过 Workers Builds 导入 GitHub 仓库并自动配置 vinext。导入时选择本仓库与 `main` 分支，按照 Cloudflare 提供的自动配置 Pull Request 检查并合并，然后等待预览部署完成。不要将 `.env.local` 或真实令牌提交到 GitHub。

部署后在 Cloudflare Worker 的 Settings → Variables and Secrets 中配置：

- `GOOGLE_SHEETS_WEB_APP_URL`：Apps Script Web App `/exec` 地址（普通变量）。
- `GOOGLE_SHEETS_WEB_APP_TOKEN`：与 Apps Script Script Properties 相同的令牌（Secret）。

配置后重新部署，并用 `/survey` 提交测试答卷；在 `/survey/analysis` 确认看板能读取数据。没有配置这些服务端变量时，问卷页面仍能打开，但无法收集共享数据。

本地手机预览：`npm run dev` 监听 `0.0.0.0:3000`，同一局域网设备可访问 `http://<电脑局域网IP>:3000/survey`。
