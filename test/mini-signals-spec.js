describe('MiniSignals', function tests() {
  'use strict';

  var MiniSignals = require('../src/mini-signals'),
    assume = require('assume');

  xit('inherits when used with require(util).inherits', function () {
    function Beast() {
      /* rawr, i'm a beast */
    }

    require('util').inherits(Beast, MiniSignals);

    var moop = new Beast(), meap = new Beast();

    assume(moop).is.instanceOf(Beast);
    assume(moop).is.instanceOf(MiniSignals);

    moop.listeners();
    meap.listeners();

    moop.add(/* istanbul ignore next */ function () {
      throw new Error('I should not dispatch');
    });

    meap.dispatch('rawr');
    meap.removeAll();
  });

  /* if ('undefined' !== typeof Symbol) it('works with ES6 symbols', function (next) {
    var e = new MiniSignals()
      , event = Symbol('cows')
      , unknown = Symbol('moo');

    e.on(event, function (arg) {
      assume(e.listeners(unknown).length).equals(0);
      assume(arg).equals('bar');

      e.once(unknown, function (onced) {
        assume(e.listeners(unknown).length).equals(0);
        assume(onced).equals('foo');
        next();
      });

      assume(e.listeners(event).length).equals(1);
      assume(e.listeners(unknown).length).equals(1);

      e.remove(event);
      assume(e.listeners(event).length).equals(0);
      assume(e.dispatch(unknown, 'foo')).equals(true);
    });

    assume(e.dispatch(unknown, 'bar')).equals(false);
    assume(e.dispatch(event, 'bar')).equals(true);
  }); */

  describe('MiniSignals#dispatch', function () {
    it('should return false when there are not events to dispatch', function () {
      var e = new MiniSignals();

      assume(e.dispatch('foo')).equals(false);
      assume(e.dispatch('bar')).equals(false);
    });

    it('emits with context', function (done) {
      var context = { bar: 'baz' }
        , e = new MiniSignals();

      e.add(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context);

      e.dispatch('bar');
    });

    it('emits with context, multiple arguments (force apply)', function (done) {
      var context = { bar: 'baz' }
        , e = new MiniSignals();

      e.add(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context);

      e.dispatch('bar', 1,2,3,4,5,6,7,8,9,0);
    });

    it('can dispatch the function with multiple arguments', function () {

      for(var i = 0; i < 100; i++) {
        var e = new MiniSignals();
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.dispatch.apply(e, args);
        })(i);
      }
    });

    it('can dispatch the function with multiple arguments, multiple listeners', function () {


      for(var i = 0; i < 100; i++) {
        var e = new MiniSignals();
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.dispatch.apply(e, args);
        })(i);
      }
    });

    it('emits with context, multiple listeners (force loop)', function () {
      var e = new MiniSignals();

      e.add(function (bar) {
        assume(this).eqls({ foo: 'bar' });
        assume(bar).equals('bar');
      }, { foo: 'bar' });

      e.add(function (bar) {
        assume(this).eqls({ bar: 'baz' });
        assume(bar).equals('bar');
      }, { bar: 'baz' });

      e.dispatch('bar');
    });

    it('emits with different contexts', function () {
      var e = new MiniSignals()
        , pattern = '';

      function writer() {
        pattern += this;
      }

      e.add(writer, 'foo');
      e.add(writer, 'baz');
      e.add(writer, 'bar');
      e.add(writer, 'banana');

      e.dispatch();
      assume(pattern).equals('foobazbarbanana');
    });

    it('should return true when there are events to dispatch', function (done) {
      var e = new MiniSignals();

      e.add(function () {
        process.nextTick(done);
      });

      assume(e.dispatch()).equals(true);
    });

    it('should return false when there are no events to dispatch', function () {
      var e = new MiniSignals();

      assume(e.dispatch()).equals(false);
    });

    it('receives the emitted events', function (done) {
      var e = new MiniSignals();

      e.add(function (a, b, c, d, undef) {
        assume(a).equals('foo');
        assume(b).equals(e);
        assume(c).is.instanceOf(Date);
        assume(undef).equals(undefined);
        assume(arguments.length).equals(3);

        done();
      });

      e.dispatch('foo', e, new Date());
    });

    it('emits to all event listeners', function () {
      var e = new MiniSignals()
        , pattern = [];

      e.add(function () {
        pattern.push('foo1');
      });

      e.add(function () {
        pattern.push('foo2');
      });

      e.dispatch();

      assume(pattern.join(';')).equals('foo1;foo2');
    });

  });

  describe('MiniSignals#listeners', function () {
    it('returns an empty array if no listeners are specified', function () {
      var e = new MiniSignals();

      assume(e.listeners()).is.a('array');
      assume(e.listeners().length).equals(0);
    });

    it('returns an array of function', function () {
       var e = new MiniSignals();

       /* istanbul ignore next */
       function foo() {}

       e.add(foo);
       e.add(foo);
       assume(e.listeners()).is.a('array');
       assume(e.listeners().length).equals(2);
       assume(e.listeners()).deep.equals([foo,foo]);
    });

    it('is not vulnerable to modifications', function () {
      var e = new MiniSignals();

      /* istanbul ignore next */
      function foo() {}

      e.add(foo);

      assume(e.listeners()).deep.equals([foo]);

      e.listeners().length = 0;
      assume(e.listeners()).deep.equals([foo]);
    });

    it('can return a boolean as indication if listeners exist', function () {
      var e = new MiniSignals();

      /* istanbul ignore next */
      function foo() {}

      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);

      assume(e.listeners(true)).equals(true);

      e.removeAll();

      assume(e.listeners(true)).equals(false);
    });
  });

  describe('MiniSignals#remove', function () {
    it('should only remove the event with the specified function', function () {
      var e = new MiniSignals();

      /* istanbul ignore next */
      function bar() {}
      e.add(/* istanbul ignore next */ function () {});
      e.add(/* istanbul ignore next */ function () {});
      e.add(bar);

      assume(e.listeners().length).equals(3);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().length).equals(2);

    });

    it('should remove all listeners if no function specified', function () {
      var e = new MiniSignals();

      /* istanbul ignore next */
      function bar() {}
      e.add(/* istanbul ignore next */ function () {});
      e.add(/* istanbul ignore next */ function () {});
      e.add(bar);

      assume(e.listeners().length).equals(3);

      assume(e.remove()).equals(e);
      assume(e.listeners().length).equals(0);

    });

    it('should not thow an error if no listerners are set', function () {
      var e = new MiniSignals();

      /* istanbul ignore next */
      function bar() {}

      assume(e.listeners().length).equals(0);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.remove()).equals(e);
      assume(e.listeners().length).equals(0);
    });

    it('should only remove listeners matching the correct context', function () {
      var e = new MiniSignals()
        , context = { foo: 'bar' };

      /* istanbul ignore next */
      function foo() {}
      /* istanbul ignore next */
      function bar() {}
      e.add(foo, context);

      assume(e.listeners().length).equals(1);
      assume(e.remove(/* istanbul ignore next */ function () {}, context)).equals(e);
      assume(e.listeners().length).equals(1);
      assume(e.remove(foo, { baz: 'quux' })).equals(e);
      assume(e.listeners().length).equals(1);
      assume(e.remove(foo, context)).equals(e);
      assume(e.listeners().length).equals(0);

      e.add(foo, context);
      e.add(bar);

      assume(e.listeners().length).equals(2);
      assume(e.remove(foo, { baz: 'quux' })).equals(e);
      assume(e.listeners().length).equals(2);
      assume(e.remove(foo, context)).equals(e);
      assume(e.listeners().length).equals(1);
      assume(e.listeners()[0]).equals(bar);

      e.add(foo, context);

      assume(e.listeners().length).equals(2);
      assume(e.removeAll()).equals(e);
      assume(e.listeners().length).equals(0);
    });
  });

  describe('MiniSignals#removeAll', function () {
    it('removes all events', function () {
      var e = new MiniSignals();

      e.add(/* istanbul ignore next */ function () { throw new Error('oops'); });
      e.add(/* istanbul ignore next */ function () { throw new Error('oops'); });
      e.add(/* istanbul ignore next */ function () { throw new Error('oops'); });
      e.add(/* istanbul ignore next */ function () { throw new Error('oops'); });

      assume(e.removeAll()).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.dispatch()).equals(false);
    });

  });

});
