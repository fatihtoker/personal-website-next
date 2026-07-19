"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const isPlayRoute = /^\/games\/[a-z0-9]+(?:-[a-z0-9]+)*\/play$/.test(pathname);

  if (isPlayRoute) {
    return null;
  }

  return (
    <footer id="about" className="border-t border-[var(--line)] bg-[var(--surface)] py-12 mt-auto">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-[var(--ink)] font-display text-lg font-bold">Fatih Toker</h2>
          <p className="text-[var(--muted)] text-sm mt-2 max-w-md">
            Full-stack developer turning spare-time ideas into games and useful apps.
          </p>
        </div>
        <div className="flex gap-6">
          <a
            href="https://github.com/fatihtoker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            GitHub
          </a>
          <a
            href="mailto:fatihhtoker@gmail.com"
            className="text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors min-h-[44px] inline-flex items-center"
          >
            Email
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-6 mt-8 pt-8 border-t border-[var(--line)]/50 text-center">
        <p className="text-[var(--muted)]/50 text-xs">
          &copy; {new Date().getFullYear()} Fatih Toker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
