# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> navbar has 6 navigation items
- Location: src/__tests__/e2e/navigation.spec.ts:17:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('nav a')
Expected: 6
Received: 7
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('nav a')
    14 × locator resolved to 7 elements
       - unexpected value "7"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - link "Minh Quan Logo":
        - /url: /
        - generic:
          - img "Minh Quan Logo"
    - generic:
      - button "Toggle Theme" [ref=e4]:
        - img [ref=e7]
        - generic [ref=e10]: THEME // LIGHT
      - generic [ref=e17]: HOME
    - main [ref=e18]:
      - generic [ref=e24]:
        - generic [ref=e26]:
          - heading "Minh Quan" [level=1] [ref=e27]
          - heading "loves moving things around." [level=2] [ref=e29]:
            - text: loves
            - generic [ref=e30]: moving
            - text: things around.
        - img "Minh Quan - Standing Portrait" [ref=e33]
    - generic [ref=e34]:
      - generic [ref=e36]: MINHQUAN // HOME
      - navigation [ref=e37]:
        - link "Minh Quan Logo" [ref=e40] [cursor=pointer]:
          - /url: /
          - img "Minh Quan Logo" [ref=e42]
        - link "Home" [ref=e44] [cursor=pointer]:
          - /url: /
        - link "Works" [ref=e45] [cursor=pointer]:
          - /url: /works
        - link "Takes" [ref=e46] [cursor=pointer]:
          - /url: /takes
        - link "Play" [ref=e47] [cursor=pointer]:
          - /url: /play
        - link "Freebies" [ref=e48] [cursor=pointer]:
          - /url: /freebies
        - link "Contacts" [ref=e49] [cursor=pointer]:
          - /url: /contacts
  - button "Open Next.js Dev Tools" [ref=e55] [cursor=pointer]:
    - img [ref=e56]
  - alert [ref=e59]
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
> 20 |     await expect(navLinks).toHaveCount(6);
     |                            ^ Error: expect(locator).toHaveCount(expected) failed
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
  69 |     await expect(emailLink).toBeVisible();
  70 |   });
  71 | });
  72 | 
```