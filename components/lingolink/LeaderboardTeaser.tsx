"use client";

import { motion } from "framer-motion";
import { Users, Crown, Medal, TrendingUp } from "lucide-react";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "LinguistPrime", score: "12,450", color: "text-lingo-gold", bg: "bg-lingo-gold/10", icon: Crown },
  { rank: 2, name: "WordNinja99", score: "11,200", color: "text-gray-300", bg: "bg-gray-300/10", icon: Medal },
  { rank: 3, name: "PolyglotPro", score: "10,850", color: "text-amber-600", bg: "bg-amber-600/10", icon: Medal },
  { rank: 4, name: "BabelTower", score: "9,940", color: "text-lingo-text", bg: "transparent", icon: null },
  { rank: 5, name: "LanguageLover", score: "9,120", color: "text-lingo-text", bg: "transparent", icon: null },
];

export default function LeaderboardTeaser() {
  return (
    <section className="py-24 bg-lingo-bg relative overflow-hidden border-t border-lingo-border">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lingo-primary-dark/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lingo-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lingo-primary/10 border border-lingo-primary/30 text-lingo-primary-light font-bold"
          >
            <Users size={18} /> Join the Global Community
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-lingo-text"
          >
            Claim Your Spot on the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lingo-gold to-yellow-300">
              Global Leaderboard
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-lingo-text-secondary max-w-2xl mx-auto"
          >
            Compete against language lovers worldwide. Every correct answer pushes you 
            higher up the ranks. Do you have what it takes to be #1?
          </motion.p>
        </div>

        <motion.div 
          className="max-w-3xl mx-auto bg-lingo-surface border-2 border-lingo-surface-elevated rounded-3xl overflow-hidden shadow-2xl shadow-lingo-primary/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="bg-lingo-surface-elevated px-6 py-4 border-b border-lingo-border flex justify-between items-center">
            <h3 className="font-bold text-lingo-text flex items-center gap-2">
              <TrendingUp size={20} className="text-lingo-accent" />
              Weekly Top Players
            </h3>
            <span className="text-sm font-bold text-lingo-text-secondary">Season 4</span>
          </div>
          
          <div className="p-2">
            {MOCK_LEADERBOARD.map((player, idx) => {
              const Icon = player.icon;
              return (
                <motion.div 
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  whileHover={{ backgroundColor: 'rgba(42, 33, 69, 0.5)' }}
                  className={`flex items-center justify-between p-4 rounded-2xl mb-1 transition-colors ${player.rank === 1 ? 'border border-lingo-gold/30' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${player.bg} ${player.color}`}>
                      {Icon ? <Icon size={20} /> : `#${player.rank}`}
                    </div>
                    <span className={`font-bold text-lg ${player.rank <= 3 ? 'text-lingo-text' : 'text-lingo-text-secondary'}`}>
                      {player.name}
                    </span>
                  </div>
                  <div className="font-black font-mono text-lingo-primary-light">
                    {player.score} <span className="text-sm text-lingo-text-secondary ml-1">XP</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          <div className="p-6 bg-gradient-to-t from-lingo-bg/80 to-transparent flex justify-center -mt-16 relative z-10">
            <div className="px-6 py-3 bg-lingo-surface border border-lingo-border rounded-full text-lingo-text-secondary font-semibold backdrop-blur-sm">
              ...and 142,005 others
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
