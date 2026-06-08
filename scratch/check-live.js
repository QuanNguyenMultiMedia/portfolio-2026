const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on("console", (msg) => {
    console.log(`[CONSOLE ${msg.type().toUpperCase()}]`, msg.text());
  });

  page.on("pageerror", (err) => {
    console.error("[PAGE ERROR]", err.message);
  });

  console.log("Navigating to https://minhquan.works...");
  try {
    await page.goto("https://minhquan.works", { waitUntil: "load", timeout: 15000 });
    console.log("Page loaded successfully.");
    await page.screenshot({ path: "scratch/live_screenshot.png" });
    console.log("Screenshot saved to scratch/live_screenshot.png");
  } catch (e) {
    console.error("Navigation failed:", e);
  }

  await browser.close();
}

run();
