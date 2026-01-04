import type { MiniSignal } from './mini-signals.ts';
import type { EventHandler } from './private-types.js';

export type EventMap = Record<string | symbol, EventHandler<any[]>>;
export type MiniSignalMap<T extends EventMap = EventMap> = {
  [K in keyof T]: MiniSignal<T[K], any>;
};

export interface MiniSignalBinding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}
