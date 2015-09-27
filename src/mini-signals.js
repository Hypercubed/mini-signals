/*jshint -W097 */

/**
 * Representation of a single MiniSignal function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @api private
 */

export class MiniSignalBinding {
  constructor(fn, once = false) {
    this._fn = fn;
    this._next = this._prev = null;
    this._once = once;
  }
}

/**
 * Minimal MiniSignal interface modeled against the js-signals
 * interface.
 */
export class MiniSignal {

  constructor() {
    this._head = this._tail = undefined;
  }

  /**
  * Return a list of assigned event handels.
  *
  * @param {Boolean} exists We only need to know if there are handlers.
  * @returns {Array|Boolean}
  * @api public
  */
  handlers(exists) {
    var node = this._head;

    if (exists) { return !!node; }

    var ee = [];

    while (node) {
      ee.push(node);
      node = node._next;
    }

    return ee;
  }

  /**
  * Emit an event to all registered event listeners.
  *
  * @returns {Boolean} Indication if we've emitted an event.
  * @api public
  */
  dispatch() {
    var node = this._head;

    if (!node) { return false; }

    while (node) {
      node._fn.apply(this, arguments);
      if (node._once) { this.detach(node); }
      node = node._next;
    }

    return true;
  }

  /**
  * Register a new listener.
  *
  * @param {Functon} fn Callback function.
  * @param {Mixed} context The context of the function.
  * @return {SignalBinding} An Object representing the binding between the Signal and listener.
  * @api public
  */
  add(fn) {
    if (typeof fn !== 'function') {
      throw new Error( 'MiniSignal#add(): First arg must be a Function.' );
    }
    var node = new MiniSignalBinding(fn);
    return this._addMiniSignalBinding(node);
  }

  /**
   * Register a new listener that will be executed only once.
   *
   * @param {Functon} fn Callback function.
   * @param {Mixed} context The context of the function.
   * @return {MiniSignalBinding} An Object representing the binding between the Signal and listener.
   * @api public
   */
  once(fn) {
    if (typeof fn !== 'function') {
      throw new Error( 'MiniSignal#once(): First arg must be a Function.' );
    }
    var node = new MiniSignalBinding(fn, true);
    return this._addMiniSignalBinding(node);
  }

  _addMiniSignalBinding(node) {
    if (!this._head) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail._next = node;
      node._prev = this._tail;
      this._tail = node;
    }

    var self = this;
    node.detach = (function() {
      self.detach(this);
    }).bind(node);

    return node;
  }

  /**
  * Remove binding object.
  *
  * @param {MiniSignalBinding} node The binding node that will be removed.
  * @api public */
  detach(node) {
    if (!(node instanceof MiniSignalBinding)) {
      throw new Error( 'MiniSignal#detach(): First arg must be a MiniSignalBinding object.' );
    }
    if (!node._fn) { return this; }
    if (node === this._head)  {  // first node
      this._head = node._next;
      if (!this._head){
        this._tail = null;
      } else {
        this._head._prev = null;
      }
    } else if (node === this._tail) {  // last node
      this._tail = node._prev;
      this._tail._next = null;
    } else {  // middle
      node._prev._next = node._next;
      node._next._prev = node._prev;
    }
    node._fn = null;
    node._context = null;
    return this;
  }

  /**
  * Remove all listeners.
  *
  * @api public
  */
  detachAll() {
    var node = this._head;
    if (!node) { return this; }

    this._head = this._tail = null;
    return this;
  }
}

export default MiniSignal;
