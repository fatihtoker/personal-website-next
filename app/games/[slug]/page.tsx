import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayableGameBySlug, getAllProjects } from "@/lib/projects/repository";
import DeviceBadges from "@/components/games/DeviceBadges";
import PlayAvailability from "@/components/games/PlayAvailability";

interface GameDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  const playables = projects.filter((p) => p.kind === "playable-game");
  return playables.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const game = getPlayableGameBySlug(params.slug);
  if (!game) {
    return {};
  }
  return {
    title: game.seo.title,
    description: game.seo.description,
    openGraph: {
      title: game.seo.title,
      description: game.seo.description,
      images: [
        {
          url: game.coverSrc,
          width: 1600,
          height: 900,
          alt: game.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game.seo.title,
      description: game.seo.description,
      images: [game.coverSrc],
    },
  };
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const game = getPlayableGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  const formattedControls = game.controls
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
    .join(", ");

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
              src={game.coverSrc}
              alt={game.coverAlt}
              fill
              sizes="(max-width: 1023px) 100vw, 700px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Game Details Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--acid)]">
              {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--ink)] mt-1">
              {game.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag) => (
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
            {game.description}
          </p>

          <hr className="border-[var(--line)]" />

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="block text-[var(--muted)] font-medium mb-2">Supported Platforms</span>
              <DeviceBadges game={game} />
            </div>
            <div>
              <span className="block text-[var(--muted)] font-medium mb-2">Controls</span>
              <span className="text-[var(--ink)] font-semibold">{formattedControls}</span>
            </div>
          </div>

          <hr className="border-[var(--line)]" />

          <div className="mt-2">
            <PlayAvailability game={game} />
          </div>
        </div>
      </div>
    </article>
  );
}
