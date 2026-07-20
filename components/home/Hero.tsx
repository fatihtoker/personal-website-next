import Link from "next/link";

export default function Hero() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32 bg-[var(--canvas)] border-b border-[var(--line)]">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(var(--ink) 1px, transparent 1px)`,
        backgroundSize: "24px 24px"
      }} />

      <div className="mx-auto max-w-[1280px] px-6 relative z-10">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--acid)] block mb-4">
            Fatih Toker — Games & Apps
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-[var(--ink)] leading-[1.1] mb-6">
            Full-stack developer turning spare-time ideas into games and useful apps.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl mb-8 leading-relaxed">
            Small experiments, polished into things you can play and use.
          </p>
          <div>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--acid)] text-[var(--canvas)] font-bold rounded-[var(--radius-sm)] hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
            >
              Explore projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
