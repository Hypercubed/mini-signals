import type { MiniSignal } from './mini-signals.ts';
import type { MiniSignalMap } from './mini-signals-types.d.ts';

export type SyncHandler<T extends any[]> = (...args: T) => void;
export type AsyncHandler<T extends any[]> = (...args: T) => Promise<void>;

export type EventHandler<T extends any[]> = SyncHandler<T> | AsyncHandler<T>;

type IsSyncHandler<T> = T extends SyncHandler<any[]> ? true : false;
type IsAsyncHandler<T> = T extends AsyncHandler<any[]> ? true : false;

type OnlySyncEventHandler<T, R> = IsAsyncHandler<T> extends true
  ? 'Cannot dispatch async handlers using this method' & [never]
  : R;

type OnlyAsyncEventHandler<T, R> = IsAsyncHandler<T> extends false
  ? 'Cannot dispatch sync handlers using this method' & [never]
  : R;

type IsAsyncSignal<T, K extends keyof T> = T[K] extends MiniSignal<
  infer THandler,
  any
>
  ? IsAsyncHandler<THandler>
  : false;

type OnlySyncSignal<T, K extends keyof T> = IsAsyncSignal<T, K> extends true
  ? 'Cannot dispatch async handlers using this method'
  : K;

type OnlyAsyncSignal<T, K extends keyof T> = IsAsyncSignal<T, K> extends false
  ? 'Cannot dispatch sync handlers using this method'
  : K;

export type EventKey<T extends MiniSignalMap<any>> = keyof T;
export type ExtractHandler<T, K extends keyof T> = T[K] extends MiniSignal<
  infer THandler,
  any
>
  ? THandler
  : never;
