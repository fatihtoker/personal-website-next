"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-lingo-bg pt-20">
      {/* Dynamic Glowing Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lingo-primary/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lingo-primary-dark/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-lingo-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particles (Simulated) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 pointer-events-none"
          initial={{
            x: Math.random() * 1000 - 500,
            y: Math.random() * 800 - 400,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0.2, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column - Text & CTAs */}
        <motion.div
          className="flex-1 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-lingo-surface-elevated border border-lingo-border text-lingo-primary-light font-semibold text-sm mb-4">
            New Game Modes Available 🚀
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-lingo-text leading-tight tracking-tight">
            Test your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lingo-primary-light to-lingo-accent-light">
              linguistic instincts.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-lingo-text-secondary max-w-2xl mx-auto lg:mx-0">
            Beat the clock. Guess the language. Level up your brain. Join
            thousands of players in the ultimate fast-paced language challenge!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.fatihtoker.lingo_link"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer shadow-lg shadow-lingo-primary/20"
            >
              <Image
                src="/google_play.webp"
                alt="Get it on Google Play"
                width={180}
                height={54}
                className="h-[54px] w-auto object-contain"
                priority
              />
            </motion.a>

            <motion.a
              href="https://apps.apple.com/us/app/lingolink-guess-languages/id6791171235"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer shadow-lg shadow-lingo-primary/20"
            >
              <Image
                src="/app_store.webp"
                alt="Get it on App Store"
                width={180}
                height={54}
                className="h-[54px] w-auto object-contain"
              />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column - 3D Mockup / App Interface Preview */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="relative w-full max-w-[320px] aspect-[1/2.1] bg-lingo-surface border-4 border-lingo-surface-elevated rounded-[40px] shadow-2xl shadow-lingo-primary/30 overflow-hidden flex flex-col"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotateY: -15, rotateX: 5, perspective: 1000 }}
          >
            {/* Phone Notch Mock */}
            <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
              <div className="w-1/3 h-full bg-lingo-surface-elevated rounded-b-xl"></div>
            </div>

            {/* Game Screen Mock */}
            <div className="flex-1 flex flex-col p-6 pt-12 bg-lingo-bg relative">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-1 text-lingo-gold font-bold">
                  <span>🔥</span> 12
                </div>
                <div className="flex items-center gap-1 text-lingo-accent font-bold">
                  <span>💎</span> 450
                </div>
              </div>

              <div className="text-center space-y-2 flex-1 flex flex-col justify-center">
                <motion.div
                  className="bg-lingo-surface-elevated p-6 rounded-2xl shadow-lg border border-lingo-border"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-2xl font-bold text-lingo-text mb-4">
                    &quot;Bonjour le monde, comment allez-vous?&quot;
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  {["French", "Spanish", "Italian", "Portuguese"].map(
                    (lang, idx) => (
                      <div
                        key={lang}
                        className={`p-4 rounded-xl font-bold text-center border-2 transition-all cursor-pointer
                        ${
                          idx === 0
                            ? "bg-lingo-accent/20 border-lingo-accent text-lingo-accent"
                            : "bg-lingo-surface border-lingo-surface-elevated text-lingo-text-secondary hover:border-lingo-primary hover:text-lingo-text"
                        }
                      `}
                      >
                        {lang}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
