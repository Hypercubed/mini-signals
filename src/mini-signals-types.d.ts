import type { MiniSignal } from './mini-signals.ts';

export type EventHandler<T extends any[]> = (
  ...args: T
) => Promise<unknown> | unknown;

// Same as node's EventMap
export type EventMap<T> = Record<keyof T, any[]>;

export type MiniSignalMap<T extends EventMap<any> = EventMap<any>> = {
  [K in keyof T]: MiniSignal<T[K], any>;
};

export interface MiniSignalBinding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}
