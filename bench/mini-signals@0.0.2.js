(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.miniSignals = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function Node(fn, context) {
    this.fn = fn;
    this.context = context;
    this.next = this.prev = null;
  }

  var MiniSignals = (function () {
    function MiniSignals() {
      _classCallCheck(this, MiniSignals);

      this._head = this._tail = undefined;
    }

    _createClass(MiniSignals, [{
      key: "listeners",
      value: function listeners(exists) {
        var node = this._head;

        if (exists) {
          return !!node;
        }
        if (!node) {
          return [];
        }

        var i = 0,
            ee = new Array();

        while (node) {
          ee.push(node.fn);
          node = node.next;
        }

        return ee;
      }
    }, {
      key: "dispatch",
      value: function dispatch() {
        var node = this._head;

        if (!node) {
          return false;
        }

        while (node) {
          node.fn.apply(node.context, arguments);
          node = node.next;
        }

        return true;
      }
    }, {
      key: "add",
      value: function add(fn, context) {

        var node = new Node(fn, context || this);

        if (!this._head) {
          this._head = node;
          this._tail = node;
        } else {
          this._tail.next = node;
          node.prev = this._tail;
          this._tail = node;
        }

        return this;
      }
    }, {
      key: "remove",
      value: function remove(fn, context) {
        var node = this._head,
            next;
        if (!node) {
          return this;
        }
        if (!fn) {
          return this.removeAll();
        }

        while (node) {
          next = node.next;

          if (node.fn === fn && (!context || node.context === context)) {
            if (node === this._head) {
              this._head = node.next;
              if (!this._head) {
                this._tail = null;
              } else {
                this._head.prev = null;
              }
            } else if (node === this._tail) {
              this._tail = node.prev;
              this._tail.next = null;
            } else {
              node.prev.next = node.next;
              node.next.prev = node.prev;
            }
            node.next = node.prev = null;
          }

          node = next;
        }

        return this;
      }
    }, {
      key: "removeAll",
      value: function removeAll() {
        var node = this._head,
            next;
        if (!node) {
          return this;
        }

        while (node) {
          next = node.next;
          node.next = node.prev = null;
          node = next;
        }
        this._head = this._tail = null;
        return this;
      }
    }]);

    return MiniSignals;
  })();

  module.exports = MiniSignals;
});
