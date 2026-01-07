import type {
  MiniSignalBinding,
  EventHandler,
  EventMap,
  MiniSignalMap,
  EventKey,
} from './mini-signals-types.d.ts';
import type { MiniSignal } from './mini-signals.ts';

type SignalMap<T> = T extends EventMap<any>
  ? MiniSignalMap<T>
  : T extends MiniSignalMap<any>
  ? T
  : never;

type Listener<T> = T extends any[]
  ? EventHandler<T>
  : T extends MiniSignal<infer U, any>
  ? EventHandler<U>
  : never;
type Args<T> = T extends any[]
  ? T
  : T extends MiniSignal<infer U, any>
  ? U
  : never;

type _B<S, K> = [S] extends [never] ? K : S;
type Brand<T, K> = T extends any[]
  ? K
  : T extends MiniSignal<any, infer S>
  ? _B<S, K>
  : never;

type Signal<T, K> = MiniSignal<Args<T>, Brand<T, K>>;
// eslint-disable-next-line @typescript-eslint/ban-types
type Binding<T, K> = MiniSignalBinding<Args<T>, Brand<T, K>>;

/**
 * @document __docs__/mini-signal-emitter.md
 */
export class MiniSignalEmitter<
  T extends EventMap<any> | MiniSignalMap<EventMap<any>> = any
> {
  protected readonly signals: SignalMap<T>;

  // Note: signals must be provided from outside
  // but are not required to be branded
  constructor(signals: SignalMap<T>) {
    this.signals = { ...signals };
    // Copy symbol keys
    for (const key of Object.getOwnPropertySymbols(signals)) {
      this.signals[key as keyof T] = signals[key as keyof T];
    }
  }

  // TODO: Can we extact the branding from the original signal here?
  protected getSignal<K extends EventKey<T>>(event: K): Signal<T[K], K> {
    const signal = this.signals[event];
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!signal) {
      throw new Error(`Signal for event '${String(event)}' not found`);
    }
    // Returns the signal with implied branding
    return signal as unknown as Signal<T[K], K>;
  }

  /**
   * Register a listener for a specific event
   */
  on<K extends EventKey<T>>(
    event: K,
    handler: Listener<T[K]>
  ): Binding<T[K], K> {
    const signal = this.getSignal(event);
    return signal.add(handler);
  }

  /**
   * Register a one-time listener for a specific event
   */
  once<K extends EventKey<T>>(
    event: K,
    handler: Listener<T[K]>
  ): Binding<T[K], K> {
    const signal = this.getSignal(event);
    const binding = signal.add((...args: Args<T[K]>): void => {
      handler(...args);
      signal.detach(binding);
    });
    return binding;
  }

  /**
   * Emit an event with data
   */
  emit<K extends EventKey<T>>(event: K, ...args: Args<T[K]>): boolean {
    const signal = this.getSignal(event);
    return signal.dispatch(...args);
  }

  async emitParallel<K extends EventKey<T>>(
    event: K,
    ...args: Args<T[K]>
  ): Promise<boolean> {
    const signal = this.getSignal(event);
    return await signal.dispatchParallel(...args);
  }

  async emitSerial<K extends EventKey<T>>(
    event: K,
    ...args: Args<T[K]>
  ): Promise<boolean> {
    const signal = this.getSignal(event);
    return await signal.dispatchSerial(...args);
  }

  off<K extends EventKey<T>, B extends Binding<T[K], K>>(
    event: K,
    binding: B
  ): void {
    const signal = this.getSignal(event);
    signal.detach(binding);
  }

  clear<K extends EventKey<T>>(event?: K): void {
    if (event !== undefined) {
      this.getSignal(event).detachAll();
    } else {
      for (const key of Object.keys(this.signals)) {
        this.getSignal(key as K)?.detachAll();
      }
      for (const key of Object.getOwnPropertySymbols(this.signals)) {
        this.getSignal(key as K)?.detachAll();
      }
    }
  }
}
