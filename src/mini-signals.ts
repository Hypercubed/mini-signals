type BoundFunction<T extends any[], A = any> = (this: A, ...x: T) => void;

const MiniSignalSymbol = Symbol('MiniSignalSymbol');

type MiniSignalNode<T extends any[], A extends any | undefined> = {
  fn: BoundFunction<T, A>;
  once: boolean;
  next?: MiniSignalNode<T, A>;
  prev?: MiniSignalNode<T, A>;
  thisArg?: A;
  [MiniSignalSymbol]?: symbol
}

type MiniSignalRef<T extends any[], A extends any | undefined, S extends any> = WeakRef<MiniSignalNode<T, A>> & S;

export class MiniSignal<
  T extends any[] = any[],
  A extends any | undefined = any | undefined,
  S extends any = { [MiniSignalSymbol]: true }
> {
  private _head?: MiniSignalNode<T, A> = undefined;
  private _tail?: MiniSignalNode<T, A> = undefined;

  private symbol = Symbol('MiniSignal');

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
      [MiniSignalSymbol]: this.symbol
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
      [MiniSignalSymbol]: this.symbol
    });
  }

  /**
   * Remove binding object.
   */
  detach(ref: MiniSignalRef<T, A, S>): this {
    if (!(ref instanceof WeakRef)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignalNode object.'
      );
    }

    const node = ref.deref();

    if (!node || !node[MiniSignalSymbol]) return this;

    if (node[MiniSignalSymbol] !== this.symbol) return this;  // Error?

    this._disconnectNode(node);
    this._destroyNode(node);

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
      this._destroyNode(n);
      n = n.next;
    }
    return this;
  }

  private _destroyNode(node: MiniSignalNode<T, A>) {
    node.fn = undefined as any;
    node.thisArg = undefined as any;
    // node.next = undefined;
    node.prev = undefined;
    node[MiniSignalSymbol] = undefined;
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

    node[MiniSignalSymbol] = undefined;
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

