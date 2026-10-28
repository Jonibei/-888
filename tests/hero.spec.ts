import { test, expect } from "@playwright/test";

test("桌面自动入场、独立工具、眼神与滚动退场可逆", async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  const errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("/");
  const scene=page.getByTestId("hero-section");
  await expect(scene).toHaveAttribute("data-phase","entering");
  await expect(scene).toHaveAttribute("data-phase","ready");
  await expect(page.getByTestId("hero-tools")).toHaveCSS("opacity","1");
  await expect(page.getByTestId("hero-btn-toggle")).toHaveCount(0);
  await page.screenshot({path:"test-results/hero-motion-open.png"});
  for(const id of ["figma","codex","lovart","jimeng"]) {
    await page.getByTestId(`hero-btn-tool-${id}`).hover();
    await expect(page.locator(`#label-${id}`)).toBeVisible();
    await expect(page.getByTestId(`hero-art-${id}`)).toHaveAttribute("data-active","true");
    expect(await scene.evaluate(el=>el.style.getPropertyValue("--gaze-y"))).toBe("-3px");
  }
  await page.screenshot({path:"test-results/hero-motion-hover.png"});
  await page.mouse.move(50,500);
  expect(parseFloat(await scene.evaluate(el=>el.style.getPropertyValue("--gaze-x")))).toBeLessThan(0);
  await page.mouse.move(1390,500);
  expect(parseFloat(await scene.evaluate(el=>el.style.getPropertyValue("--gaze-x")))).toBeGreaterThan(0);
  await page.getByTestId("hero-btn-tool-codex").focus();
  await expect(page.locator("#label-codex")).toBeVisible();
  await page.getByTestId("hero-btn-tool-codex").press("Tab");
  await expect(page.locator("#label-lovart")).toBeVisible();
  await page.getByTestId("hero-btn-contact").focus();
  await page.evaluate(()=>scrollTo(0,850));
  await expect.poll(async()=>Number(await scene.getAttribute("data-progress"))).toBeGreaterThan(.7);
  await page.screenshot({path:"test-results/hero-motion-exit.png"});
  await page.evaluate(()=>scrollTo(0,0));
  await expect(scene).toHaveAttribute("data-progress","0.000");
  await page.getByTestId("hero-btn-contact").click();
  await expect(page.getByTestId("hero-status-contact")).toBeVisible();
  await page.getByTestId("hero-link-work").click();
  await expect(page.getByTestId("home-list-categories")).toBeInViewport();
  await page.getByTestId("home-link-category-category-1").click();
  await expect(page.getByTestId("category-status-title")).toHaveText("类目一");
  expect(errors).toEqual([]);
});

test("手机减弱动态直接展开、触屏标签与导航可用",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await expect(page.getByTestId("hero-section")).toHaveAttribute("data-phase","ready");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator(".zier-entrance").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
  await page.getByTestId("hero-btn-tool-figma").click();
  await expect(page.locator("#label-figma")).toBeVisible();
  await page.screenshot({path:"test-results/hero-motion-mobile.png"});
  await page.getByTestId("hero-link-work").click();
  await expect(page.getByTestId("home-list-categories")).toBeInViewport();
});
