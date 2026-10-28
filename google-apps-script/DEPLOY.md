# Google Sheets 连接步骤

问卷使用服务器端 Route Handler 转发答案。浏览器不会接触 Apps Script 地址或共享令牌。

1. 打开数据表，进入「扩展程序 → Apps Script」，把 `Code.gs` 内容粘贴到编辑器并保存。
2. 检查代码顶部的 `SPREADSHEET_ID` 与此表格一致。
3. 在 Apps Script「项目设置 → 脚本属性」新增 `SURVEY_SHARED_TOKEN`，填入一段随机长令牌。
4. 部署 → 新建部署 → 类型选「Web 应用」；执行身份选自己，访问权限选「任何人」。共享令牌仍在服务端校验，不能放到网页前端。
5. 复制部署 URL，在 Next.js 项目根目录创建 `.env.local`：

   ```env
   GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/你的部署编号/exec
   GOOGLE_SHEETS_WEB_APP_TOKEN=与脚本属性相同的随机长令牌
   ```

6. 重启 Next.js 服务。打开 `/survey/analysis`，应看到已连接的空数据状态；提交一份测试问卷并确认「回答数据」追加一行、分析看板样本量更新。

更改脚本后需要在 Apps Script「部署 → 管理部署」中编辑现有部署并发布新版本。不要把令牌提交到 Git。
