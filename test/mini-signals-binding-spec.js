/* global it, describe, beforeEach */

var MiniSignal = require('../src/');
/* var MiniSignalBinding = MiniSignal.MiniSignalBinding; */
var assume = require('assume');

describe('MiniSignalsBinding', function () {
  'use strict';

  describe('MiniSignalsBinding#detach', function () {
    /* istanbul ignore next */
    function foo () {
      pattern.push('foo');
    }

    /* istanbul ignore next */
    function bar () {
      pattern.push('bar');
    }

    /* istanbul ignore next */
    function a () {
      pattern.push('a');
    }

    /* istanbul ignore next */
    function b () {
      pattern.push('b');
    }

    var e, pattern;

    beforeEach(function () {
      e = new MiniSignal();
      pattern = [];
    });

    it('should only remove the specific listener', function () {
      e.add(a);
      e.add(b);
      var _bar = e.add(bar);

      assume(e.handlers().length).equals(3);
      e.dispatch();
      assume(pattern.join(';')).eqls('a;b;bar');
      pattern = [];

      _bar.detach();
      assume(e.handlers().length).equals(2);
      e.dispatch();
      assume(pattern.join(';')).eqls('a;b');
    });

    it('should remove from front', function () {
      var _bar = e.add(bar);
      e.add(a);
      e.add(b);

      assume(e.handlers().length).equals(3);
      e.dispatch();
      assume(pattern.join(';')).eqls('bar;a;b');
      pattern = [];

      _bar.detach();
      assume(e.handlers().length).equals(2);
      e.dispatch();
      assume(pattern.join(';')).eqls('a;b');
    });

    it('should remove from middle', function () {
      e.add(a);
      var _bar = e.add(bar);
      e.add(b);

      assume(e.handlers().length).equals(3);
      e.dispatch();
      assume(pattern.join(';')).eqls('a;bar;b');
      pattern = [];

      _bar.detach();
      e.dispatch();
      assume(pattern.join(';')).eqls('a;b');
    });

    it('emits to all event listeners after removing', function () {
      e.add(a);
      var _foo = e.add(foo);
      e.add(b);

      _foo.detach();
      e.dispatch();

      assume(pattern.join(';')).equals('a;b');
    });

    it('can remove previous node in dispatch', function () {
      var _foo = e.add(foo);
      e.add(foo2);
      e.add(a);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('foo;foo2;a;foo2;a');

      function foo2 () {
        pattern.push('foo2');
        _foo.detach();
      }
    });

    it('can remove next node in dispatch', function () {
      e.add(a);
      e.add(foo2);
      var _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('a;foo2;a;foo2');  // will remove node this dispatch (might be unexpected)

      function foo2 () {
        pattern.push('foo2');
        _foo.detach();
      }
    });

    it('can remove node in dispatch', function () {
      e.add(foo2);
      e.add(a);
      var _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('foo2;a;foo2;a');  // will remove node this dispatch (might be unexpected)

      function foo2 () {
        pattern.push('foo2');
        _foo.detach();
      }
    });

    it('can remove current node in dispatch', function () {
      e.add(a);
      var _foo = e.add(foo2);
      e.add(b);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('a;foo2;b;a;b');

      function foo2 () {
        pattern.push('foo2');
        _foo.detach();
      }
    });
  });
});
