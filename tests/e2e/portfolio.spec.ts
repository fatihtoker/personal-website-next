import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portfolio Landing Page", () => {
  test("verify landing page elements, navigation, and accessibility", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify home copy
    const heading = page.locator("h1");
    await expect(heading).toHaveText(
      "Full-stack developer turning spare-time ideas into games and useful apps."
    );

    const eyebrow = page.locator("span", { hasText: "Fatih Toker — Games & Apps" });
    await expect(eyebrow).toBeVisible();

    // Verify link to projects anchor
    const exploreBtn = page.locator("a", { hasText: "Explore projects" });
    await expect(exploreBtn).toHaveAttribute("href", "#projects");

    // Verify footer branding and contact details
    await expect(page.locator("footer")).toContainText("Fatih Toker");
    const githubLink = page.locator("footer a", { hasText: "GitHub" });
    await expect(githubLink).toHaveAttribute("href", "https://github.com/fatihtoker");
    await expect(githubLink).toHaveAttribute("target", "_blank");

    const emailLink = page.locator("footer a", { hasText: "Email" });
    await expect(emailLink).toHaveAttribute("href", "mailto:fatihhtoker@gmail.com");

    // Perform accessibility check on home page
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    
    // Filtering critical/serious violations
    const severeViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    expect(severeViolations).toEqual([]);
  });

  test("verify catalog filtering and showcase link", async ({ page }) => {
    await page.goto("/");

    // Filter by Apps (should display LingoLink)
    const appsFilterBtn = page.locator("button", { hasText: /^Apps$/i });
    await appsFilterBtn.click();
    await expect(appsFilterBtn).toHaveAttribute("aria-pressed", "true");

    const lingoLinkCard = page.locator("article", { hasText: "LingoLink" });
    await expect(lingoLinkCard).toBeVisible();

    // Clicking "View project" should navigate to LingoLink bespoke page
    const cta = lingoLinkCard.locator("a", { hasText: "View project" });
    await cta.click();
    await expect(page).toHaveURL(/\/lingolink/);
  });
});
