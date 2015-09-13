describe('MiniSignals', function tests() {
  'use strict';

  var MiniSignals = require('../src/mini-signals'),
    assume = require('assume'),
    assert = require('assert');

  it('inherits when used with require(util).inherits', function () {
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

  describe('MiniSignals#once', function () {
    var e;

    beforeEach(function() {
      e = new MiniSignals();
    });

    it('should return false when there are not events to dispatch', function () {
      assume( function(){ e.once(); } ).throws( 'MiniSignals#once(): First arg must be a Function.' );
      assume( function(){ e.once(123); } ).throws( 'MiniSignals#once(): First arg must be a Function.' );
      assume( function(){ e.once(true); } ).throws( 'MiniSignals#once(): First arg must be a Function.' );
      assume(e.listeners().length).equals(0);
    });
  });

  describe('MiniSignals#add', function () {
    var e;

    beforeEach(function() {
      e = new MiniSignals();
    });

    it('should return false when there are not events to dispatch', function () {
      assume( function(){ e.add(); } ).throws( 'MiniSignals#add(): First arg must be a Function.' );
      assume( function(){ e.add(123); } ).throws( 'MiniSignals#add(): First arg must be a Function.' );
      assume( function(){ e.add(true); } ).throws( 'MiniSignals#add(): First arg must be a Function.' );
      assume(e.listeners().length).equals(0);
    });
  });

  describe('MiniSignals#dispatch', function () {

    function writer() {
      pattern += this;
    }

    var e, context, pattern;

    beforeEach(function() {
      e = new MiniSignals();
      context = { bar: 'baz' };
      pattern = '';
    });

    it('should return false when there are not events to dispatch', function () {
      assume(e.dispatch('foo')).equals(false);
      assume(e.dispatch('bar')).equals(false);
    });

    it('emits with context', function (done) {
      e.add(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context);

      e.dispatch('bar');
    });

    it('emits with context, multiple arguments (force apply)', function (done) {
      e.add(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context);

      e.dispatch('bar', 1,2,3,4,5,6,7,8,9,0);
    });

    it('can dispatch the function with multiple arguments', function () {

      for(var i = 0; i < 100; i++) {
        e = new MiniSignals();
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
        e = new MiniSignals();
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
      e.add(writer, 'foo');
      e.add(writer, 'baz');
      e.add(writer, 'bar');
      e.add(writer, 'banana');

      e.dispatch();
      assume(pattern).equals('foobazbarbanana');
    });

    it('should return true when there are events to dispatch', function (done) {
      e.add(function () {
        process.nextTick(done);
      });

      assume(e.dispatch()).equals(true);
    });

    it('should return false when there are no events to dispatch', function () {
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
      var e = new MiniSignals(), pattern = [];

      e.add(function () {
        pattern.push('foo1');
      });

      e.add(function () {
        pattern.push('foo2');
      });

      e.dispatch();

      assume(pattern.join(';')).equals('foo1;foo2');
    });

    it('emits to all event listeners', function () {
      var e = new MiniSignals(), pattern = [];

      function foo1() {
        pattern.push('foo1');
      }

      function foo2() {
        pattern.push('foo2');
      }

      function foo3() {
        pattern.push('foo3');
      }

      e.add(foo1);
      e.add(foo2);
      e.add(foo3);

      e.dispatch();

      assume(pattern.join(';')).equals('foo1;foo2;foo3');
    });

    it('emits to all event listeners, removes once', function () {
      var e = new MiniSignals(), pattern = [];

      function foo1() {
        pattern.push('foo1');
      }

      function foo2() {
        pattern.push('foo2');
      }

      function foo3() {
        pattern.push('foo3');
      }

      e.add(foo1);
      e.once(foo2);
      e.add(foo3);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('foo1;foo2;foo3;foo1;foo3');
    });

  });

  describe('MiniSignals#listeners', function () {

    /* istanbul ignore next */
    function foo() {}

    /* istanbul ignore next */
    function bar() {}

    /* istanbul ignore next */
    function a() {}

    /* istanbul ignore next */
    function b() {}

    it('returns an empty array if no listeners are specified', function () {
      var e = new MiniSignals();

      assume(e.listeners()).is.a('array');
      assume(e.listeners().length).equals(0);
    });

    it('returns an array of function', function () {
       var e = new MiniSignals();

       e.add(foo);
       e.add(foo);
       assume(e.listeners()).is.a('array');
       assume(e.listeners().length).equals(2);
       assume(e.listeners()).deep.equals([foo,foo]);
    });

    it('is not vulnerable to modifications', function () {
      var e = new MiniSignals();

      e.add(foo);

      assume(e.listeners()).deep.equals([foo]);

      e.listeners().length = 0;
      assume(e.listeners()).deep.equals([foo]);
    });

    it('can return a boolean as indication if listeners exist', function () {
      var e = new MiniSignals();

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

  describe('MiniSignals#detach', function () {

    /* istanbul ignore next */
    function foo() {
      pattern.push('foo');
    }

    /* istanbul ignore next */
    function bar() {
      pattern.push('bar');
    }

    /* istanbul ignore next */
    function a() {
      pattern.push('a');
    }

    /* istanbul ignore next */
    function b() {
      pattern.push('b');
    }

    var e, pattern;

    beforeEach(function() {
      e = new MiniSignals();
      pattern = [];
    });

    it('should throw an error if not a SignalBinding', function () {

      var _bar = e.add(bar);

      assume( function(){ e.detach(); } ).throws( 'MiniSignals#detach(): First arg must be a MiniSignalBinding object.' );
      assume( function(){ e.detach(1); } ).throws( 'MiniSignals#detach(): First arg must be a MiniSignalBinding object.' );
      assume( function(){ e.detach(bar); } ).throws( 'MiniSignals#detach(): First arg must be a MiniSignalBinding object.' );
    });

    it('should only remove the event with the specified function', function () {

      e.add(a);
      e.add(b);
      var _bar = e.add(bar);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b','bar']);

      e.detach(_bar);
      assume(e.listeners().length).equals(2);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from front', function () {

      var _bar = e.add(bar);
      e.add(a);
      e.add(b);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['bar','a','b']);

      e.detach(_bar);
      assume(e.listeners().length).equals(2);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from middle', function () {

      e.add(a);
      var _bar = e.add(bar);
      e.add(b);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','bar','b']);

      e.detach(_bar);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);
      assume(e.listeners().length).equals(2);

    });

    it('emits to all event listeners after removing', function () {

      e.add(a);
      var _foo = e.add(foo);
      e.add(b);

      e.detach(_foo);
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

      function foo2() {
        pattern.push('foo2');
        e.detach(_foo);
      }

    });

    it('can remove next node in dispatch', function () {

      e.add(a);
      e.add(foo2);
      var _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('a;foo2;a;foo2');  // will remove node this dispatch (might be unexpected)

      function foo2() {
        pattern.push('foo2');
        e.detach(_foo);
      }

    });

    it('can remove node in dispatch', function () {

      e.add(foo2);
      e.add(a);
      var _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('foo2;a;foo2;a');  // will remove node this dispatch (might be unexpected)

      function foo2() {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });

    it('can remove current node in dispatch', function () {

      e.add(a);
      var _foo = e.add(foo2);
      e.add(b);

      e.dispatch();
      e.dispatch();

      assume(pattern.join(';')).equals('a;foo2;b;a;b');

      function foo2() {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });
  });

  describe('MiniSignals#remove', function () {

    var e, pattern;

    beforeEach(function() {
      e = new MiniSignals();
      pattern = [];
    });

    /* istanbul ignore next */
    function foo() {}

    /* istanbul ignore next */
    function bar() {}

    /* istanbul ignore next */
    function a() {}

    /* istanbul ignore next */
    function b() {}

    it('should only remove the event with the specified function', function () {
      e.add(a);
      e.add(b);
      e.add(bar);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b','bar']);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().length).equals(2);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from front', function () {
      e.add(bar);
      e.add(a);
      e.add(b);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['bar','a','b']);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().length).equals(2);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from middle', function () {
      e.add(a);
      e.add(bar);
      e.add(b);

      assume(e.listeners().length).equals(3);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','bar','b']);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().map(function(fn) { return fn.name; })).eqls(['a','b']);
      assume(e.listeners().length).equals(2);

    });

    it('should remove all listeners if no function specified', function () {
      e.add(a);
      e.add(b);
      e.add(bar);

      assume(e.listeners().length).equals(3);
      assume(e.remove()).equals(e);
      assume(e.listeners().length).equals(0);

    });

    it('should not thow an error if no listerners are set', function () {
      assume(e.listeners().length).equals(0);

      assume(e.remove(bar)).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.remove()).equals(e);
      assume(e.listeners().length).equals(0);
    });

    it('should only remove listeners matching the correct context', function () {
      var context = { foo: 'bar' };

      e.add(foo, context);

      assume(e.listeners().length).equals(1);
      assume(e.remove(a, context)).equals(e);
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
    /* istanbul ignore next */
    function oops() { throw new Error('oops'); }

    var e;

    beforeEach(function() {
      e = new MiniSignals();
    });

    it('removes all events', function () {

      e.add(oops);
      e.add(oops);
      e.add(oops);
      e.add(oops);

      assume(e.listeners().length).equals(4);

      assume(e.removeAll()).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.dispatch()).equals(false);
    });

    it('should not thow an error if no listerners are set', function () {
      assume(e.removeAll()).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.dispatch()).equals(false);
    });

  });

  describe('Readme Examples', function () {

    it('Example Usage', function () {
      var mySignal = new MiniSignals();

      var binding = mySignal.add(onSignal);   //add listener
      mySignal.dispatch('foo', 'bar');        //dispatch signal passing custom parameters
      binding.detach();                       //remove a single listener

      function onSignal(foo, bar) {
        assert(foo === 'foo');
        assert(bar === 'bar');
      }
    });

    it('Another Example', function () {

      var myObject = {
        foo: 'bar',
        updated: new MiniSignals()
      }

      myObject.updated.add(onUpdated, myObject);   //add listener with context

      myObject.foo = 'baz';
      myObject.updated.dispatch();                 //dispatch signal

      function onUpdated() {
        assert(this === myObject);
        assert(this.foo === 'baz');
      }
    });

  });

});
