type BoundFunction<T extends any[] = any[], A = any> = (
  thisArg: A,
  ...args: T
) => void;

type MiniSignalNode<T extends any[], A extends any | undefined> = {
  fn: BoundFunction<T, A>;
  once: boolean;
  next?: MiniSignalNode<T, A>;
  prev?: MiniSignalNode<T, A>;
  thisArg?: A;
}

function isMiniSignalNode<T extends any[], A extends any | undefined>(
  node: unknown
): node is MiniSignalNode<T, A> {
  return (
    typeof node === 'object' &&
    node !== null &&
    'fn' in node
  );
}

export class MiniSignal<
  T extends any[] = any[],
  A extends any | undefined = any | undefined
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
      node.fn.apply(node.thisArg, args);
      node = node.next;
    }

    return true;
  }

  /**
   * Register a new listener.
   */
  add(fn: BoundFunction<T>, thisArg?: A): MiniSignalNode<T, A> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._addNode({
      fn,
      once: false,
      thisArg,
    });
  }

  /**
   * Register a new listener that will be executed only once.
   */
  once(fn: BoundFunction<T>, thisArg?: A): MiniSignalNode<T, A> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#once(): First arg must be a Function.');
    }
    return this._addNode({
      fn,
      once: true,
      thisArg,
    });
  }

  /**
   * Remove binding object.
   */
  detach(node: MiniSignalNode<T, A>): this {
    if (!isMiniSignalNode(node)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignalNode object.'
      );
    }

    if (!this._hasNode(node)) return this;

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

  private _addNode(node: MiniSignalNode<T, A>): MiniSignalNode<T, A> {
    if (this._head == null) {
      this._head = node;
      this._tail = node;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this._tail!.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    return node;
  }
}
