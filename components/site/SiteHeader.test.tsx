import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import SiteHeader from "./SiteHeader";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

describe("SiteHeader", () => {
  test("assert navigation links and accessibility roles", () => {
    render(<SiteHeader />);

    // Logo link
    const logoLink = screen.getByRole("link", { name: /fatih toker/i });
    expect(logoLink).toHaveAttribute("href", "/");

    // Navigation links
    const projectsLink = screen.getByRole("link", { name: /projects/i });
    expect(projectsLink).toHaveAttribute("href", "/#projects");

    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).toHaveAttribute("href", "/#about");

    // GitHub link opens safely in a new tab
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/fatihtoker");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink.getAttribute("rel")).toContain("noopener");

    // Email link
    const emailLink = screen.getByRole("link", { name: /email/i });
    expect(emailLink).toHaveAttribute("href", "mailto:fatihhtoker@gmail.com");
  });
});
