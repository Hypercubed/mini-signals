type CallBack<T extends any[]> = (...x: T) => void;

const MINI_SIGNAL_KEY = Symbol('SIGNAL');

interface MiniSignalNodeRef<T, S> {
  [MINI_SIGNAL_KEY]: Symbol;
  __brand?: S;
  __type?: T;
}

interface MiniSignalNode<T extends any[]> {
  fn: CallBack<T>;
  next?: MiniSignalNode<T>;
  prev?: MiniSignalNode<T>;
}

function isMiniSignalNodeRef(obj: any): obj is MiniSignalNodeRef<any, any> {
  return typeof obj === 'object' && MINI_SIGNAL_KEY in obj;
}

export class MiniSignal<
  T extends any[] = any[],
  S extends any = Symbol | string
> {
  /**
   * A Symbol that is used to guarantee the uniqueness of the MiniSignal
   * instance.
   */
  private readonly _symbol = Symbol('MiniSignal');
  private _refMap = new WeakMap<MiniSignalNodeRef<T, S>, MiniSignalNode<T>>();
  
  private _head?: MiniSignalNode<T> = undefined;
  private _tail?: MiniSignalNode<T> = undefined;
  private _dispatching = false;

  hasListeners(): boolean {
    return this._head != null;
  }

  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...args: T): boolean {
    if (this._dispatching) {
      throw new Error('MiniSignal#dispatch(): Signal already dispatching.');
    }

    let node = this._head;

    if (node == null) return false;
    this._dispatching = true;

    while (node != null) {
      node.fn(...args);
      node = node.next;
    }

    this._dispatching = false;
    return true;
  }

  /**
   * Register a new listener.
   */
  add(fn: CallBack<T>): MiniSignalNodeRef<T, S> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._createRef(this._addNode({ fn }));
  }

  /**
   * Remove binding object.
   */
  detach(sym: MiniSignalNodeRef<T, S>): this {
    if (!isMiniSignalNodeRef(sym)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignal listener reference.'
      );
    }

    if (sym[MINI_SIGNAL_KEY] !== this._symbol) {
      throw new Error(
        'MiniSignal#detach(): MiniSignal listener does not belong to this MiniSignal.'
      );
    }

    const node = this._refMap.get(sym);

    if (!node) return this; // already detached

    this._refMap.delete(sym);
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
    this._refMap = new WeakMap();

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
  }

  private _addNode(node: MiniSignalNode<T>): MiniSignalNode<T> {
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

  private _createRef(node: MiniSignalNode<T>): MiniSignalNodeRef<T, S> {
    const sym = { [MINI_SIGNAL_KEY]: this._symbol } as unknown as MiniSignalNodeRef<T, S>;
    this._refMap.set(sym, node);
    return sym;
  }

  protected _getRef(sym: MiniSignalNodeRef<T, S>) {
    return this._refMap.get(sym);
  }
}

