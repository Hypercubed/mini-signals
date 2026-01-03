import { MiniSignal } from './mini-signals.ts';
import type { EventMap, SignalMap } from './types.d.ts';

/**
 * Helper to create a signal map for SignalEmitter
 */
export function createSignalMap<T extends EventMap>(
  events: Array<keyof T>
): SignalMap<T> {
  const map: Partial<SignalMap<T>> = {};
  for (const event of events) {
    map[event] = new MiniSignal<T[typeof event]>();
  }
  return map as SignalMap<T>;
}
