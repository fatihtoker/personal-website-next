import React from "react";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import GamePlayer from "./GamePlayer";
import { PlayableGame } from "@/lib/projects/schema";

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = MockResizeObserver;

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
  supportedDevices: ["desktop"], // Desktop only
  controls: ["keyboard"],
  recommendedAspectRatio: "16:9",
  minimumViewport: { width: 390, height: 700 },
  source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
};

describe("GamePlayer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("supported viewport renders iframe with correct sandbox/allow", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440); // desktop

    render(<GamePlayer game={mockGame} />);

    const iframe = screen.getByTitle("Test Game game");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "/playables/test-game/index.html");
    expect(iframe).toHaveAttribute("sandbox", "allow-scripts allow-same-origin allow-pointer-lock");
    expect(iframe).toHaveAttribute("allow", "autoplay; fullscreen; gamepad");
  });

  test("unsupported viewport does not render iframe and lists supported devices", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(390); // mobile

    render(<GamePlayer game={mockGame} />);

    expect(screen.queryByTitle("Test Game game")).not.toBeInTheDocument();
    expect(screen.getByText(/desktop/i)).toBeInTheDocument();
  });

  test("iframe load event removes loading message", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);

    render(<GamePlayer game={mockGame} />);

    // Assert loading state initially shown
    expect(screen.getByText(/loading game/i)).toBeInTheDocument();

    const iframe = screen.getByTitle("Test Game game");
    fireEvent.load(iframe);

    // Assert loading state removed
    expect(screen.queryByText(/loading game/i)).not.toBeInTheDocument();
  });

  test("iframe error or trigger shows retry option", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);

    render(<GamePlayer game={mockGame} />);

    const iframe = screen.getByTitle("Test Game game");
    
    // Simulate error by triggering onLoad with an error state, or triggering load error explicitly
    // In our component, we support an onError handler or let user trigger failure.
    // If the component triggers onError:
    fireEvent.error(iframe);

    expect(screen.getByText(/the game could not be loaded/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  test("reload button reconstructs iframe by incrementing key", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);

    render(<GamePlayer game={mockGame} />);

    const reloadBtn = screen.getByRole("button", { name: /reload game/i });
    const oldIframe = screen.getByTitle("Test Game game");

    fireEvent.click(reloadBtn);

    const newIframe = screen.getByTitle("Test Game game");
    expect(newIframe).toBeInTheDocument();
    // Since React recreation replaces DOM node, they will be different references
    expect(newIframe).not.toBe(oldIframe);
  });

  test("enter fullscreen calls requestFullscreen on wrapper", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);
    
    // Mock requestFullscreen on HTMLDivElement prototype
    const requestFullscreenMock = vi.fn().mockResolvedValue(undefined);
    HTMLDivElement.prototype.requestFullscreen = requestFullscreenMock;

    render(<GamePlayer game={mockGame} />);

    const fullscreenBtn = screen.getByRole("button", { name: /enter fullscreen/i });
    
    await act(async () => {
      fireEvent.click(fullscreenBtn);
    });

    expect(requestFullscreenMock).toHaveBeenCalled();
  });
});
