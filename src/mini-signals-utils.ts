import { MiniSignal } from './mini-signals.ts';
import type { EventMap, MiniSignalMap } from './mini-signals-types.js';

/**
 * Helper to create a signal map for SignalEmitter
 */
export function createSignalMap<T extends EventMap>(
  events: Array<keyof T>
): MiniSignalMap<T> {
  const map: Partial<MiniSignalMap<T>> = {};
  for (const event of events) {
    map[event] = new MiniSignal<T[typeof event]>();
  }
  return map as MiniSignalMap<T>;
}
