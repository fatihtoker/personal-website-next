import { test, expect } from "@playwright/test";

test.describe("Play Game Route Guards", () => {
  test("verify invalid game detail slug returns 404", async ({ page }) => {
    const response = await page.goto("/games/non-existent-game");
    expect(response?.status()).toBe(404);
  });

  test("verify invalid game play slug returns 404", async ({ page }) => {
    const response = await page.goto("/games/non-existent-game/play");
    expect(response?.status()).toBe(404);
  });
});
