/*jshint -W097 */

/**
 * Representation of a single MiniSignals function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @api private
 */
class EE {
  constructor(fn, context) {
    this.fn = fn;
    this.context = context;
  }
}

/**
 * Minimal MiniSignals interface that is molded against the js-signals
 * interface.
 *
 * @constructor
 * @api public
 */
class MiniSignals {

  constructor() {
    /* Nothing to set */

    /**
    * Holds the assigned EventEmitters.
    *
    * @type {Object}
    * @private
    */
    this._listeners = undefined;
  }

  /**
  * Return a list of assigned event listeners.
  *
  * @param {Boolean} exists We only need to know if there are listeners.
  * @returns {Array|Boolean}
  * @api public
  */
  listeners(exists) {
    var available = this._listeners;

    if (exists) return !!available;
    if (!available) return [];
    if (available.fn) return [available.fn];

    for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
      ee[i] = available[i].fn;
    }

    return ee;
  };

  /**
  * Emit an event to all registered event listeners.
  *
  * @returns {Boolean} Indication if we've emitted an event.
  * @api public
  */
  emit(a1, a2, a3, a4, a5) {

    if (!this._listeners) return false;

    var listeners = this._listeners,
      len = arguments.length,
      args,
      i;

    if ('function' === typeof listeners.fn) {
      //if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

      switch (len) {
        case 0: return listeners.fn.call(listeners.context), true;
        case 1: return listeners.fn.call(listeners.context, a1), true;
        case 2: return listeners.fn.call(listeners.context, a1, a2), true;
        case 3: return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 4: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }

      for (i = 0, args = new Array(len); i < len; i++) {
        args[i] = arguments[i];
      }

      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;

      for (i = 0; i < length; i++) {
        //if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

        switch (len) {
          case 0: listeners[i].fn.call(listeners[i].context); break;
          case 1: listeners[i].fn.call(listeners[i].context, a1); break;
          case 2: listeners[i].fn.call(listeners[i].context, a1, a2); break;
          default:
            if (!args) for (j = 0, args = new Array(len); j < len; j++) {
              args[j] = arguments[j];
            }

            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }

    return true;
  };

  /**
  * Register a new EventListener.
  *
  * @param {Functon} fn Callback function.
  * @param {Mixed} context The context of the function.
  * @api public
  */
  add(fn, context) {

    var listener = new EE(fn, context || this);

    if (!this._listeners) this._listeners = listener;
    else {
      if (!this._listeners.fn) { this._listeners.push(listener); }
      else this._listeners = [
        this._listeners, listener
      ];
    }

    return this;
  };

  /**
  * Remove event listeners.
  *
  * @param {Function} fn The listener that we need to find.
  * @param {Mixed} context Only remove listeners matching this context.
  * @api public
  */
  removeListener(fn, context) {

    if (!this._listeners) return this;

    var listeners = this._listeners, events = [];

    if (fn) {
      if (listeners.fn) {
        if (listeners.fn !== fn || (context && listeners.context !== context)) {
          events.push(listeners);
        }
      } else {
        for (var i = 0, length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || (context && listeners[i].context !== context)) {
            events.push(listeners[i]);
          }
        }
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) {
      this._listeners = (events.length === 1) ? events[0] : events;
    } else {
      delete this._listeners;
    }

    return this;
  };

  /**
  * Remove all listeners or only the listeners.
  *
  * @param {String} event The event want to remove all listeners for.
  * @api public
  */
  removeAllListeners() {
    if (!this._listeners) return this;

    delete this._listeners;

    return this;
  };
}

// aliases
MiniSignals.prototype.dispatch = MiniSignals.prototype.emit;
MiniSignals.prototype.remove = MiniSignals.prototype.removeListener;

//
// Expose the module.
//
export default MiniSignals;
