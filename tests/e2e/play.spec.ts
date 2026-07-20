import { test, expect } from "@playwright/test";

test.describe("Play Game Routes and Layouts", () => {
  test("verify invalid game detail slug returns 404", async ({ page }) => {
    const response = await page.goto("/games/non-existent-game");
    expect(response?.status()).toBe(404);
  });

  test("verify invalid game play slug returns 404", async ({ page }) => {
    const response = await page.goto("/games/non-existent-game/play");
    expect(response?.status()).toBe(404);
  });

  const games = [
    { slug: "chitin-colony", name: "Chitin Colony", ratio: "16:9" },
    { slug: "sunset-circuit", name: "Sunset Circuit", ratio: "16:9" },
    { slug: "afterimage-heist", name: "Afterimage Heist", ratio: "9:16" },
    { slug: "voxel-crush", name: "Voxel Crush", ratio: "16:9" },
    { slug: "ink-slide", name: "Ink Slide", ratio: "16:9" },
    { slug: "snap-slice", name: "Snap Slice", ratio: "9:16" }
  ];

  for (const game of games) {
    test(`verify game details and desktop load for ${game.slug}`, async ({ page }) => {
      await page.goto(`/games/${game.slug}`);
      await expect(page.locator("h1")).toContainText(game.name);
      await expect(page.locator("text=Supported Platforms")).toBeVisible();

      const playBtn = page.locator("a", { hasText: "Play Now" });
      await expect(playBtn).toBeVisible();
      await playBtn.click();

      await expect(page).toHaveURL(new RegExp(`/games/${game.slug}/play`));
      
      const iframe = page.locator("iframe");
      await expect(iframe).toBeVisible();
      
      const src = await iframe.getAttribute("src");
      expect(src).toBe(`/playables/${game.slug}/index.html`);
    });
  }
});
