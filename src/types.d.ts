import type { MiniSignal } from './mini-signals.js';

export type EventHandler<T extends any[]> = (
  ...args: T
) => void | Promise<void>;
export type EventMap = Record<string | symbol, any[]>;
export type SignalMap<T extends EventMap = EventMap> = {
  [K in keyof T]: MiniSignal<T[K]>;
};

export interface Binding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}

export interface Node<T extends any[]> {
  fn: EventHandler<T>;
  next?: Node<T>;
  prev?: Node<T>;
}
