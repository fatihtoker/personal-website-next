import { PlayableGame } from "@/lib/projects/schema";

interface DeviceBadgesProps {
  game: PlayableGame;
}

export default function DeviceBadges({ game }: DeviceBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {game.supportedDevices.map((device) => (
        <span
          key={device}
          className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded bg-[var(--surface-strong)] text-[var(--muted)] border border-[var(--line)]"
        >
          {device.charAt(0).toUpperCase() + device.slice(1)}
        </span>
      ))}
    </div>
  );
}
