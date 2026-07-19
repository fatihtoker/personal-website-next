import { describe, test, expect } from "vitest";
import { classifyViewport, supportsDevice } from "./device";
import { PlayableGame } from "./schema";

const mockGame: PlayableGame = {
  schemaVersion: 1,
  kind: "playable-game",
  slug: "test-game",
  title: "Test Game",
  cardSummary: "Summary",
  description: "Description",
  category: "game",
  tags: ["Arcade"],
  coverSrc: "/cover.webp",
  coverAlt: "Alt",
  publishedAt: "2026-07-19",
  featured: false,
  sortOrder: 10,
  seo: { title: "Title", description: "Desc" },
  playablePath: "/playables/test-game/index.html",
  supportedDevices: ["desktop", "tablet"],
  controls: ["keyboard"],
  recommendedAspectRatio: "16:9",
  minimumViewport: { width: 390, height: 700 },
  source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
};

describe("device compatibility classification", () => {
  test("classifyViewport resolves viewport boundaries", () => {
    expect(classifyViewport(767)).toBe("mobile");
    expect(classifyViewport(768)).toBe("tablet");
    expect(classifyViewport(1023)).toBe("tablet");
    expect(classifyViewport(1024)).toBe("desktop");
    expect(classifyViewport(1440)).toBe("desktop");
  });

  test("supportsDevice validates platform support", () => {
    expect(supportsDevice(mockGame, "desktop")).toBe(true);
    expect(supportsDevice(mockGame, "tablet")).toBe(true);
    expect(supportsDevice(mockGame, "mobile")).toBe(false);
  });
});
