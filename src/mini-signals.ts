type CallBack<T extends any[]> = (...x: T) => void;

const MiniSignalNodeSymbol = Symbol('MiniSignalNode');

type MiniSignalNode<T extends any[]> = {
  fn: CallBack<T>;
  next?: MiniSignalNode<T>;
  prev?: MiniSignalNode<T>;
  [MiniSignalNodeSymbol]?: symbol
}

type MiniSignalRef<T extends any[], S extends any> = WeakRef<MiniSignalNode<T>> & { [MiniSignalNodeSymbol]: S };

export class MiniSignal<
  T extends any[] = any[],
  S extends any = Symbol | string
> {
  private _head?: MiniSignalNode<T> = undefined;
  private _tail?: MiniSignalNode<T> = undefined;

  private readonly symbol = Symbol('MiniSignalInstance');
  private dispatching = false;

  hasListeners(): boolean {
    return !(this._head == null);
  }

  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...args: T): boolean {
    if (this.dispatching) {
      throw new Error('MiniSignal#dispatch(): Signal already dispatching.');
    }

    let node = this._head;

    if (node == null) return false;
    this.dispatching = true;

    while (node != null) {
      node.fn(...args);
      node = node.next;
    }

    this.dispatching = false;
    return true;
  }

  /**
   * Register a new listener.
   */
  add(fn: CallBack<T>): MiniSignalRef<T, S> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._addNode({
      fn,
      [MiniSignalNodeSymbol]: this.symbol
    });
  }

  /**
   * Remove binding object.
   */
  detach(ref: MiniSignalRef<T, S>): this {
    if (!(ref instanceof WeakRef)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignalNode reference.'
      );
    }

    const node = ref.deref();

    if (!node || !node[MiniSignalNodeSymbol]) return this;

    if (node[MiniSignalNodeSymbol] !== this.symbol) {
      throw new Error(
        'MiniSignal#detach(): MiniSignalNode does not belong to this MiniSignal.'
      );
    }

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

  private _destroyNode(node: MiniSignalNode<T>) {
    node.fn = undefined as any;
    node.prev = undefined;
  }

  private _disconnectNode(node: MiniSignalNode<T>) {
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

    node[MiniSignalNodeSymbol] = undefined;
  }

  private _addNode(node: MiniSignalNode<T>): MiniSignalRef<T, S> {
    if (this._head == null) {
      this._head = node;
      this._tail = node;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this._tail!.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    return new WeakRef(node) as MiniSignalRef<T, S>;
  }
}

