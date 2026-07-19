import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayableGameBySlug, getAllProjects } from "@/lib/projects/repository";
import GamePlayer from "@/components/games/GamePlayer";

interface GamePlayPageProps {
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

export async function generateMetadata({ params }: GamePlayPageProps): Promise<Metadata> {
  const game = getPlayableGameBySlug(params.slug);
  if (!game) {
    return {
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Play ${game.title}`,
    robots: { index: false, follow: false },
  };
}

export default function GamePlayPage({ params }: GamePlayPageProps) {
  const game = getPlayableGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6 md:py-10 animate-fade-in">
      <GamePlayer game={game} />
    </div>
  );
}
