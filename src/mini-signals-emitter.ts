import type { MiniSignal } from './mini-signals.ts';
import { type SignalMap, type EventHandler } from './types.js';

type EventKey<T extends SignalMap<any>> = keyof T;
type ExtractHandler<T, K extends keyof T> = T[K] extends MiniSignal<infer Args>
  ? EventHandler<Args>
  : never;

export class MiniSignalEmitter<T extends SignalMap<any>> {
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
  ): () => void {
    const signal = this.getSignal(event);
    const binding = signal.add(handler);
    return (): void => {
      signal.detach(binding);
    };
  }

  /**
   * Register a one-time listener for a specific event
   */
  once<K extends EventKey<T>>(
    event: K,
    handler: ExtractHandler<T, K>
  ): () => void {
    const signal = this.getSignal(event);
    const binding = signal.add(
      (...args: Parameters<ExtractHandler<T, K>>): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handler(...args);
        signal.detach(binding);
      }
    );
    return (): void => {
      signal.detach(binding);
    };
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
