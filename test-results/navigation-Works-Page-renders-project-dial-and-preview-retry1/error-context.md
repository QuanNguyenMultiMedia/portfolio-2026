# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Works Page >> renders project dial and preview
- Location: src/__tests__/e2e/navigation.spec.ts:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/2026 Reel|Herond Browser|Defrasoft/)
Expected: visible
Error: strict mode violation: getByText(/2026 Reel|Herond Browser|Defrasoft/) resolved to 3 elements:
    1) <h3 class="font-display uppercase tracking-tighter leading-[0.85] font-bold transition-all duration-300 origin-left inline-block group-hover/wheel-item:skew-x-[-10deg] text-primary animate-pulse-subtle text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]">2026 Reel</h3> aka getByRole('heading', { name: '2026 Reel' })
    2) <h3 class="font-display uppercase tracking-tighter leading-[0.85] font-bold transition-all duration-300 origin-left inline-block group-hover/wheel-item:skew-x-[-10deg] text-foreground/15 group-hover/wheel-item:text-foreground/45 text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]">Herond Browser</h3> aka getByRole('heading', { name: 'Herond Browser' })
    3) <h3 class="font-display uppercase tracking-tighter leading-[0.85] font-bold transition-all duration-300 origin-left inline-block group-hover/wheel-item:skew-x-[-10deg] text-foreground/15 group-hover/wheel-item:text-foreground/45 text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]">Defrasoft</h3> aka getByRole('heading', { name: 'Defrasoft' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/2026 Reel|Herond Browser|Defrasoft/)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img "Logo" [ref=e5]
    - generic [ref=e10]:
      - generic [ref=e11]: Ready
      - generic [ref=e12]: 61%
  - generic [ref=e15]:
    - generic:
      - link "Minh Quan Logo":
        - /url: /
        - generic:
          - img "Minh Quan Logo"
    - generic:
      - button "Toggle Theme" [ref=e17]:
        - img [ref=e20]
      - generic [ref=e28]: WORKS
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e34]: Selected Works
        - generic [ref=e35]:
          - generic [ref=e36]:
            - img "2026 Reel" [ref=e39]
            - paragraph [ref=e42]: Works I love from the past year, mainly from my time as an inhouse creative for Herond Labs
          - generic [ref=e44]:
            - generic [ref=e47]:
              - generic [ref=e49] [cursor=pointer]:
                - heading "2026 Reel" [level=3] [ref=e50]
                - generic [ref=e51]: ↗
              - generic [ref=e53] [cursor=pointer]:
                - heading "Herond Browser" [level=3] [ref=e54]
                - generic: ↗
              - generic [ref=e56] [cursor=pointer]:
                - heading "Defrasoft" [level=3] [ref=e57]
                - generic: ↗
              - generic [ref=e59] [cursor=pointer]:
                - heading "Z Cung Viet" [level=3] [ref=e60]
                - generic: ↗
              - generic [ref=e62] [cursor=pointer]:
                - heading "Select Freelance Work" [level=3] [ref=e63]
                - generic: ↗
            - generic [ref=e65] [cursor=pointer]:
              - generic:
                - generic: "01"
    - generic [ref=e68]:
      - generic [ref=e70]: MINHQUAN // WORKS
      - navigation [ref=e71]:
        - link "Minh Quan Logo" [ref=e74] [cursor=pointer]:
          - /url: /
          - img "Minh Quan Logo" [ref=e76]
        - link "Home" [ref=e78] [cursor=pointer]:
          - /url: /
        - link "Works" [ref=e79] [cursor=pointer]:
          - /url: /works
        - link "Takes" [ref=e80] [cursor=pointer]:
          - /url: /takes
        - link "Play" [ref=e81] [cursor=pointer]:
          - /url: /play
        - link "Freebies" [ref=e82] [cursor=pointer]:
          - /url: /freebies
        - link "Contacts" [ref=e83] [cursor=pointer]:
          - /url: /contacts
  - button "Open Next.js Dev Tools" [ref=e89] [cursor=pointer]:
    - img [ref=e90]
  - alert [ref=e93]
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
> 43 |     await expect(projectTitle).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
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