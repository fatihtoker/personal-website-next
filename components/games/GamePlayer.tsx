"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PlayableGame } from "@/lib/projects/schema";
import { DeviceClass, classifyViewport, supportsDevice } from "@/lib/projects/device";

interface GamePlayerProps {
  game: PlayableGame;
}

type LoadState = "loading" | "ready" | "error";

export default function GamePlayer({ game }: GamePlayerProps) {
  const [device, setDevice] = useState<DeviceClass | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [frameKey, setFrameKey] = useState(0);
  const [fullscreenError, setFullscreenError] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setDevice(classifyViewport(window.innerWidth));

    const handleResize = () => {
      setDevice(classifyViewport(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleError = () => {
      setLoadState("error");
    };

    iframe.addEventListener("error", handleError);
    return () => {
      iframe.removeEventListener("error", handleError);
    };
  }, [frameKey, device]);

  const handleReload = () => {
    setLoadState("loading");
    setFullscreenError("");
    setFrameKey((prev) => prev + 1);
  };

  const handleFullscreen = async () => {
    if (!wrapperRef.current) return;
    try {
      setFullscreenError("");
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await wrapperRef.current.requestFullscreen();
      }
    } catch (err) {
      setFullscreenError("Fullscreen is unavailable in this browser.");
    }
  };

  if (device === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[var(--canvas)] text-[var(--ink)]">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--line)] border-t-[var(--acid)] rounded-full mb-4" />
        <p className="text-[var(--muted)] text-sm">Checking device compatibility...</p>
      </div>
    );
  }

  const isSupported = supportsDevice(game, device);

  if (!isSupported) {
    const formattedDevices = game.supportedDevices
      .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .join(", ");

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-[var(--canvas)] border border-[var(--line)] rounded-[var(--radius-lg)] max-w-2xl mx-auto my-12">
        <span className="text-sm font-bold uppercase tracking-wider text-[var(--coral)] mb-4">Unsupported Device</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--ink)] mb-4">Playable Only on {formattedDevices}</h2>
        <p className="text-[var(--muted)] text-base mb-8 max-w-md">
          This game uses controls or viewport requirements that are not fully optimized for your current device type ({device.charAt(0).toUpperCase() + device.slice(1)}).
        </p>
        <Link
          href={`/games/${game.slug}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-strong)] hover:border-[var(--acid)] transition-all min-h-[44px]"
        >
          Back to Details
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col w-full h-[85vh] bg-[var(--canvas)] border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden relative shadow-[var(--shadow-card)]"
    >
      {fullscreenError && (
        <div
          aria-live="polite"
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[var(--coral)] text-[var(--canvas)] font-bold text-sm px-4 py-2 rounded shadow z-50 animate-bounce"
        >
          {fullscreenError}
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[var(--surface)] border-b border-[var(--line)] text-sm z-20">
        <Link
          href={`/games/${game.slug}`}
          className="inline-flex items-center text-[var(--muted)] hover:text-[var(--ink)] font-bold transition-colors min-h-[44px]"
        >
          &larr; Exit Play Mode
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={handleReload}
            className="px-4 py-2 border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--ink)] font-bold rounded-[var(--radius-sm)] hover:border-[var(--acid)] transition-colors min-h-[44px]"
          >
            Reload game
          </button>
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-[var(--acid)] text-[var(--canvas)] font-bold rounded-[var(--radius-sm)] hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
          >
            Enter fullscreen
          </button>
        </div>
      </div>

      {/* Iframe Viewport Container */}
      <div className="relative flex-grow w-full h-full bg-black">
        {loadState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--canvas)] text-[var(--ink)] z-10">
            <div className="animate-spin h-10 w-10 border-4 border-[var(--line)] border-t-[var(--acid)] rounded-full mb-4" />
            <p className="text-[var(--muted)] text-sm">Loading game...</p>
          </div>
        )}

        {loadState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--canvas)] text-[var(--ink)] z-10 p-6 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--coral)] mb-4">Error</span>
            <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-[var(--ink)]">The game could not be loaded.</h3>
            <button
              onClick={handleReload}
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--coral)] text-white font-bold rounded-[var(--radius-sm)] hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
            >
              Retry
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={frameKey}
          src={game.playablePath}
          title={`${game.title} game`}
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          className="w-full h-full border-none"
          onLoad={() => setLoadState("ready")}
          onError={() => setLoadState("error")}
        />
      </div>
    </div>
  );
}
