export type EventHandler<T extends any[]> = (...args: T) => void | Promise<void>;
export type EventMap = Record<string | symbol, any[]>;

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