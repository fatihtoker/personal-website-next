import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/projects/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isPlayable = project.kind === "playable-game";
  
  // Link destinations
  const href = isPlayable
    ? `/games/${project.slug}`
    : (project.detailHref || `/projects/${project.slug}`);

  // Action text
  const actionText = isPlayable ? "View game" : "View project";

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--acid)] transition-all duration-300">
      {/* 16:9 Cover Image Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--canvas)]">
        <Image
          src={project.coverSrc}
          alt={project.coverAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={project.featured}
        />
        {/* Cover-derived accent strip at the bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--line)] group-hover:bg-[var(--acid)] transition-colors duration-300" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded bg-[var(--surface-strong)] text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-2 text-[var(--ink)]">
          {project.title}
        </h3>

        <p className="text-sm text-[var(--muted)] line-clamp-3 mb-6 flex-grow">
          {project.cardSummary}
        </p>

        <div>
          <Link
            href={href}
            className="inline-flex items-center justify-center text-sm font-bold text-[var(--ink)] hover:text-[var(--acid)] group-hover:underline transition-colors min-h-[44px]"
          >
            {actionText} <span className="ml-1" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
