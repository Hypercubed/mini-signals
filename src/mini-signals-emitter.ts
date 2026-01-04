import type {
  MiniSignalMap,
  MiniSignalBinding,
  EventHandler,
} from './mini-signals-types.js';
import type { MiniSignal } from './mini-signals.ts';

type EventKey<T extends MiniSignalMap<any>> = keyof T;
type ExtractHandler<T, K extends keyof T> = T[K] extends MiniSignal<infer Args>
  ? EventHandler<Args>
  : never;

/**
 * @document __docs__/mini-signal-emitter.md
 */
export class MiniSignalEmitter<T extends MiniSignalMap<any>> {
  protected readonly signals: T;

  constructor(signals: T) {
    this.signals = { ...signals };
    // Copy symbol keys
    for (const key of Object.getOwnPropertySymbols(signals)) {
      this.signals[key as keyof T] = signals[key as keyof T];
    }
  }

  protected getSignal<K extends EventKey<T>>(event: K): T[K] {
    const signal = this.signals[event];
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!signal) {
      throw new Error(`Signal for event '${String(event)}' not found`);
    }
    return signal;
  }

  /**
   * Register a listener for a specific event
   */
  on<K extends EventKey<T>>(
    event: K,
    handler: ExtractHandler<T, K>
  ): MiniSignalBinding<Parameters<ExtractHandler<T, K>>, K> {
    const signal = this.getSignal(event);
    return signal.add(handler);
  }

  /**
   * Register a one-time listener for a specific event
   */
  once<K extends EventKey<T>>(
    event: K,
    handler: ExtractHandler<T, K>
  ): MiniSignalBinding<Parameters<ExtractHandler<T, K>>, K> {
    const signal = this.getSignal(event);
    const binding = signal.add(
      (...args: Parameters<ExtractHandler<T, K>>): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handler(...args);
        signal.detach(binding);
      }
    );
    return binding;
  }

  /**
   * Emit an event with data
   */
  emit<K extends EventKey<T>>(
    event: K,
    ...args: Parameters<ExtractHandler<T, K>>
  ): boolean {
    const signal = this.getSignal(event);
    return signal.dispatch(...args);
  }

  async emitParallel<K extends EventKey<T>>(
    event: K,
    ...args: Parameters<ExtractHandler<T, K>>
  ): Promise<boolean> {
    const signal = this.getSignal(event);
    return await signal.dispatchParallel(...args);
  }

  async emitSerial<K extends EventKey<T>>(
    event: K,
    ...args: Parameters<ExtractHandler<T, K>>
  ): Promise<boolean> {
    const signal = this.getSignal(event);
    return await signal.dispatchSerial(...args);
  }

  off<
    K extends EventKey<T>,
    B extends MiniSignalBinding<Parameters<ExtractHandler<T, K>>, K>
  >(event: K, binding: B): void {
    const signal = this.getSignal(event);
    signal.detach(binding);
  }

  clear<K extends EventKey<T>>(event?: K): void {
    if (event !== undefined) {
      this.getSignal(event).detachAll();
    } else {
      for (const key of Object.keys(this.signals)) {
        this.signals[key as K]?.detachAll();
      }
      for (const key of Object.getOwnPropertySymbols(this.signals)) {
        this.signals[key as K]?.detachAll();
      }
    }
  }
}
