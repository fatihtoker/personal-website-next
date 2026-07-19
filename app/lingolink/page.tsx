import { Metadata } from "next";
import Link from "next/link";
import HeroSection from "../../components/lingolink/HeroSection";
import GameModes from "../../components/lingolink/GameModes";
import GamificationFeatures from "../../components/lingolink/GamificationFeatures";
import LeaderboardTeaser from "../../components/lingolink/LeaderboardTeaser";
import Footer from "../../components/lingolink/Footer";

export const metadata: Metadata = {
  title: "LingoLink | Fatih Toker",
  description: "Discover LingoLink, a fast-paced mobile language challenge by Fatih Toker.",
};

export default function LingoLinkLandingPage() {
  return (
    <div className="min-h-screen bg-lingo-bg text-lingo-text font-sans selection:bg-lingo-primary-light/30 selection:text-lingo-primary-light">
      <div className="mx-auto max-w-[1280px] px-6 pt-6">
        <Link
          href="/#projects"
          className="inline-flex items-center text-sm text-[rgba(255,255,255,0.7)] hover:text-white transition-colors min-h-[44px]"
        >
          &larr; Back to projects
        </Link>
      </div>
      <HeroSection />
      <GameModes />
      <GamificationFeatures />
      <LeaderboardTeaser />
      <Footer />
    </div>
  );
}
