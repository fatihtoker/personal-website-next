"use client";

import { motion, Variants } from "framer-motion";
import { Compass, Calendar, Zap, Globe, Shuffle, Dumbbell } from "lucide-react";

const GAME_MODES = [
  {
    title: "Journey Mode",
    description: "Progress through curated levels, increasing in difficulty as your linguistic intuition sharpens.",
    icon: Compass,
    colorClass: "text-lingo-journey",
    bgClass: "bg-lingo-journey/10",
    borderClass: "hover:border-lingo-journey",
    colSpan: "md:col-span-2",
  },
  {
    title: "Daily Challenge",
    description: "A unique challenge every day to keep your streak alive.",
    icon: Calendar,
    colorClass: "text-lingo-daily",
    bgClass: "bg-lingo-daily/10",
    borderClass: "hover:border-lingo-daily",
    colSpan: "md:col-span-1",
  },
  {
    title: "RapidLink",
    description: "Race against the clock in this hyper-fast survival mode.",
    icon: Zap,
    colorClass: "text-lingo-accent",
    bgClass: "bg-lingo-accent/10",
    borderClass: "hover:border-lingo-accent",
    colSpan: "md:col-span-1",
  },
  {
    title: "Classic",
    description: "The pure, unadulterated language identification experience.",
    icon: Globe,
    colorClass: "text-lingo-primary-light",
    bgClass: "bg-lingo-primary-light/10",
    borderClass: "hover:border-lingo-primary-light",
    colSpan: "md:col-span-1",
  },
  {
    title: "Confusion",
    description: "Similar sounding languages pitted against each other to trick you.",
    icon: Shuffle,
    colorClass: "text-lingo-confusion",
    bgClass: "bg-lingo-confusion/10",
    borderClass: "hover:border-lingo-confusion",
    colSpan: "md:col-span-1",
  },
  {
    title: "Practice",
    description: "Hone your skills without the pressure of a timer or lives.",
    icon: Dumbbell,
    colorClass: "text-lingo-practice",
    bgClass: "bg-lingo-practice/10",
    borderClass: "hover:border-lingo-practice",
    colSpan: "md:col-span-2",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function GameModes() {
  return (
    <section className="py-24 bg-lingo-bg relative z-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-lingo-text">
            6 Ways to Play
          </h2>
          <p className="text-xl text-lingo-text-secondary max-w-2xl mx-auto">
            From relaxed practice sessions to heart-pounding survival modes, 
            there&apos;s a mode for every mood.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {GAME_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className={`relative overflow-hidden p-8 rounded-3xl bg-lingo-surface border-2 border-lingo-surface-elevated transition-colors duration-300 ${mode.borderClass} ${mode.colSpan} group`}
              >
                {/* Background ambient glow on hover */}
                <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl ${mode.bgClass} -z-10`} />
                
                <div className="flex flex-col h-full z-10 relative">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${mode.bgClass} ${mode.colorClass}`}>
                    <Icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-lingo-text mb-3">
                    {mode.title}
                  </h3>
                  <p className="text-lingo-text-secondary flex-1">
                    {mode.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
