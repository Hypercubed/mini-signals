import { MiniSignal } from "./mini-signals.ts";
import type { MiniSignalEventMap } from "./types.d.ts";

/**
 * Helper to create a signal map for SignalEmitter
 */
export function createSignalMap<T extends MiniSignalEventMap>(
  events: (keyof T)[]
): { [K in keyof T]: MiniSignal<T[K]> } {
  const map = {} as { [K in keyof T]: MiniSignal<T[K]> };
  for (const event of events) {
    map[event] = new MiniSignal<T[typeof event]>();
  }
  return map;
}