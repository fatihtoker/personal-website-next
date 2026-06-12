"use client";

import { motion } from "framer-motion";
import { Flame, Coins, Trophy, Sparkles } from "lucide-react";

const FEATURES = [
  {
    title: "Earn Lingots",
    description: "The official currency of LingoLink. Win games, earn Lingots, and spend them in the store for epic power-ups.",
    icon: Coins,
    colorClass: "text-lingo-gold",
    bgClass: "bg-lingo-gold/10",
  },
  {
    title: "Maintain Streaks",
    description: "Play every day to keep your streak alive. Reach higher milestones for exclusive rewards and multiplier bonuses.",
    icon: Flame,
    colorClass: "text-lingo-accent",
    bgClass: "bg-lingo-accent/10",
  },
  {
    title: "Climb the Ranks",
    description: "Earn XP for every correct answer. Level up your profile and unlock new difficulty tiers and avatars.",
    icon: Trophy,
    colorClass: "text-lingo-xp",
    bgClass: "bg-lingo-xp/10",
  },
];

const POWER_UPS = [
  { name: "Skip Link", desc: "Pass on a tricky phrase", emoji: "⏭️" },
  { name: "Sharp Mind", desc: "Double points for the next guess", emoji: "🧠" },
  { name: "Narrow it Down", desc: "Removes two wrong options", emoji: "✂️" },
  { name: "Language Hint", desc: "Reveals the language family", emoji: "💡" },
];

export default function GamificationFeatures() {
  return (
    <section className="py-24 bg-lingo-bg relative z-20 border-t border-lingo-border">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: The Core Engine */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lingo-primary/20 text-lingo-primary-light font-bold text-sm">
                <Sparkles size={16} /> The Gamification Engine
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-lingo-text">
                Play to earn. <br/>
                <span className="text-lingo-gold">Use your Lingots wisely.</span>
              </h2>
              <p className="text-xl text-lingo-text-secondary">
                LingoLink isn&apos;t just a quiz—it&apos;s a fully-fledged game. Build your wealth, 
                maintain your daily streaks, and deploy tactical power-ups when you&apos;re stuck.
              </p>
            </div>

            <div className="space-y-8">
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div 
                    key={feat.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex gap-6 items-start"
                  >
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${feat.bgClass} ${feat.colorClass}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-lingo-text mb-2">{feat.title}</h4>
                      <p className="text-lingo-text-secondary leading-relaxed">{feat.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right Side: Powerups Visual */}
          <motion.div 
            className="flex-1 w-full max-w-md lg:max-w-none relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Ambient Background Blur */}
            <div className="absolute inset-0 bg-lingo-energy/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative bg-lingo-surface border-2 border-lingo-surface-elevated rounded-[32px] p-8 shadow-2xl">
              <div className="flex justify-between items-end mb-8 border-b border-lingo-border pb-6">
                <div>
                  <p className="text-sm font-bold text-lingo-text-secondary uppercase tracking-wider mb-1">Your Balance</p>
                  <div className="text-4xl font-black text-lingo-gold flex items-center gap-3">
                    <Coins size={36} className="text-lingo-gold fill-lingo-gold/20" />
                    2,450
                  </div>
                </div>
                <div className="px-4 py-2 bg-lingo-primary rounded-xl font-bold text-white shadow-lg shadow-lingo-primary/30">
                  Store
                </div>
              </div>

              <h5 className="font-bold text-lingo-text mb-4">Tactical Power-Ups</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POWER_UPS.map((power, idx) => (
                  <motion.div 
                    key={power.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-lingo-bg p-4 rounded-2xl border border-lingo-border hover:border-lingo-energy transition-colors cursor-pointer group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">{power.emoji}</div>
                    <div className="font-bold text-lingo-text">{power.name}</div>
                    <div className="text-xs text-lingo-text-secondary mt-1">{power.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
