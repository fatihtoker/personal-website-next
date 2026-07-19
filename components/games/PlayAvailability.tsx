"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayableGame } from "@/lib/projects/schema";
import { DeviceClass, classifyViewport, supportsDevice } from "@/lib/projects/device";

interface PlayAvailabilityProps {
  game: PlayableGame;
}

export default function PlayAvailability({ game }: PlayAvailabilityProps) {
  const [device, setDevice] = useState<DeviceClass | null>(null);

  useEffect(() => {
    setDevice(classifyViewport(window.innerWidth));

    const handleResize = () => {
      setDevice(classifyViewport(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (device === null) {
    return (
      <div className="animate-pulse bg-[var(--surface-strong)] h-12 rounded-[var(--radius-sm)] w-48" />
    );
  }

  const isSupported = supportsDevice(game, device);

  if (isSupported) {
    return (
      <Link
        href={`/games/${game.slug}/play`}
        className="inline-flex items-center justify-center px-8 py-4 bg-[var(--acid)] text-[var(--canvas)] font-bold text-lg rounded-[var(--radius-sm)] hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
      >
        Play now
      </Link>
    );
  }

  const formattedDevices = game.supportedDevices
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
    .join(", ");

  return (
    <div className="p-4 border border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral)] rounded-[var(--radius-sm)] max-w-md">
      <p className="font-bold text-sm">
        Available on: {formattedDevices}
      </p>
      <p className="text-xs mt-1 text-[var(--muted)]">
        Your current device category ({device.charAt(0).toUpperCase() + device.slice(1)}) is not supported for this game.
      </p>
    </div>
  );
}
