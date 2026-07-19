import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects/repository";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  const standardShowcases = projects.filter(
    (p) => p.kind === "showcase" && !p.detailHref
  );
  return standardShowcases.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project || project.kind !== "showcase" || project.detailHref) {
    return {};
  }
  return {
    title: project.seo.title,
    description: project.seo.description,
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      images: [
        {
          url: project.coverSrc,
          width: 1600,
          height: 900,
          alt: project.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
      images: [project.coverSrc],
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project || project.kind !== "showcase" || project.detailHref) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[1280px] px-6 py-12 md:py-20 animate-fade-in">
      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--ink)] font-semibold transition-colors min-h-[44px]"
        >
          &larr; Back to projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cover Artwork Column */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <Image
              src={project.coverSrc}
              alt={project.coverAlt}
              fill
              sizes="(max-width: 1023px) 100vw, 700px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Project Details Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--acid)]">
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--ink)] mt-1">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <hr className="border-[var(--line)]" />

          <p className="text-base text-[var(--muted)] leading-relaxed">
            {project.description}
          </p>

          <hr className="border-[var(--line)]" />
        </div>
      </div>
    </article>
  );
}
