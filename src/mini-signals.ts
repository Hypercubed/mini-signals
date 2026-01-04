import type { EventHandler, MiniSignalBinding } from './mini-signals-types.js';

const MINI_SIGNAL_KEY = Symbol('SIGNAL');

export interface MiniSignalNode<T extends any[]> {
  fn: EventHandler<T>;
  next?: MiniSignalNode<T>;
  prev?: MiniSignalNode<T>;
}

function isBinding(obj: any): obj is MiniSignalBinding<any, any> {
  return typeof obj === 'object' && MINI_SIGNAL_KEY in obj;
}

/**
 * @document __docs__/mini-signal.md
 */
export class MiniSignal<T extends any[] = any[], S = symbol | string> {
  /**
   * A Symbol that is used to guarantee the uniqueness of the MiniSignal instance.
   */
  private readonly _symbol = Symbol('MiniSignal');
  private _refMap = new WeakMap<MiniSignalBinding<T, S>, MiniSignalNode<T>>();

  private _head?: MiniSignalNode<T> = undefined;
  private _tail?: MiniSignalNode<T> = undefined;
  private _dispatching = false;

  /**
   * Check if there are any listeners attached.
   */
  hasListeners(): boolean {
    return this._head != null;
  }

  /**
   * Register a new listener.
   */
  add(fn: EventHandler<T>): MiniSignalBinding<T, S> {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return this._createBinding(this._addNode({ fn }));
  }

  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...args: T): boolean {
    if (this._dispatching)
      throw new Error('MiniSignal#dispatch(): Signal already dispatching.');

    let node = this._head;
    if (node == null) return false;
    this._dispatching = true;

    // We know we have at least one node here
    void node.fn(...args);
    node = node.next;

    while (node != null) {
      void node.fn(...args);
      node = node.next;
    }

    this._dispatching = false;
    return true;
  }

  /**
   * Dispatches listeners serially, waiting for each to complete if they return a Promise.
   * Returns a Promise that resolves to true if listeners were called, false otherwise.
   */
  async dispatchSerial(...args: T): Promise<boolean> {
    if (this._dispatching)
      throw new Error(
        'MiniSignal#dispatchSerial(): Signal already dispatching.'
      );

    let node = this._head;

    if (node == null) return false;
    this._dispatching = true;

    // We know we have at least one node here
    await node.fn(...args);
    node = node.next;

    while (node != null) {
      await node.fn(...args);
      node = node.next;
    }

    this._dispatching = false;
    return true;
  }

  /**
   * Dispatches listeners in parallel, waiting for all to complete if they return Promises.
   * Returns a Promise that resolves to true if listeners were called, false otherwise.
   */
  async dispatchParallel(...args: T): Promise<boolean> {
    if (this._dispatching) {
      throw new Error(
        'MiniSignal#dispatchParallel(): Signal already dispatching.'
      );
    }

    let node = this._head;

    if (node == null) return await Promise.resolve(false);
    this._dispatching = true;

    // Fast Promise.all implementation to avoid creating an array of promises
    return await new Promise((resolve, reject) => {
      let promisesRunning = 0;

      while (node != null) {
        promisesRunning++;

        Promise.resolve(node.fn(...args)) // ensures non-promise values are handled as promises
          .then(() => {
            promisesRunning--;
            if (node == null && promisesRunning === 0) {
              this._dispatching = false;
              resolve(true);
            }
          })
          .catch((err) => {
            this._dispatching = false;
            reject(err);
          });

        node = node.next;
      }
    });
  }

  /**
   * Remove binding object.
   */
  detach(sym: MiniSignalBinding<T, S>): this {
    if (!isBinding(sym)) {
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

    if (node == null) return this; // already detached

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

  private _destroyNode(node: MiniSignalNode<T>): void {
    node.fn = undefined as any;
    node.prev = undefined;
  }

  private _disconnectNode(node: MiniSignalNode<T>): void {
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

  private _createBinding(node: MiniSignalNode<T>): MiniSignalBinding<T, S> {
    const sym = {
      [MINI_SIGNAL_KEY]: this._symbol,
    } as unknown as MiniSignalBinding<T, S>;
    this._refMap.set(sym, node);
    return sym;
  }
}
