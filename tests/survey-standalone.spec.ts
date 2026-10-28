import { expect, test } from "@playwright/test";

test("单文件 HTML 在手机与桌面可用，完成问卷并显示本地分析", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/survey-standalone.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByTestId("standalone-btn-next")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator("link[rel=stylesheet],script[src]").count()).toBe(0);
  await page.getByTestId("standalone-btn-next").click();
  await expect(page.locator("#form-error")).toContainText("必答问题未完成");

  for (let section = 0; section < 5; section += 1) {
    const start = [1, 8, 15, 19, 23][section];
    const end = [7, 14, 18, 22, 26][section];
    for (let q = start; q <= end; q += 1) {
      if (q === 26 || [8, 9, 10].includes(q)) continue;
      await page.getByTestId(`standalone-option-q${q}-1`).click();
    }
    if (section === 1) {
      for (let stage = 1; stage <= 7; stage += 1) {
        const row = ["需求接收", "方向讨论", "首稿制作", "组内评审", "跨部门对齐", "修改迭代", "交付上线"][stage - 1];
        await page.locator(`[data-matrix-summary="q8"][data-row="${row}"]`).click();
        await page.getByTestId(`standalone-option-q8-${stage}-1`).click();
        await page.getByTestId(`standalone-select-q9-${stage}`).selectOption({ index: 1 });
        await page.locator(`[data-matrix-summary="q10"][data-row="${row}"]`).click();
        await page.getByTestId(`standalone-option-q10-${stage}-1`).click();
      }
    }
    if (section < 4) await page.getByTestId("standalone-btn-next").click();
  }
  await page.getByTestId("standalone-btn-submit").click();
  await expect(page.getByTestId("standalone-status-success")).toBeVisible();
  await page.getByRole("button", { name: "查看数据分析" }).click();
  await expect(page.getByTestId("analysis-total")).toContainText("1");
  await expect(page.getByTestId("standalone-analysis-q7")).toContainText("已投入使用");
  await page.getByTestId("standalone-tab-analysis").click();
  await page.getByText("项目协作与 AI 使用", { exact: true }).click();
  await expect(page.getByTestId("standalone-analysis-q9")).toContainText("没有使用");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("单文件 HTML 可切换到同源接口模式，并展示 Sheets 未配置状态", async ({ page }) => {
  await page.goto("/survey-standalone.html?api=1");
  await page.getByTestId("standalone-tab-analysis").click();
  await expect(page.locator("#analysis-status")).toContainText("Google Sheets 尚未连接");
});
