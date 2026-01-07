import type { MiniSignal } from './mini-signals.ts';

// Same as node's EventMap
export type EventMap<T> = Record<keyof T, any[]>;

export type MiniSignalMap<T extends EventMap<any>> = {
  [K in keyof T]: MiniSignal<T[K], any>;
};

export type EventKey<T extends EventMap<any> | MiniSignalMap<any>> = keyof T;
export type EventHandler<T extends any[]> = (
  ...args: T
) => Promise<unknown> | unknown;

export interface MiniSignalBinding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}
