export type CallBack<T extends any[]> = (...x: T) => void | Promise<void>;

export interface MiniSignalNodeRef<T, S> {
  [key: symbol]: symbol;
  __brand?: S;
  __type?: T;
}

export interface MiniSignalNode<T extends any[]> {
  fn: CallBack<T>;
  next?: MiniSignalNode<T>;
  prev?: MiniSignalNode<T>;
}