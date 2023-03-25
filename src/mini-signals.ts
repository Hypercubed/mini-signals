import { type BoundFunction, MiniSignalBinding } from './mini-signals-binding';

export class MiniSignal<
  T extends any[] = any[],
  A extends any | undefined = any | undefined
> {
  private _head?: MiniSignalBinding<T, A> = undefined;
  private _tail?: MiniSignalBinding<T, A> = undefined;

  hasHandlers(): boolean {
    return !(this._head == null);
  }

  /**
   * Return an array of attached MiniSignalBinding.
   */
  handlers(): Array<MiniSignalBinding<T, A>> {
    let node = this._head;

    const ee: Array<MiniSignalBinding<T, A>> = [];

    while (node != null) {
      ee.push(node);
      node = node._next;
    }

    return ee;
  }

  /**
   * Return true if node is a MiniSignalBinding attached to this MiniSignal
   */
  has(node: MiniSignalBinding<T, A>): boolean {
    if (!(node instanceof MiniSignalBinding)) {
      throw new Error(
        'MiniSignal#has(): First arg must be a MiniSignalBinding object.'
      );
    }

    return node._owner === this;
  }

  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...args: T): boolean {
    let node = this._head;

    if (node == null) return false;

    while (node != null) {
      if (node._once) this.detach(node);
      node._fn.apply(node._thisArg, args);
      node = node._next;
    }

    return true;
  }

  /**
   * Register a new listener.
   */
  add(fn: BoundFunction<T>, thisArg?: A): MiniSignalBinding<T, A> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._addMiniSignalBinding(
      new MiniSignalBinding<T, A>(fn, false, thisArg)
    );
  }

  /**
   * Register a new listener that will be executed only once.
   */
  once(fn: BoundFunction<T>, thisArg?: A): MiniSignalBinding {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#once(): First arg must be a Function.');
    }
    return this._addMiniSignalBinding(new MiniSignalBinding(fn, true, thisArg));
  }

  /**
   * Remove binding object.
   */
  detach(node: MiniSignalBinding<T, A>): this {
    if (!(node instanceof MiniSignalBinding)) {
      throw new Error(
        'MiniSignal#detach(): First arg must be a MiniSignalBinding object.'
      );
    }
    if (node._owner !== this) return this; // todo: or error?

    if (node._prev !== undefined && node._prev !== null)
      node._prev._next = node._next;
    if (node._next !== undefined && node._next !== null)
      node._next._prev = node._prev;

    if (node === this._head) {
      // first node
      this._head = node._next;
      if (node._next === null) {
        this._tail = undefined;
      }
    } else if (node === this._tail) {
      // last node
      this._tail = node._prev;

      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this._tail!._next = undefined;
    }

    node._owner = null;
    return this;
  }

  /**
   * Detach all listeners.
   */
  detachAll(): this {
    let node = this._head;
    if (node == null) return this;

    this._head = this._tail = undefined;

    while (node != null) {
      node._owner = null;
      node = node._next;
    }
    return this;
  }

  private _addMiniSignalBinding(
    node: MiniSignalBinding<T, A>
  ): MiniSignalBinding<T, A> {
    if (this._head == null) {
      this._head = node;
      this._tail = node;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      this._tail!._next = node;
      node._prev = this._tail;
      this._tail = node;
    }

    node._owner = this;

    return node;
  }
}
