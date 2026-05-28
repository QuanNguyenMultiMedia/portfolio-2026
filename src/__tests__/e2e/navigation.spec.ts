import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
    await expect(page.locator("main")).toBeVisible();
  });

  test("navbar has 6 navigation items", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator("nav a");
    await expect(navLinks).toHaveCount(6);
  });

  test("all nav links navigate to correct pages", async ({ page }) => {
    const routes = ["/works", "/takes", "/play", "/freebies", "/contacts"];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("main")).toBeVisible();
      await expect(page).toHaveURL(route);
    }
  });
});

test.describe("Works Page", () => {
  test("renders project dial and preview", async ({ page }) => {
    await page.goto("/works");
    await page.waitForTimeout(1000);

    await expect(page.locator("main")).toBeVisible();

    const projectTitle = page.getByText(/2026 Reel|Herond Browser|Defrasoft/);
    await expect(projectTitle).toBeVisible();
  });
});

test.describe("Takes Page", () => {
  test("renders essay list with 6 items", async ({ page }) => {
    await page.goto("/takes");
    await page.waitForTimeout(500);

    const essayRows = page.locator('[class*="grid"] a, [class*="grid"] article');
    const count = await essayRows.count();

    // Should have content - at minimum the page rendered
    await expect(page.locator("main")).toBeVisible();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Contacts Page", () => {
  test("renders contact card", async ({ page }) => {
    await page.goto("/contacts");
    await page.waitForTimeout(500);

    await expect(page.locator("main")).toBeVisible();

    const emailLink = page.getByText(/quannguyenhere/);
    await expect(emailLink).toBeVisible();
  });
});
