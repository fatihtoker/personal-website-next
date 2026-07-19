"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/projects/schema";

interface ProjectCatalogProps {
  projects: Project[];
}

type CatalogFilter = "all" | "game" | "app";

export default function ProjectCatalog({ projects }: ProjectCatalogProps) {
  const [filter, setFilter] = useState<CatalogFilter>("all");

  const visible = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section id="projects" className="py-16 md:py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--ink)]">
              All Projects
            </h2>
            <p className="text-[var(--muted)] mt-2">
              Browse the catalog of games and applications.
            </p>
          </div>

          {/* Filters */}
          <div
            role="group"
            aria-label="Filter projects"
            className="flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] p-1.5 rounded-[var(--radius-sm)] self-start md:self-auto"
          >
            {(["all", "game", "app"] as const).map((type) => {
              const label = type === "all" ? "All" : type === "game" ? "Games" : "Apps";
              const isActive = filter === type;
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 text-sm font-bold rounded-[calc(var(--radius-sm)-4px)] transition-all min-h-[44px] min-w-[64px] ${
                    isActive
                      ? "bg-[var(--acid)] text-[var(--canvas)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-[var(--radius-sm)]">
            <p className="text-[var(--muted)] text-base">No projects found matching this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
