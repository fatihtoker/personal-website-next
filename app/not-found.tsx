import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <span className="text-sm font-bold uppercase tracking-wider text-[var(--acid)] mb-4">404 Error</span>
      <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Page Not Found</h1>
      <p className="text-[var(--muted)] text-base md:text-lg max-w-md mb-8">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved to another location.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-strong)] hover:border-[var(--acid)] transition-all min-h-[44px]"
      >
        Return Home
      </Link>
    </div>
  );
}
