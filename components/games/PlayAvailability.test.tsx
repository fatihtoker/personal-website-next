import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import PlayAvailability from "./PlayAvailability";
import { PlayableGame } from "@/lib/projects/schema";

const desktopOnlyGame: PlayableGame = {
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
  supportedDevices: ["desktop"],
  controls: ["keyboard"],
  recommendedAspectRatio: "16:9",
  minimumViewport: { width: 390, height: 700 },
  source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
};

describe("PlayAvailability", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders play button on desktop width", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);
    
    render(<PlayAvailability game={desktopOnlyGame} />);
    
    const playLink = screen.getByRole("link", { name: /play now/i });
    expect(playLink).toHaveAttribute("href", "/games/test-game/play");
    expect(screen.queryByText(/available on:/i)).not.toBeInTheDocument();
  });

  test("renders compatibility warning on mobile width", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(390);
    
    render(<PlayAvailability game={desktopOnlyGame} />);
    
    expect(screen.queryByRole("link", { name: /play now/i })).not.toBeInTheDocument();
    expect(screen.getByText(/available on: Desktop/i)).toBeInTheDocument();
  });
});
