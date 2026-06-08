# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Contacts Page >> renders contact card
- Location: src/__tests__/e2e/navigation.spec.ts:62:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/quannguyenhere/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/quannguyenhere/)

```

```yaml
- link "Minh Quan Logo":
  - /url: /
  - img "Minh Quan Logo"
- button "Toggle Theme":
  - img
- text: CONTACTS
- main:
  - heading "Contact" [level=1]
  - link "@ Q U A N N G U Y E N H E R E":
    - /url: mailto:quannguyenhere@gmail.com
  - link "01LINKEDIN":
    - /url: https://www.linkedin.com/in/quannguyenhere/
  - link "02BEHANCE":
    - /url: "#"
  - link "03UPWORK":
    - /url: "#"
  - paragraph: Multimedia creative designer at the intersection of architecture, motion, and code.
  - img "Minh Quan Portrait"
- text: MINHQUAN // CONTACTS
- navigation:
  - link "Minh Quan Logo":
    - /url: /
    - img "Minh Quan Logo"
  - link "Home":
    - /url: /
  - link "Works":
    - /url: /works
  - link "Takes":
    - /url: /takes
  - link "Play":
    - /url: /play
  - link "Freebies":
    - /url: /freebies
  - link "Contacts":
    - /url: /contacts
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Navigation", () => {
  4  |   test("homepage loads without console errors", async ({ page }) => {
  5  |     const errors: string[] = [];
  6  |     page.on("console", (msg) => {
  7  |       if (msg.type() === "error") errors.push(msg.text());
  8  |     });
  9  | 
  10 |     await page.goto("/");
  11 |     await page.waitForTimeout(2000);
  12 | 
  13 |     expect(errors).toHaveLength(0);
  14 |     await expect(page.locator("main")).toBeVisible();
  15 |   });
  16 | 
  17 |   test("navbar has 6 navigation items", async ({ page }) => {
  18 |     await page.goto("/");
  19 |     const navLinks = page.locator("nav a");
  20 |     await expect(navLinks).toHaveCount(6);
  21 |   });
  22 | 
  23 |   test("all nav links navigate to correct pages", async ({ page }) => {
  24 |     const routes = ["/works", "/takes", "/play", "/freebies", "/contacts"];
  25 | 
  26 |     for (const route of routes) {
  27 |       await page.goto(route);
  28 |       await page.waitForLoadState("networkidle");
  29 |       await expect(page.locator("main")).toBeVisible();
  30 |       await expect(page).toHaveURL(route);
  31 |     }
  32 |   });
  33 | });
  34 | 
  35 | test.describe("Works Page", () => {
  36 |   test("renders project dial and preview", async ({ page }) => {
  37 |     await page.goto("/works");
  38 |     await page.waitForTimeout(1000);
  39 | 
  40 |     await expect(page.locator("main")).toBeVisible();
  41 | 
  42 |     const projectTitle = page.getByText(/2026 Reel|Herond Browser|Defrasoft/);
  43 |     await expect(projectTitle).toBeVisible();
  44 |   });
  45 | });
  46 | 
  47 | test.describe("Takes Page", () => {
  48 |   test("renders essay list with 6 items", async ({ page }) => {
  49 |     await page.goto("/takes");
  50 |     await page.waitForTimeout(500);
  51 | 
  52 |     const essayRows = page.locator('[class*="grid"] a, [class*="grid"] article');
  53 |     const count = await essayRows.count();
  54 | 
  55 |     // Should have content - at minimum the page rendered
  56 |     await expect(page.locator("main")).toBeVisible();
  57 |     expect(count).toBeGreaterThan(0);
  58 |   });
  59 | });
  60 | 
  61 | test.describe("Contacts Page", () => {
  62 |   test("renders contact card", async ({ page }) => {
  63 |     await page.goto("/contacts");
  64 |     await page.waitForTimeout(500);
  65 | 
  66 |     await expect(page.locator("main")).toBeVisible();
  67 | 
  68 |     const emailLink = page.getByText(/quannguyenhere/);
> 69 |     await expect(emailLink).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  70 |   });
  71 | });
  72 | 
```