import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir:"./tests", workers:1, reporter:[["list"],["html", { open:"never" }]],
  use:{ baseURL:"http://127.0.0.1:3000", browserName:"chromium", channel:"msedge", screenshot:"only-on-failure", trace:"retain-on-failure" },
  webServer:{ command:"npm run dev", url:"http://127.0.0.1:3000", reuseExistingServer:true, timeout:120000 },
});
