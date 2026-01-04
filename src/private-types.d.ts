import type { MiniSignal } from './mini-signals.ts';
import type { MiniSignalMap } from './mini-signals-types.d.ts';

export type SyncHandler<T extends any[]> = (...args: T) => void;
export type AsyncHandler<T extends any[]> = (...args: T) => Promise<void>;

export type EventHandler<T extends any[]> = SyncHandler<T> | AsyncHandler<T>;
export type EventKey<T extends MiniSignalMap<any>> = keyof T;
export type ExtractHandler<T, K extends keyof T> = T[K] extends MiniSignal<
  infer THandler,
  any
>
  ? THandler
  : never;

type OnlySyncHandler<T extends EventHandler<any[]>, R> = ReturnType<T> extends Promise<void>
  ? 'Cannot dispatch async handlers using this method' & [never]
  : R;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type OnlyAsyncHandler<T extends EventHandler<any[]>, R> = ReturnType<T> extends void
  ? 'Cannot dispatch sync handlers using this method' & [never]
  : R;

type OnlySyncEvent<T, K extends keyof T> = OnlySyncHandler<ExtractHandler<T, K>, K>;
type OnlyAsyncEvent<T, K extends keyof T> = OnlyAsyncHandler<ExtractHandler<T, K>, K>;