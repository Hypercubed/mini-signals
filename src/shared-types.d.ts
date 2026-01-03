export type EventHandler<T extends any[]> = (...args: T) => void | Promise<void>;
export type EventMap = Record<string | symbol, any[]>;