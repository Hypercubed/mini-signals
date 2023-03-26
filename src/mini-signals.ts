type BoundFunction<T extends any[], A = any> = (this: A, ...x: T) => void;

const MiniSignalSymbol = Symbol('MiniSignal');

type MiniSignalNode<T extends any[], A extends any | undefined> = {
  fn: BoundFunction<T, A>;
  once: boolean;
  next?: MiniSignalNode<T, A>;
  prev?: MiniSignalNode<T, A>;
  thisArg?: A;
  [MiniSignalSymbol]: true
}

type MiniSignalRef<T extends any[], A extends any | undefined, S extends any> = WeakRef<MiniSignalNode<T, A>> & S;

function isMiniSignalRef<T extends any[], A extends any | undefined, S extends any>(value: any): value is MiniSignalRef<T, A, S> {
  return value instanceof WeakRef && !!(value.deref() as any)[MiniSignalSymbol];
}

export class MiniSignal<
  T extends any[] = any[],
  A extends any | undefined = any | undefined,
  S extends any = { [MiniSignalSymbol]: true }
> {
  private _head?: MiniSignalNode<T, A> = undefined;
  private _tail?: MiniSignalNode<T, A> = undefined;

  hasListeners(): boolean {
    return !(this._head == null);
  }

  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...args: T): boolean {
    let node = this._head;

    if (node == null) return false;

    while (node != null) {
      if (node.once) this._disconnectNode(node);
      node.fn.apply(node.thisArg as A, args as T);
      node = node.next;
    }

    return true;
  }

  /**
   * Register a new listener.
   */
  add(fn: BoundFunction<T, A>, thisArg?: A): MiniSignalRef<T, A, S> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._addNode({
      fn,
      once: false,
      thisArg,
      [MiniSignalSymbol]: true
    });
  }

  /**
   * Register a new listener that will be executed only once.
   */
  once(fn: BoundFunction<T, A>, thisArg?: A): MiniSignalRef<T, A, S> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#once(): First arg must be a Function.');
    }
    return this._addNode({
      fn,
      once: true,
      thisArg,
      [MiniSignalSymbol]: true
    });
  }

  /**
   * Remove binding object.
   */
  detach(ref: MiniSignalRef<T, A, S>): this {
    if (!isMiniSignalRef(ref)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignalNode object.'
      );
    }

    // TODO: Verify that this node belongs to this signal

    const node = ref.deref();

    if (!node) return this;
    if (!this._hasNode(node)) return this; // Don't want to error, allow ref to detached several times

    this._disconnectNode(node);

    return this;
  }

  /**
   * Detach all listeners.
   */
  detachAll(): this {
    let n = this._head;
    if (n == null) return this;

    this._head = this._tail = undefined;

    while (n != null) {
      n = n.next;
    }
    return this;
  }

  private _hasNode(node: MiniSignalNode<T, A>): boolean {
    let n = this._head;
    while (n != null) {
      if (n === node) return true;
      n = n.next;
    }
    return false;
  }

  private _disconnectNode(node: MiniSignalNode<T, A>) {
    if (node === this._head) {
      // first node
      this._head = node.next;
      if (node.next == null) {
        this._tail = undefined;
      }
    } else if (node === this._tail) {
      // last node
      this._tail = node.prev;
      if (this._tail != null) {
        this._tail.next = undefined;
      }
    }

    if (node.prev != null) {
      node.prev.next = node.next;
    }
    if (node.next != null) {
      node.next.prev = node.prev;
    }
  }

  private _addNode(node: MiniSignalNode<T, A>): MiniSignalRef<T, A, S> {
    if (this._head == null) {
      this._head = node;
      this._tail = node;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this._tail!.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    return new WeakRef(node) as MiniSignalRef<T, A, S>;
  }
}

