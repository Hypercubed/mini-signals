(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.miniSignals = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var EE = function EE(fn, context) {
    _classCallCheck(this, EE);

    this.fn = fn;
    this.context = context;
  };

  var MiniSignals = (function () {
    function MiniSignals() {
      _classCallCheck(this, MiniSignals);

      this._listeners = undefined;
    }

    _createClass(MiniSignals, [{
      key: 'listeners',
      value: function listeners(exists) {
        var available = this._listeners;

        if (exists) return !!available;
        if (!available) return [];
        if (available.fn) return [available.fn];

        for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
          ee[i] = available[i].fn;
        }

        return ee;
      }
    }, {
      key: 'emit',
      value: function emit(a1, a2, a3, a4, a5) {

        if (!this._listeners) return false;

        var listeners = this._listeners,
            len = arguments.length,
            args,
            i;

        if ('function' === typeof listeners.fn) {

          switch (len) {
            case 0:
              return (listeners.fn.call(listeners.context), true);
            case 1:
              return (listeners.fn.call(listeners.context, a1), true);
            case 2:
              return (listeners.fn.call(listeners.context, a1, a2), true);
            case 3:
              return (listeners.fn.call(listeners.context, a1, a2, a3), true);
            case 4:
              return (listeners.fn.call(listeners.context, a1, a2, a3, a4), true);
            case 5:
              return (listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true);
          }

          for (i = 0, args = new Array(len); i < len; i++) {
            args[i] = arguments[i];
          }

          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length,
              j;

          for (i = 0; i < length; i++) {

            switch (len) {
              case 0:
                listeners[i].fn.call(listeners[i].context);break;
              case 1:
                listeners[i].fn.call(listeners[i].context, a1);break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1, a2);break;
              default:
                if (!args) for (j = 0, args = new Array(len); j < len; j++) {
                  args[j] = arguments[j];
                }

                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }

        return true;
      }
    }, {
      key: 'add',
      value: function add(fn, context) {

        var listener = new EE(fn, context || this);

        if (!this._listeners) this._listeners = listener;else {
          if (!this._listeners.fn) {
            this._listeners.push(listener);
          } else this._listeners = [this._listeners, listener];
        }

        return this;
      }
    }, {
      key: 'removeListener',
      value: function removeListener(fn, context) {

        if (!this._listeners) return this;

        var listeners = this._listeners,
            events = [];

        if (fn) {
          if (listeners.fn) {
            if (listeners.fn !== fn || context && listeners.context !== context) {
              events.push(listeners);
            }
          } else {
            for (var i = 0, length = listeners.length; i < length; i++) {
              if (listeners[i].fn !== fn || context && listeners[i].context !== context) {
                events.push(listeners[i]);
              }
            }
          }
        }

        if (events.length) {
          this._listeners = events.length === 1 ? events[0] : events;
        } else {
          delete this._listeners;
        }

        return this;
      }
    }, {
      key: 'removeAllListeners',
      value: function removeAllListeners() {
        if (!this._listeners) return this;

        delete this._listeners;

        return this;
      }
    }]);

    return MiniSignals;
  })();

  MiniSignals.prototype.dispatch = MiniSignals.prototype.emit;
  MiniSignals.prototype.remove = MiniSignals.prototype.removeListener;

  module.exports = MiniSignals;
});
