import { Metadata } from "next";
import HeroSection from "../../components/lingolink/HeroSection";
import GameModes from "../../components/lingolink/GameModes";
import GamificationFeatures from "../../components/lingolink/GamificationFeatures";
import LeaderboardTeaser from "../../components/lingolink/LeaderboardTeaser";
import Footer from "../../components/lingolink/Footer";

export const metadata: Metadata = {
  title: "LingoLink - Test Your Linguistic Instincts",
  description: "Connect words, connect worlds. LingoLink is a fast-paced, highly gamified mobile game where players test their linguistic instincts.",
};

export default function LingoLinkLandingPage() {
  return (
    <div className="min-h-screen bg-lingo-bg text-lingo-text font-sans selection:bg-lingo-primary-light/30 selection:text-lingo-primary-light">
      <HeroSection />
      <GameModes />
      <GamificationFeatures />
      <LeaderboardTeaser />
      <Footer />
    </div>
  );
}
