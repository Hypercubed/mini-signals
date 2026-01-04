import type { MiniSignal } from './mini-signals.js';

/** @private */
export type SyncHandler<T extends any[]> = (...args: T) => void;

/** @private */
export type AsyncHandler<T extends any[]> = (...args: T) => Promise<void>;

/** @private */
export type EventHandler<T extends any[]> = SyncHandler<T> | AsyncHandler<T>;

/** @private */
export type IsAsync<T> = T extends (...args: any[]) => Promise<any>
  ? true
  : false;

export type EventMap = Record<string | symbol, EventHandler<any[]>>;
export type MiniSignalMap<T extends EventMap = EventMap> = {
  [K in keyof T]: MiniSignal<T[K], any>;
};

export interface MiniSignalBinding<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}
