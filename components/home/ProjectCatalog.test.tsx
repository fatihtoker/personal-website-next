import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ProjectCatalog from "./ProjectCatalog";
import { Project } from "@/lib/projects/schema";

const mockProjects: Project[] = [
  {
    schemaVersion: 1,
    kind: "playable-game",
    slug: "test-game",
    title: "Test Game",
    cardSummary: "A test game.",
    description: "A test game description.",
    category: "game",
    tags: ["Arcade"],
    coverSrc: "/project-covers/test-game.webp",
    coverAlt: "Alt 1",
    publishedAt: "2026-07-19",
    featured: false,
    sortOrder: 10,
    seo: { title: "Test Game", description: "Play." },
    playablePath: "/playables/test-game/index.html",
    supportedDevices: ["desktop"],
    controls: ["keyboard"],
    recommendedAspectRatio: "16:9",
    minimumViewport: { width: 390, height: 700 },
    source: { repository: "https://github.com/fatihtoker/idea-generator", commit: "a".repeat(40) }
  },
  {
    schemaVersion: 1,
    kind: "showcase",
    slug: "test-app",
    title: "Test App",
    cardSummary: "A test app.",
    description: "A test app description.",
    category: "app",
    tags: ["Utility"],
    coverSrc: "/project-covers/test-app.webp",
    coverAlt: "Alt 2",
    publishedAt: "2026-07-19",
    featured: false,
    sortOrder: 20,
    seo: { title: "Test App", description: "Explore." },
    detailHref: "/test-app"
  }
];

describe("ProjectCatalog", () => {
  test("renders projects, handles filtering and displays correct CTA text by kind", () => {
    render(<ProjectCatalog projects={mockProjects} />);

    // Assert initial visibility of both projects
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Test App")).toBeInTheDocument();

    // Assert correct CTA text by kind
    const gameCta = screen.getByRole("link", { name: /view game/i });
    expect(gameCta).toHaveAttribute("href", "/games/test-game");

    const appCta = screen.getByRole("link", { name: /view project/i });
    expect(appCta).toHaveAttribute("href", "/test-app");

    // Grab filter buttons
    const allBtn = screen.getByRole("button", { name: /^all$/i });
    const gamesBtn = screen.getByRole("button", { name: /^games$/i });
    const appsBtn = screen.getByRole("button", { name: /^apps$/i });

    // Assert initial aria-pressed state
    expect(allBtn).toHaveAttribute("aria-pressed", "true");
    expect(gamesBtn).toHaveAttribute("aria-pressed", "false");
    expect(appsBtn).toHaveAttribute("aria-pressed", "false");

    // Click "Games" filter
    fireEvent.click(gamesBtn);
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
    expect(gamesBtn).toHaveAttribute("aria-pressed", "true");
    expect(appsBtn).toHaveAttribute("aria-pressed", "false");

    // Assert "Games" filter hides the showcase project ("Test App")
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.queryByText("Test App")).not.toBeInTheDocument();

    // Click "Apps" filter
    fireEvent.click(appsBtn);
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
    expect(gamesBtn).toHaveAttribute("aria-pressed", "false");
    expect(appsBtn).toHaveAttribute("aria-pressed", "true");

    // Assert "Apps" filter hides the playable game ("Test Game")
    expect(screen.queryByText("Test Game")).not.toBeInTheDocument();
    expect(screen.getByText("Test App")).toBeInTheDocument();

    // Click "All" filter
    fireEvent.click(allBtn);
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Test App")).toBeInTheDocument();
  });
});
