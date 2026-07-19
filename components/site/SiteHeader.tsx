"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  
  // Detect if on the play route: ^/games/[slug]/play
  const isPlayRoute = /^\/games\/[a-z0-9]+(?:-[a-z0-9]+)*\/play$/.test(pathname);

  if (isPlayRoute) {
    return (
      <header className="site-header-play border-b border-[var(--line)] bg-[var(--canvas)] py-4">
        <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-[var(--ink)] font-display text-lg font-bold tracking-tight hover:text-[var(--acid)] transition-colors min-h-[44px] inline-flex items-center"
          >
            ← Home
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-[var(--line)] bg-[var(--canvas)] py-4 sticky top-0 z-50">
      <nav aria-label="Primary navigation" className="mx-auto max-w-[1280px] px-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="text-[var(--ink)] font-display text-xl font-bold tracking-tight hover:text-[var(--acid)] transition-colors min-h-[44px] inline-flex items-center"
        >
          Fatih Toker
        </Link>
        
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <Link
            href="/#projects"
            className="text-[var(--muted)] hover:text-[var(--ink)] font-medium text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            Projects
          </Link>
          <Link
            href="/#about"
            className="text-[var(--muted)] hover:text-[var(--ink)] font-medium text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            About
          </Link>
          <a
            href="https://github.com/fatihtoker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--ink)] font-medium text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            GitHub
          </a>
          <a
            href="mailto:fatihhtoker@gmail.com"
            className="text-[var(--muted)] hover:text-[var(--ink)] font-medium text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            Email
          </a>
        </div>
      </nav>
    </header>
  );
}
