import { PlayableGame } from "./schema";

export type DeviceClass = "desktop" | "tablet" | "mobile";

export function classifyViewport(width: number): DeviceClass {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function supportsDevice(game: PlayableGame, device: DeviceClass): boolean {
  return game.supportedDevices.includes(device);
}
