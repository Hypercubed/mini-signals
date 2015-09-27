/*jshint -W040 */

describe('MiniSignal', function tests() {
  'use strict';

  var MiniSignal = require('../src/mini-signals').MiniSignal,
    MiniSignalBinding = require('../src/mini-signals').MiniSignalBinding,
    assume = require('assume'),
    assert = require('assert');

  it('inherits when used with require(util).inherits', function () {
    function Beast() {
      /* rawr, i'm a beast */
    }

    require('util').inherits(Beast, MiniSignal);

    var moop = new Beast(), meap = new Beast();

    assume(moop).is.instanceOf(Beast);
    assume(moop).is.instanceOf(MiniSignal);

    moop.handlers();
    meap.handlers();

    moop.add(/* istanbul ignore next */ function () {
      throw new Error('I should not dispatch');
    });

    meap.dispatch('rawr');
    meap.detachAll();
  });

  describe('MiniSignal#once', function () {
    var e;

    beforeEach(function() {
      e = new MiniSignal();
    });

    it('should return false when there are not events to dispatch', function () {
      assume( function(){ e.once(); } ).throws( 'MiniSignal#once(): First arg must be a Function.' );
      assume( function(){ e.once(123); } ).throws( 'MiniSignal#once(): First arg must be a Function.' );
      assume( function(){ e.once(true); } ).throws( 'MiniSignal#once(): First arg must be a Function.' );
      assume(e.handlers().length).equals(0);
    });
  });

  describe('MiniSignal#add', function () {
    var e;

    beforeEach(function() {
      e = new MiniSignal();
    });

    it('should return false when there are not events to dispatch', function () {
      assume( function(){ e.add(); } ).throws( 'MiniSignal#add(): First arg must be a Function.' );
      assume( function(){ e.add(123); } ).throws( 'MiniSignal#add(): First arg must be a Function.' );
      assume( function(){ e.add(true); } ).throws( 'MiniSignal#add(): First arg must be a Function.' );
      assume(e.handlers().length).equals(0);
    });
  });

  describe('MiniSignal#dispatch', function () {

    function writer() {
      pattern += this;
    }

    var e, context, pattern;

    beforeEach(function() {
      e = new MiniSignal();
      context = { bar: 'baz' };
      pattern = '';
    });

    it('should return false when there are not events to dispatch', function () {
      assume(e.dispatch('foo')).equals(false);
      assume(e.dispatch('bar')).equals(false);
    });

    it('emits with context', function () {
      e.add((function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);
        assume(arguments).has.length(1);
      }).bind(context));

      e.dispatch('bar');
    });

    it('emits with context, multiple arguments (force apply)', function () {
      e.add((function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);
        assume(arguments).has.length(11);
      }).bind(context));

      e.dispatch('bar', 1,2,3,4,5,6,7,8,9,0);
    });

    it('can dispatch the function with multiple arguments', function () {
      for(var i = 0; i < 100; i++) {  /*jshint -W083 */
        e = new MiniSignal();
        /*jshint -W083 */
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.add(function () {
            assume(arguments.length).equals(args.length);
          });

          e.dispatch.apply(e, args);
        })(i);
        /*jshint +W083 */
      }
    });

    it('can dispatch the function with multiple arguments, multiple listeners', function () {

      for(var i = 0; i < 100; i++) {
        e = new MiniSignal();
        /*jshint -W083 */
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
        /*jshint +W083 */
      }
    });

    it('emits with context, multiple listeners (force loop)', function () {
      e.add((function (bar) {
        assume(this).eqls({ foo: 'bar' });
        assume(bar).equals('bar');
      }).bind({ foo: 'bar' }));

      e.add((function (bar) {
        assume(this).eqls({ bar: 'baz' });
        assume(bar).equals('bar');
      }).bind({ bar: 'baz' }));

      e.dispatch('bar');
    });

    it('emits with different contexts', function () {
      e.add(writer.bind('foo'));
      e.add(writer.bind('baz'));
      e.add(writer.bind('bar'));
      e.add(writer.bind('banana'));

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
      var e = new MiniSignal();

      e.add(function (a, b, c, d, undef) {
        assume(a).equals('foo');
        assume(b).equals(e);
        assume(c).is.instanceOf(Date);
        assume(undef).equals(undefined);
        assume(arguments).has.length(3);

        done();
      });

      e.dispatch('foo', e, new Date());
    });

    it('emits to all event listeners', function () {
      var e = new MiniSignal(), pattern = [];

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
      var e = new MiniSignal(), pattern = [];

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
      var e = new MiniSignal(), pattern = [];

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

  describe('MiniSignal#handlers', function () {

    /* istanbul ignore next */
    function foo() {}

    /* istanbul ignore next */
    function bar() {}

    /* istanbul ignore next */
    function a() {}

    /* istanbul ignore next */
    function b() {}

    it('returns an empty array if no handlers are added', function () {
      var e = new MiniSignal();

      assume(e.handlers()).is.a('array');
      assume(e.handlers().length).equals(0);
    });

    it('returns an array of MiniSignalBinding', function () {
       var e = new MiniSignal();

       e.add(foo);
       e.add(foo);
       assume(e.handlers()).is.a('array');
       assume(e.handlers().length).equals(2);
       e.handlers().forEach(function(h) {
         assume(h).instanceOf(MiniSignalBinding);
       });
    });

    it('is not vulnerable to modifications', function () {
      var e = new MiniSignal();

      e.add(foo);
      e.add(foo);

      assume(e.handlers().length).equals(2);

      e.handlers().length = 0;
      assume(e.handlers().length).equals(2);
      e.handlers().forEach(function(h) {
        assume(h).instanceOf(MiniSignalBinding);
      });
    });

    it('can return a boolean as indication if handlers exist', function () {
      var e = new MiniSignal();

      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);
      e.add(foo);

      assume(e.handlers(true)).equals(true);

      e.detachAll();

      assume(e.handlers(true)).equals(false);
    });
  });

  describe('MiniSignal#detach', function () {

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
      e = new MiniSignal();
      pattern = [];
    });

    it('should throw an error if not a SignalBinding', function () {

      var _bar = e.add(bar);

      assume( function(){ e.detach(); } ).throws( 'MiniSignal#detach(): First arg must be a MiniSignalBinding object.' );
      assume( function(){ e.detach(1); } ).throws( 'MiniSignal#detach(): First arg must be a MiniSignalBinding object.' );
      assume( function(){ e.detach(bar); } ).throws( 'MiniSignal#detach(): First arg must be a MiniSignalBinding object.' );
    });

    it('should only remove the event with the specified function', function () {

      e.add(a);
      e.add(b);
      var _bar = e.add(bar);

      assume(e.handlers().length).equals(3);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['a','b','bar']);

      e.detach(_bar);
      assume(e.handlers().length).equals(2);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from front', function () {

      var _bar = e.add(bar);
      e.add(a);
      e.add(b);

      assume(e.handlers().length).equals(3);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['bar','a','b']);

      e.detach(_bar);
      assume(e.handlers().length).equals(2);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['a','b']);

    });

    it('should remove from middle', function () {

      e.add(a);
      var _bar = e.add(bar);
      e.add(b);

      assume(e.handlers().length).equals(3);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['a','bar','b']);

      e.detach(_bar);
      //assume(e.handlers().map(function(fn) { return fn.name; })).eqls(['a','b']);
      assume(e.handlers().length).equals(2);

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

  describe('MiniSignal#detachAll', function () {
    /* istanbul ignore next */
    function oops() { throw new Error('oops'); }

    var e;

    beforeEach(function() {
      e = new MiniSignal();
    });

    it('removes all events', function () {

      e.add(oops);
      e.add(oops);
      e.add(oops);
      e.add(oops);

      assume(e.handlers().length).equals(4);

      assume(e.detachAll()).equals(e);
      assume(e.handlers().length).equals(0);

      assume(e.dispatch()).equals(false);
    });

    it('should not thow an error if no listerners are set', function () {
      assume(e.detachAll()).equals(e);
      assume(e.handlers().length).equals(0);

      assume(e.dispatch()).equals(false);
    });

  });

  describe('Readme Examples', function () {

    it('Example Usage', function () {
      var mySignal = new MiniSignal();

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
        updated: new MiniSignal()
      };

      myObject.updated.add(onUpdated.bind(myObject));   //add listener with context

      myObject.foo = 'baz';
      myObject.updated.dispatch();                 //dispatch signal

      function onUpdated() {
        assert(this === myObject);
        assert(this.foo === 'baz');
      }

    });

    it('Function#bind example', function () {

      var mySignal = new MiniSignal();

      mySignal.add((function (bar) {
        assume(arguments).has.length(1);
        assume(bar).equals('bar');
        assume(this).equals(context);
      }).bind(context));

      mySignal.dispatch('bar');

    });

    it('Function#bind example with parameters', function () {

      var mySignal = new MiniSignal();

      mySignal.add((function (bar) {
        assume(arguments).has.length(1);
        assume(bar).equals('bar');
        assume(this).equals(context);
      }).bind(context, 'bar'));

      mySignal.dispatch();

    });

  });

});
