# 调查模块实现说明

## 入口与调用链

- `src/app/survey/page.tsx` → `src/components/survey-form.tsx` → `src/lib/survey.ts`
- `src/app/survey/analysis/page.tsx` → `src/components/survey-analysis.tsx` → `GET /api/survey`
- 提交：SurveyForm → `POST /api/survey` → `GOOGLE_SHEETS_WEB_APP_URL` → Apps Script `doPost` → `回答数据` 追加一行。
- 聚合：分析页 → `GET /api/survey` → Apps Script `buildAnalysis`；只返回分类计数和样本数。

## 结构和安全

- 问卷定义集中在 `src/lib/survey.ts`：题号、类别、选项、可选状态与多选上限均由前后端共享；Q8–Q10 以七个项目阶段组成矩阵，提交校验拒绝缺少阶段、未知字段、越界选项和超过 3000 字的开放回答。
- `google-apps-script/Code.gs` 在追加行前复核题目选项，使用 `SURVEY_SHARED_TOKEN` 验证调用；答案不写到日志。分析接口仅输出聚合，不返回逐条回答。
- Next.js API 仅在服务端读取 `.env.local` 两项配置。浏览器不接触 App Script 地址或共享令牌。调用日志记录动作、答案项数、耗时与脱敏错误，不包含回答原文及令牌。
- 样本数据为空时返回空计数；未配置时返回 503 并显示明确说明。

## 稳定选择器与验证

- 表单交互使用 `survey-*` testid，分析页使用 `analysis-*` testid。
- `src/lib/survey.test.ts` 验证 5 部分/26 题、可选项、必答、未知选项/字段和文本长度。
- `tests/survey.spec.ts` 在 390px 下走通各部分、必答错误、提交未配置反馈、分析空状态和横向溢出检查。

## 未完成

Apps Script 必须由 Google 账户所有者部署并授权访问表格；部署地址及令牌未写入本地环境，当前不能进行真实提交/汇总的外部集成验收。
