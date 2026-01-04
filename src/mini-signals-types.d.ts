import type { MiniSignal } from './mini-signals.ts';

export type EventHandler<T extends any[]> = (
  ...args: T
) => Promise<unknown> | unknown;

export type EventMap = Record<string | symbol, any[]>;

export type MiniSignalMap<T extends EventMap = EventMap> = {
  [K in keyof T]: MiniSignal<T[K], any>;
};

export interface MiniSignalBinding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}
