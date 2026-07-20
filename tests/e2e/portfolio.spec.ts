import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portfolio Landing Page", () => {
  test("verify landing page elements, navigation, and accessibility", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toHaveText(
      "Full-stack developer turning spare-time ideas into games and useful apps."
    );

    const eyebrow = page.locator("span", { hasText: "Fatih Toker — Games & Apps" });
    await expect(eyebrow).toBeVisible();

    const exploreBtn = page.locator("a", { hasText: "Explore projects" });
    await expect(exploreBtn).toHaveAttribute("href", "#projects");

    await expect(page.locator("footer")).toContainText("Fatih Toker");
    const githubLink = page.locator("footer a", { hasText: "GitHub" });
    await expect(githubLink).toHaveAttribute("href", "https://github.com/fatihtoker");

    const emailLink = page.locator("footer a", { hasText: "Email" });
    await expect(emailLink).toHaveAttribute("href", "mailto:fatihhtoker@gmail.com");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    
    const severeViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    expect(severeViolations).toEqual([]);
  });

  test("verify catalog filtering, featured section, and detail routes", async ({ page }) => {
    await page.goto("/");

    // Verify featured games render at the top
    const featuredSection = page.locator("section", { hasText: "Featured Projects" });
    await expect(featuredSection).toBeVisible();
    
    const featuredTitles = featuredSection.locator("h3");
    await expect(featuredTitles.nth(0)).toHaveText("Chitin Colony: Hex Empire");
    await expect(featuredTitles.nth(1)).toHaveText("Sunset Circuit");
    await expect(featuredTitles.nth(2)).toHaveText("Afterimage Heist");

    // Verify catalog has all 7 projects under the 'All' filter
    const allFilterBtn = page.locator("button", { hasText: /^All$/i });
    await allFilterBtn.click();
    
    const projectCards = page.locator("#projects article");
    await expect(projectCards).toHaveCount(7);

    // Filter by Apps (should display LingoLink)
    const appsFilterBtn = page.locator("button", { hasText: /^Apps$/i });
    await appsFilterBtn.click();
    await expect(projectCards).toHaveCount(1);
    await expect(projectCards.locator("h3")).toHaveText("LingoLink");

    // Filter by Games (should display 6 games)
    const gamesFilterBtn = page.locator("button", { hasText: /^Games$/i });
    await gamesFilterBtn.click();
    await expect(projectCards).toHaveCount(6);

    // Click details of Chitin Colony and verify its game detail route
    const chitinCard = projectCards.filter({ hasText: "Chitin Colony" });
    await expect(chitinCard).toBeVisible();
    
    const viewBtn = chitinCard.locator("a", { hasText: "View game" });
    await viewBtn.click();
    await expect(page).toHaveURL(/\/games\/chitin-colony/);
    
    // Go back and verify LingoLink bespoke navigation
    await page.goto("/");
    const appsFilterBtn2 = page.locator("button", { hasText: /^Apps$/i });
    await appsFilterBtn2.click();
    const lingoCard = page.locator("#projects article", { hasText: "LingoLink" });
    await lingoCard.locator("a", { hasText: "View project" }).click();
    await expect(page).toHaveURL(/\/lingolink/);
  });
});
