/* jshint -W097 */

export class MiniSignalBinding {

  /**
  * MiniSignalBinding constructor.
  * @constructs MiniSignalBinding
  * @param {Function} fn Event handler to be called.
  * @param {Boolean} [once=false] Should this listener be removed after dispatch
  * @param {Mixed} [thisArg] The context of the callback function.
  * @api private
  */
  constructor (fn, once = false, thisArg) {
    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }

  detach () {
    if (this._owner === null) return false;
    this._owner.detach(this);
    return true;
  }

}

/**
* @private
*/
function _addMiniSignalBinding (self, node) {
  if (!self._head) {
    self._head = node;
    self._tail = node;
  } else {
    self._tail._next = node;
    node._prev = self._tail;
    self._tail = node;
  }

  node._owner = self;

  return node;
}

export class MiniSignal {

  /**
  * MiniSignal constructor.
  * @constructs MiniSignal
  * @api public
  *
  * @example
  * let mySignal = new MiniSignal();
  * let binding = mySignal.add(onSignal);
  * mySignal.dispatch('foo', 'bar');
  * mySignal.detach(binding);
  */
  constructor () {
    this._head = this._tail = undefined;
  }

  /**
  * Return an array of attached MiniSignalBinding.
  *
  * @param {Boolean} [exists=false] We only need to know if there are handlers.
  * @returns {MiniSignalBinding[]|Boolean} Array of attached MiniSignalBinding or Boolean if called with exists = true
  * @api public
  */
  handlers (exists = false) {
    let node = this._head;

    if (exists) return !!node;

    const ee = [];

    while (node) {
      ee.push(node);
      node = node._next;
    }

    return ee;
  }

  /**
  * Return true if node is a MiniSignalBinding attached to this MiniSignal
  *
  * @param {MiniSignalBinding} node Node to check.
  * @returns {Boolean} True if node is attache to mini-signal
  * @api public
  */
  has (node) {
    if (!(node instanceof MiniSignalBinding)) {
      throw new Error('MiniSignal#has(): First arg must be a MiniSignalBinding object.');
    }

    return node._owner === this;
  }

  /**
  * Dispaches a signal to all registered listeners.
  *
  * @returns {Boolean} Indication if we've emitted an event.
  * @api public
  */
  dispatch () {
    let node = this._head;

    if (!node) return false;

    while (node) {
      if (node._once) this.detach(node);
      node._fn.apply(node._thisArg, arguments);
      node = node._next;
    }

    return true;
  }

  /**
  * Register a new listener.
  *
  * @param {Function} fn Callback function.
  * @param {Mixed} [thisArg] The context of the callback function.
  * @returns {MiniSignalBinding} The MiniSignalBinding node that was added.
  * @api public
  */
  add (fn, thisArg = null) {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#add(): First arg must be a Function.');
    }
    return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
  }

  /**
  * Register a new listener that will be executed only once.
  *
  * @param {Function} fn Callback function.
  * @param {Mixed} [thisArg] The context of the callback function.
  * @returns {MiniSignalBinding} The MiniSignalBinding node that was added.
  * @api public
  */
  once (fn, thisArg = null) {
    if (typeof fn !== 'function') {
      throw new Error('MiniSignal#once(): First arg must be a Function.');
    }
    return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
  }

  /**
  * Remove binding object.
  *
  * @param {MiniSignalBinding} node The binding node that will be removed.
  * @returns {MiniSignal} The instance on which this method was called.
  * @api public */
  detach (node) {
    if (!(node instanceof MiniSignalBinding)) {
      throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
    }
    if (node._owner !== this) return this;  // todo: or error?

    if (node._prev) node._prev._next = node._next;
    if (node._next) node._next._prev = node._prev;

    if (node === this._head) {  // first node
      this._head = node._next;
      if (node._next === null) {
        this._tail = null;
      }
    } else if (node === this._tail) {  // last node
      this._tail = node._prev;
      this._tail._next = null;
    }

    node._owner = null;
    return this;
  }

  /**
  * Detach all listeners.
  *
  * @returns {MiniSignal} The instance on which this method was called.
  * @api public
  */
  detachAll () {
    let node = this._head;
    if (!node) return this;

    this._head = this._tail = null;

    while (node) {
      node._owner = null;
      node = node._next;
    }
    return this;
  }
}

export default MiniSignal;
