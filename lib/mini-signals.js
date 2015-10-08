/*jshint -W097 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MiniSignalBinding =

/**
* MiniSignalBinding constructor.
* @constructs MiniSignalBinding
* @param {Function} fn Event handler to be called.
* @param {Boolean} [once=false] Should this listener be removed after dispatch
* @api private
*/
function MiniSignalBinding(fn) {
  var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  _classCallCheck(this, MiniSignalBinding);

  this._fn = fn;
  this._next = this._prev = null;
  this._once = once;
};

var MiniSignal = (function () {

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

  function MiniSignal() {
    _classCallCheck(this, MiniSignal);

    this._head = this._tail = undefined;
  }

  /**
  * Return an array of attached MiniSignalBinding.
  *
  * @param {Boolean} [exists=false] We only need to know if there are handlers.
  * @returns {MiniSignalBinding[]|Boolean} Array of attached MiniSignalBinding or Boolean if called with exists = true
  * @api public
  */

  _createClass(MiniSignal, [{
    key: 'handlers',
    value: function handlers() {
      var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var node = this._head;

      if (exists) {
        return !!node;
      }

      var ee = [];

      while (node) {
        ee.push(node);
        node = node._next;
      }

      return ee;
    }

    /**
    * Dispaches a signal to all registered listeners.
    *
    * @returns {Boolean} Indication if we've emitted an event.
    * @api public
    */
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var node = this._head;

      if (!node) {
        return false;
      }

      while (node) {
        node._fn.apply(this, arguments);
        if (node._once) {
          this.detach(node);
        }
        node = node._next;
      }

      return true;
    }

    /**
    * Register a new listener.
    *
    * @param {Function} fn Callback function.
    * @returns {MiniSignalBinding} The MiniSignalBinding node that was added.
    * @api public
    */
  }, {
    key: 'add',
    value: function add(fn) {
      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#add(): First arg must be a Function.');
      }
      var node = new MiniSignalBinding(fn);
      return this._addMiniSignalBinding(node);
    }

    /**
     * Register a new listener that will be executed only once.
     *
     * @param {Function} fn Callback function.
     * @returns {MiniSignalBinding} The MiniSignalBinding node that was added.
     * @api public
     */
  }, {
    key: 'once',
    value: function once(fn) {
      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#once(): First arg must be a Function.');
      }
      var node = new MiniSignalBinding(fn, true);
      return this._addMiniSignalBinding(node);
    }

    /**
     * @private
     */
  }, {
    key: '_addMiniSignalBinding',
    value: function _addMiniSignalBinding(node) {
      if (!this._head) {
        this._head = node;
        this._tail = node;
      } else {
        this._tail._next = node;
        node._prev = this._tail;
        this._tail = node;
      }

      var self = this;
      node.detach = (function () {
        self.detach(this);
      }).bind(node);

      return node;
    }

    /**
    * Remove binding object.
    *
    * @param {MiniSignalBinding} node The binding node that will be removed.
    * @returns {MiniSignal} The instance on which this method was called.
    * @api public */
  }, {
    key: 'detach',
    value: function detach(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
      }
      if (!node._fn) {
        return this;
      }
      if (node === this._head) {
        // first node
        this._head = node._next;
        if (!this._head) {
          this._tail = null;
        } else {
          this._head._prev = null;
        }
      } else if (node === this._tail) {
        // last node
        this._tail = node._prev;
        this._tail._next = null;
      } else {
        // middle
        node._prev._next = node._next;
        node._next._prev = node._prev;
      }
      node._fn = null;
      node._context = null;
      return this;
    }

    /**
    * Detach all listeners.
    *
    * @returns {MiniSignal} The instance on which this method was called.
    * @api public
    */
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var node = this._head;
      if (!node) {
        return this;
      }

      this._head = this._tail = null;
      return this;
    }
  }]);

  return MiniSignal;
})();

MiniSignal.MiniSignalBinding = MiniSignalBinding;

exports['default'] = MiniSignal;
module.exports = exports['default'];
