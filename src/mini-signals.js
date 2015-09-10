/*jshint -W097 */

/**
 * Representation of a single MiniSignals function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @api private
 */
function Node(fn, context, once = false) {
  this.fn = fn;
  this.context = context;
  this.next = this.prev = null;
  this.once = once;
  this.detach = noop
}

function noop() {}

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
      ee.push(node.fn);
      node = node.next;
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
      node.fn.apply(node.context, arguments);
      if (node.once) { node.detach(); }
      node = node.next;
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
      this._tail.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    var self = this;
    node.detach = (function() {
      if (this === self._head)  {  // first node
        self._head = this.next;
        if (!self._head){
          self._tail = null;
        } else {
          self._head.prev = null;
        }
      } else if (this === self._tail) {  // last node
        self._tail = node.prev;
        self._tail.next = null;
      } else {  // middle
        this.prev.next = this.next;
        this.next.prev = this.prev;
      }
      this.fn = null;
      this.context = null;
      this.detach = noop;
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

      if (node.fn === fn && (!context || node.context === context)) {
        node.detach();
      }

      node = node.next;
    }

    return this;
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
