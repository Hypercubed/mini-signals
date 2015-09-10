/*jshint -W097 */

/**
 * Representation of a single MiniSignals function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @api private
 */
function Node(fn, context, once = false) {
  this._fn = fn;
  this._context = context;
  this._next = this._prev = null;
  this._once = once;
}

/**
 * Minimal MiniSignals interface modeled against the js-signals
 * interface.
 */
export default class MiniSignals {

  constructor() {
    this._head = this._tail = undefined;
  }

  /**
  * Return a list of assigned event listeners.
  *
  * @param {Boolean} exists We only need to know if there are listeners.
  * @returns {Array|Boolean}
  * @api public
  */
  listeners(exists) {
    var node = this._head;

    if (exists) { return !!node; }

    var ee = [];

    while (node) {
      ee.push(node._fn);
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
      node._fn.apply(node._context, arguments);
      if (node._once) { this.detach(node); }
      node = node._next;
    }

    return true;
  }

  /**
  * Register a new EventListener.
  *
  * @param {Functon} fn Callback function.
  * @param {Mixed} context The context of the function.
  * @api public
  */
  add(fn, context) {
    var node = new Node(fn, context || this);
    return this._addNode(node);
  }

  once(fn, context) {
    var node = new Node(fn, context || this, true);
    return this._addNode(node);
  }

  _addNode(node) {
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
  * Remove event listeners.  (may be deprecated)
  *
  * @param {Function} fn The listener that we need to find.
  * @param {Mixed} context Only remove listeners matching this context.
  * @api public */
  remove(fn, context) {
    if (!fn) { return this.removeAll(); }  // maybe change this

    var node = this._head;
    while (node) {

      if (node._fn === fn && (!context || node._context === context)) {
        this.detach(node);
      }

      node = node._next;
    }

    return this;
  }

  /**
  * Remove binding object.  (may be deprecated)
  *
  * @param {Node} node The binding node that will be removed.
  * @api public */
  detach(node) {
    if (!node._fn) { return; }
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
  }


  /**
  * Remove all listeners.
  *
  * @api public
  */
  removeAll() {
    var node = this._head;
    if (!node) { return this; }

    this._head = this._tail = null;
    return this;
  }
}
