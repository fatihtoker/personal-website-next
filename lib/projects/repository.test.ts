import { describe, test, expect, vi } from "vitest";

vi.mock("@/content/projects.json", () => ({
  default: [
    {
      schemaVersion: 1,
      kind: "playable-game" as const,
      slug: "chitin-colony",
      title: "Chitin Colony",
      cardSummary: "Ant game.",
      description: "Ant game desc.",
      category: "game" as const,
      tags: ["Strategy"],
      coverSrc: "/project-covers/chitin-colony.webp",
      coverAlt: "Alt text.",
      publishedAt: "2026-07-19",
      featured: true,
      sortOrder: 10,
      seo: { title: "Chitin Colony", description: "Play Chitin Colony." },
      playablePath: "/playables/chitin-colony/index.html",
      supportedDevices: ["desktop" as const],
      controls: ["mouse" as const],
      recommendedAspectRatio: "16:9",
      minimumViewport: { width: 390, height: 700 },
      source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
    },
    {
      schemaVersion: 1,
      kind: "showcase" as const,
      slug: "lingolink",
      title: "LingoLink",
      cardSummary: "LingoLink game.",
      description: "LingoLink desc.",
      category: "app" as const,
      tags: ["Mobile"],
      coverSrc: "/project-covers/lingolink.webp",
      coverAlt: "Alt text.",
      publishedAt: "2026-07-19",
      featured: false,
      sortOrder: 70,
      seo: { title: "LingoLink", description: "Learn about LingoLink." },
      detailHref: "/lingolink"
    },
    {
      schemaVersion: 1,
      kind: "playable-game" as const,
      slug: "sunset-circuit",
      title: "Sunset Circuit",
      cardSummary: "Racing game.",
      description: "Racing game desc.",
      category: "game" as const,
      tags: ["Racing"],
      coverSrc: "/project-covers/sunset-circuit.webp",
      coverAlt: "Alt text.",
      publishedAt: "2026-07-19",
      featured: true,
      sortOrder: 20,
      seo: { title: "Sunset Circuit", description: "Play Sunset Circuit." },
      playablePath: "/playables/sunset-circuit/index.html",
      supportedDevices: ["desktop" as const],
      controls: ["keyboard" as const],
      recommendedAspectRatio: "16:9",
      minimumViewport: { width: 390, height: 700 },
      source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "b".repeat(40) }
    }
  ]
}));

import { getAllProjects, getFeaturedProjects, getProjectBySlug, getPlayableGameBySlug } from "./repository";

describe("projects repository", () => {
  test("getAllProjects returns all projects sorted by sortOrder", () => {
    const projects = getAllProjects();
    expect(projects).toHaveLength(3);
    expect(projects[0].slug).toBe("chitin-colony");
    expect(projects[1].slug).toBe("sunset-circuit");
    expect(projects[2].slug).toBe("lingolink");
  });

  test("getFeaturedProjects returns only featured projects sorted by sortOrder", () => {
    const featured = getFeaturedProjects();
    expect(featured).toHaveLength(2);
    expect(featured[0].slug).toBe("chitin-colony");
    expect(featured[1].slug).toBe("sunset-circuit");
  });

  test("getProjectBySlug finds a project by slug", () => {
    const project = getProjectBySlug("lingolink");
    expect(project).toBeDefined();
    expect(project?.title).toBe("LingoLink");
  });

  test("getProjectBySlug returns undefined for non-existent slug", () => {
    const project = getProjectBySlug("non-existent");
    expect(project).toBeUndefined();
  });

  test("getPlayableGameBySlug returns a game only if it is a playable-game", () => {
    const game = getPlayableGameBySlug("chitin-colony");
    expect(game).toBeDefined();
    expect(game?.kind).toBe("playable-game");

    const showcaseAsGame = getPlayableGameBySlug("lingolink");
    expect(showcaseAsGame).toBeUndefined();
  });
});
