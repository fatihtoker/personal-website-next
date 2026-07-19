import { describe, test, expect } from "vitest";
import { projectSchema, projectManifestSchema } from "./schema";

const playableFixture = {
  schemaVersion: 1,
  kind: "playable-game" as const,
  slug: "test-game",
  title: "Test Game",
  cardSummary: "A deterministic test game.",
  description: "A complete description used by the detail page.",
  category: "game" as const,
  tags: ["Arcade"],
  coverSrc: "/project-covers/test-game.webp",
  coverAlt: "A test arena with a single game token.",
  publishedAt: "2026-07-19",
  featured: false,
  sortOrder: 10,
  seo: { title: "Test Game | Fatih Toker", description: "Play Test Game." },
  playablePath: "/playables/test-game/index.html",
  supportedDevices: ["desktop" as const, "mobile" as const],
  controls: ["keyboard" as const, "touch" as const],
  recommendedAspectRatio: "16:9",
  minimumViewport: { width: 390, height: 700 },
  source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
};

const showcaseFixture = {
  schemaVersion: 1,
  kind: "showcase" as const,
  slug: "lingolink",
  title: "LingoLink",
  cardSummary: "A fast-paced mobile game for testing your linguistic instincts.",
  description: "Connect words and languages through quick, highly replayable challenges built around linguistic intuition.",
  category: "app" as const,
  tags: ["Mobile", "Language", "Game"],
  coverSrc: "/project-covers/lingolink.webp",
  coverAlt: "LingoLink language challenge displayed on a mobile phone.",
  publishedAt: "2026-07-19",
  featured: false,
  sortOrder: 70,
  seo: {
    title: "LingoLink | Fatih Toker",
    description: "Discover LingoLink, a fast-paced mobile language challenge by Fatih Toker."
  },
  detailHref: "/lingolink"
};

describe("projectSchema", () => {
  test("parses a valid playable game", () => {
    const result = projectSchema.safeParse(playableFixture);
    expect(result.success).toBe(true);
  });

  test("parses a valid showcase project", () => {
    const result = projectSchema.safeParse(showcaseFixture);
    expect(result.success).toBe(true);
  });

  test("fails if a playable game is missing supportedDevices", () => {
    const invalidPlayable = { ...playableFixture } as any;
    delete invalidPlayable.supportedDevices;
    const result = projectSchema.safeParse(invalidPlayable);
    expect(result.success).toBe(false);
  });

  test("fails if slug contains directory traversal", () => {
    const invalidPlayable = { ...playableFixture, slug: "../escape" };
    const result = projectSchema.safeParse(invalidPlayable);
    expect(result.success).toBe(false);
  });

  test("fails if slug format is invalid", () => {
    const invalidPlayable = { ...playableFixture, slug: "Invalid-Slug" };
    const result = projectSchema.safeParse(invalidPlayable);
    expect(result.success).toBe(false);
  });
});

describe("projectManifestSchema", () => {
  test("parses a valid manifest", () => {
    const result = projectManifestSchema.safeParse([playableFixture, showcaseFixture]);
    expect(result.success).toBe(true);
  });

  test("fails if there are duplicate slugs", () => {
    const result = projectManifestSchema.safeParse([
      playableFixture,
      { ...showcaseFixture, slug: "test-game" }
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("Duplicate slug: test-game");
    }
  });
});
