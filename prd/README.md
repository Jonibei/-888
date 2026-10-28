# 黑场作品集与设计师调查产品文档

Zier Min 个人视觉 / AI 设计作品集。首页为白底粉字和大头像的 2.5D 开合动效，Work 区提供五类入口；独立类目列表沿用黑灰网格和三十张静态占位卡片。内容由本地配置维护，无远程 API、账号或后台。

## 模块索引

| 模块 | 当前状态 | 产品 | 技术 |
| --- | --- | --- | --- |
| 分类与浏览 | 已实现，核心路径冒烟通过；全量验收待执行 | [产品说明](portfolio/README.md) | [实现说明](portfolio/technical.md) |
| 展示骨架 | 已实现，桌面截图与 390px 冒烟通过；更多尺寸待验收 | [产品说明](presentation/README.md) | [实现说明](presentation/technical.md) |
| 设计师协作与 AI 使用调查 | 手机交互已实现；Google Sheets 模板已创建；Apps Script 外部部署待配置 | [产品说明](survey/README.md) | [实现说明](survey/technical.md) |

## 当前重点

按 [TODO](../TODO.md) 完成剩余验收。作品集未部署；调查模块真实接收答案需要部署 Google Apps Script 并配置环境变量，不能将本地冒烟当成线上数据回收已验证。

本目录是本轮未提交工作区代码的事实快照；无旧同步状态，采用全量扫描页面、组件、数据、配置、脚本和测试。模块 README 描述产品，technical 描述实现；原始目标已归档，仅供人类回顾。
