import type { MiniSignal } from "./mini-signals";
import type { EventHandler, EventMap } from "./shared-types";

type EventKey<T extends EventMap> = keyof T;
type SignalMap<T extends EventMap> = { [K in keyof T]: MiniSignal<T[K]> };

export class MiniSignalEmitter<T extends EventMap> {
  private readonly signals: SignalMap<T>;

  constructor(signals: SignalMap<T>) {
    this.signals = { ...signals };
    // Copy symbol keys
    for (const key of Object.getOwnPropertySymbols(signals)) {
      this.signals[key as keyof T] = signals[key as keyof T];
    }
  }

  private getSignal<K extends EventKey<T>>(event: K): MiniSignal<T[K]> {
    const signal = this.signals[event];
    if (!signal) {
      throw new Error(`Signal for event '${String(event)}' not found`);
    }
    return signal;
  }

  /**
   * Register a listener for a specific event
   */
  on<K extends EventKey<T>>(event: K, handler: EventHandler<T[K]>): () => void {
    const signal = this.getSignal(event);
    const binding = signal.add(handler);
    return () => signal.detach(binding);
  }

  /**
   * Register a one-time listener for a specific event
   */
  once<K extends EventKey<T>>(event: K, handler: EventHandler<T[K]>): () => void {
    const signal = this.getSignal(event);
    let binding: any;
    const wrappedHandler = (...args: T[K]) => {
      handler(...args);
      signal.detach(binding);
    };
    binding = signal.add(wrappedHandler);
    return () => signal.detach(binding);
  }

  /**
   * Emit an event with data
   */
  emit<K extends EventKey<T>>(event: K, ...args: T[K]): boolean {
    const signal = this.getSignal(event);
    return signal.dispatch(...args);
  }

  emitParallel<K extends EventKey<T>>(event: K, ...args: T[K]): Promise<boolean> {
    const signal = this.getSignal(event);
    return signal.dispatchParallel(...args);
  }

  emitSerial<K extends EventKey<T>>(event: K, ...args: T[K]): Promise<boolean> {
    const signal = this.getSignal(event);
    return signal.dispatchSerial(...args);
  }

  clear<K extends EventKey<T>>(event?: K) {
    if (event) {
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

