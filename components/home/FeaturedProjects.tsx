import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/projects/schema";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-[var(--surface-strong)]/30 border-b border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--ink)]">
            Featured Projects
          </h2>
          <p className="text-[var(--muted)] mt-2">
            Some of my favorite or most polished experiments.
          </p>
        </div>

        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {featured.map((project, index) => {
            // Apply asymmetric desktop spans (7/5 grid division)
            let gridSpanClass = "lg:col-span-12"; 
            if (index === 0) {
              gridSpanClass = "lg:col-span-7";
            } else if (index === 1) {
              gridSpanClass = "lg:col-span-5";
            }

            return (
              <div key={project.slug} className={gridSpanClass}>
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
