import { MiniSignal } from './mini-signals.ts';
import type { EventMap, MiniSignalMap } from './mini-signals-types.js';
import { type AsyncHandler, type SyncHandler } from './private-types.js';

/**
 * Helper to create a sync signal
 */
export function syncSignal<T extends any[], S = symbol | string>(): MiniSignal<
  SyncHandler<T>,
  S
> {
  return new MiniSignal<SyncHandler<T>, S>();
}

/**
 * Helper to create a async signal
 */
export function asyncSignal<T extends any[], S = symbol | string>(): MiniSignal<
  AsyncHandler<T>,
  S
> {
  return new MiniSignal<AsyncHandler<T>, S>();
}

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
