import { expect, test } from "@playwright/test";

test("手机版问卷可分步填写，未连接 Sheets 时保留答案并展示图表空态", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/survey");
  await expect(page.getByTestId("survey-page")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/survey-mobile.png", fullPage: false });
  await page.getByTestId("survey-btn-next").click();
  await expect(page.getByTestId("survey-status-error")).toBeVisible();

  for (let section = 0; section < 5; section += 1) {
    const start = [1, 8, 15, 19, 23][section];
    const end = [7, 14, 18, 22, 26][section];
    for (let question = start; question <= end; question += 1) {
      if (question === 26 || [8, 9, 10].includes(question)) continue;
      await page.getByTestId(`survey-option-q${question}-1`).click();
    }
    if (section === 1) {
      for (let stage = 1; stage <= 7; stage += 1) {
        await page.getByTestId(`survey-matrix-summary-q8-${stage}`).click();
        await page.getByTestId(`survey-option-q8-${stage}-1`).click();
        await page.getByTestId(`survey-select-q9-${stage}`).selectOption({ index: 1 });
        await page.getByTestId(`survey-matrix-summary-q10-${stage}`).click();
        await page.getByTestId(`survey-option-q10-${stage}-1`).click();
      }
    }
    if (section < 4) await page.getByTestId("survey-btn-next").click();
  }
  await page.getByTestId("survey-btn-submit").click();
  await expect(page.getByTestId("survey-status-error")).toContainText("暂未连接数据表");
  await expect(page.getByTestId("survey-status-connection")).toBeVisible();
  await page.goto("/survey/analysis");
  await expect(page.getByTestId("analysis-status-unconfigured")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/survey-analysis-mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("分析图表按 API 聚合结果呈现样本与回答分布", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/survey", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
    total: 42,
    items: {
      q7: { "已投入使用": 18, "正在试点": 12, "计划搭建": 8, "没有": 4 },
      q9: { "没有使用": 25, "不到 25%": 30, "25%–50%": 60, "51%–75%": 20, "超过 75%": 7, "不确定": 3 },
    },
  }) }));
  await page.goto("/survey/analysis");
  await expect(page.getByTestId("analysis-total")).toContainText("42");
  await expect(page.getByTestId("analysis-chart-q7")).toContainText("已投入使用");
  await expect(page.getByTestId("analysis-chart-q7")).toContainText("18");
  await page.getByTestId("analysis-group-flow").locator("summary").click();
  await expect(page.getByTestId("analysis-chart-q9")).toContainText("按项目阶段累计回答次数");
  await expect(page.getByTestId("analysis-chart-q9")).toContainText("25%–50%");
});
