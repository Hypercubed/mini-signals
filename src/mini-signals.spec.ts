import { MiniSignal } from '../src/mini-signals';

import { expect } from 'chai';

describe('MiniSignal', () => {
  const pattern: string[] = [];

  const writer = (a: string): void => {
    pattern.push(a);
  };

  beforeEach(() => {
    pattern.length = 0;
  });

  it('quick test', () => {
    const e = new MiniSignal<[string]>();

    const foo = e.add(writer);
    e.add(writer);
    const bar = e.add(writer);

    expect(e instanceof MiniSignal);

    e.dispatch('banana');
    e.dispatch('apple');

    e.detach(foo);
    e.detach(bar);

    e.dispatch('pear');

    e.detachAll();

    e.dispatch('raspberry');

    expect(pattern.join(';')).to.equal('banana;banana;banana;apple;apple;apple;pear');
  });

  describe('Readme Examples', () => {
    it('Example Usage', () => {
      const mySignal = new MiniSignal<[string, string]>();

      const binding = mySignal.add(onSignal); // add listener
      mySignal.dispatch('foo', 'bar'); // dispatch signal passing custom parameters
      mySignal.detach(binding); // remove a single listener

      function onSignal(foo: string, bar: string): void {
        expect(foo).to.equal('foo');
        expect(bar).to.equal('bar');
      }
    });

    it('Function#bind example', () => {
      const mySignal = new MiniSignal<[string]>();
      const context = {};

      const cb = function (bar: string) {
        expect(arguments).has.length(1);
        expect(bar).equals('bar');
        expect(this).equals(context);
      }.bind(context);

      mySignal.add(cb);

      mySignal.dispatch('bar');
    });

    it('Function#bind example with parameters', () => {
      const mySignal = new MiniSignal<never>();
      const context = {};
      const cb = function (bar: string) {
        expect(arguments).has.length(1);
        expect(bar).equals('bar');
        expect(this).equals(context);
      }.bind(context, 'bar');

      mySignal.add(cb);

      mySignal.dispatch();
    });
  });

  describe('MiniSignal#add', () => {
    let e: MiniSignal;

    beforeEach(() => {
      e = new MiniSignal<[string]>();
    });

    it('should throw error for incorrect types', () => {
      expect(() => {
        // @ts-expect-error testing error
        e.add();
      }).throws('MiniSignal#add(): First arg must be a Function.');
      expect(() => {
        // @ts-expect-error testing error
        e.add(123);
      }).throws('MiniSignal#add(): First arg must be a Function.');
      expect(() => {
        // @ts-expect-error testing error
        e.add(true);
      }).throws('MiniSignal#add(): First arg must be a Function.');
      expect(!e.hasListeners);
    });

    // Note: once is deprecated
    // These tests use the add method instead
    it('should not invoke twice', () => {
      const l = e.add(function (arg: string) {
        writer(arg);
        expect(arg).equals('foo');
        e.detach(l);
      });

      e.dispatch('foo');
      e.dispatch('bar');
      e.dispatch('baz');

      expect(pattern.join(';')).equals('foo');
    });
  });

  describe('MiniSignal#dispatch', () => {
    let e: MiniSignal;

    beforeEach(() => {
      e = new MiniSignal<[string]>();
    });

    it('should return false when there are not events to dispatch', () => {
      expect(e.dispatch('foo')).equals(false);
      expect(e.dispatch('bar')).equals(false);
    });

    it('emits with context when function is bound function', () => {
      const cb = function (bar: string): void {
        expect(bar).equals('bar');
        expect(this).equals(context);
        expect(arguments).has.length(1);
      }.bind(context);

      e.add(cb);

      e.dispatch('bar');
    });

    it('can dispatch the function with multiple arguments', () => {
      for (let i = 0; i < 100; i++) {
        const e = new MiniSignal<number[]>();
        (function (j) {
          const args: number[] = [];

          for (let i = 0; i < j; i++) {
            args.push(j);
          }

          e.add((..._args) => {
            expect(_args.length).equals(args.length);
          });

          e.dispatch.apply(e, args);
        })(i);
      }
    });

    it('can dispatch the function with multiple arguments, multiple listeners', () => {
      for (let i = 0; i < 100; i++) {
        const e = new MiniSignal<number[]>();
        (function (j) {
          const args: number[] = [];

          for (let i = 0; i < j; i++) {
            args.push(j);
          }

          e.add((..._args) => {
            expect(_args.length).equals(args.length);
          });

          e.add((..._args) => {
            expect(_args.length).equals(args.length);
          });

          e.add((..._args) => {
            expect(_args.length).equals(args.length);
          });

          e.add((..._args) => {
            expect(_args.length).equals(args.length);
          });

          e.dispatch.apply(e, args);
        })(i);
      }
    });

    it('can dispatch many listeners', () => {
      const N = 10000;
      let sum = 0;

      function add(i: number): void {
        sum += i;
      }

      for (let i = 0; i <= N; i++) {
        e.add(add.bind(this, i));
      }

      e.dispatch();

      expect(sum).equals((N * (N + 1)) / 2);
    });

    it('should return true when there are events to dispatch', function (done) {
      e.add(() => {
        process.nextTick(done);
      });

      expect(e.dispatch()).equals(true);
    });

    it('should return false when there are no events to dispatch', () => {
      expect(e.dispatch()).equals(false);
    });

    it('receives the emitted events', (done) => {
      const e = new MiniSignal();

      e.add(function (a, b, c, undef): void {
        expect(a).equals('foo');
        expect(b).equals(e);
        expect(c).is.instanceOf(Date);
        expect(undef).equals(undefined);
        expect(arguments).has.length(3);

        done();
      });

      e.dispatch('foo', e, new Date());
    });

    it('emits to all event listeners', () => {
      const e = new MiniSignal();
      const pattern: string[] = [];

      e.add(() => {
        pattern.push('foo1');
      });

      e.add(() => {
        pattern.push('foo2');
      });

      e.dispatch();

      expect(pattern.join(';')).equals('foo1;foo2');
    });

    it('emits to all event listeners', () => {
      const e = new MiniSignal();

      function foo1(): void {
        pattern.push('foo1');
      }

      function foo2(): void {
        pattern.push('foo2');
      }

      function foo3(): void {
        pattern.push('foo3');
      }

      e.add(foo1);
      e.add(foo2);
      e.add(foo3);

      e.dispatch();

      expect(pattern.join(';')).equals('foo1;foo2;foo3');
    });

    it('emits to all event listeners, removes once', () => {
      const e = new MiniSignal();

      e.add(() => {
        pattern.push('foo1');
      });

      const l = e.add(() => {
        pattern.push('foo2');
        e.detach(l);
      });

      e.add(() => {
        pattern.push('foo3');
      });

      e.dispatch();
      e.dispatch();

      expect(pattern.join(';')).equals('foo1;foo2;foo3;foo1;foo3');
    });

    it('cannot dispatch while dispatching', () => {
      const cb = function (bar: string): void {
        expect(bar).equals('bar');
        expect(arguments).has.length(1);
        e.dispatch('bar');
      };

      e.add(cb);

      expect(() => {
        e.dispatch('bar');
      }).throws('MiniSignal#dispatch(): Signal already dispatching.');
    });
  });

  describe('MiniSignal#detach', () => {
    /* istanbul ignore next */
    function foo(): void {
      pattern.push('foo');
    }

    /* istanbul ignore next */
    function bar(): void {
      pattern.push('bar');
    }

    /* istanbul ignore next */
    function a(): void {
      pattern.push('a');
    }

    /* istanbul ignore next */
    function b(): void {
      pattern.push('b');
    }

    let e: MiniSignal;
    let pattern: string[] = [];

    beforeEach(() => {
      e = new MiniSignal();
      pattern = [];
    });

    it('should throw an error if not a SignalBinding', () => {
      expect(() => {
        // @ts-expect-error testing error
        e.detach();
      }).throws(
        'MiniSignal#detach(): First arg must be a MiniSignal listener reference.'
      );
      expect(() => {
        // @ts-expect-error testing error
        e.detach(1);
      }).throws(
        'MiniSignal#detach(): First arg must be a MiniSignal listener reference.'
      );
      expect(() => {
        // @ts-expect-error testing error
        e.detach(bar);
      }).throws(
        'MiniSignal#detach(): First arg must be a MiniSignal listener reference.'
      );
    });

    it('should only remove the event with the specified node', () => {
      e.add(a);
      e.add(b);
      const _bar = e.add(bar);

      expect(e.hasListeners()).equals(true);
      e.dispatch();
      expect(pattern.join(';')).equals('a;b;bar');

      e.detach(_bar);
      expect(e.hasListeners()).equals(true);

      e.dispatch();
      expect(pattern.join(';')).equals('a;b;bar;a;b');
    });

    it('should remove from front', () => {
      const _bar = e.add(bar);
      e.add(a);
      e.add(b);

      expect(e.hasListeners()).equals(true);
      e.dispatch();
      expect(pattern.join(';')).equals('bar;a;b');

      e.detach(_bar);
      expect(e.hasListeners()).equals(true);
      e.dispatch();
      expect(pattern.join(';')).equals('bar;a;b;a;b');
    });

    it('should remove from middle', () => {
      e.add(a);
      const _bar = e.add(bar);
      e.add(b);

      expect(e.hasListeners()).equals(true);
      e.dispatch();
      expect(pattern.join(';')).equals('a;bar;b');

      e.detach(_bar);
      expect(e.hasListeners()).equals(true);
      e.dispatch();
      expect(pattern.join(';')).equals('a;bar;b;a;b');
    });

    it('emits to all event listeners after removing', () => {
      e.add(a);
      const _foo = e.add(foo);
      e.add(b);

      e.detach(_foo);
      e.dispatch();

      expect(pattern.join(';')).equals('a;b');
    });

    it('can remove previous node in dispatch', () => {
      const _foo = e.add(foo);
      e.add(foo2);
      e.add(a);

      e.dispatch();
      e.dispatch();

      expect(pattern.join(';')).equals('foo;foo2;a;foo2;a');

      function foo2(): void {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });

    it('can remove next node in dispatch', () => {
      e.add(a);
      e.add(foo2);
      const _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      expect(pattern.join(';')).equals('a;foo2;a;foo2'); // will remove node this dispatch (might be unexpected)

      function foo2(): void {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });

    it('can remove node in dispatch', () => {
      e.add(foo2);
      e.add(a);
      const _foo = e.add(foo);

      e.dispatch();
      e.dispatch();

      expect(pattern.join(';')).equals('foo2;a;foo2;a'); // will remove node this dispatch (might be unexpected)

      function foo2(): void {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });

    it('can remove current node in dispatch', () => {
      e.add(a);
      const _foo = e.add(foo2);
      e.add(b);

      e.dispatch();
      e.dispatch();

      expect(pattern.join(';')).equals('a;foo2;b;a;b');

      function foo2(): void {
        pattern.push('foo2');
        e.detach(_foo);
      }
    });

    it('can only detach from same signal', () => {
      const e2 = new MiniSignal();

      const binding = e.add(foo);

      expect(() => {
        e2.detach(binding);
      }).throws('MiniSignal#detach(): MiniSignal listener does not belong to this MiniSignal.');

      expect(e.hasListeners());
    });

    it('can be called multiple times', () => {
      const binding = e.add(foo);
      e.detach(binding);
      e.detach(binding);
      e.detach(binding);
    });
  });

  describe('MiniSignal#detachAll', () => {
    /* istanbul ignore next */
    function oops(): void {
      throw new Error('oops');
    }

    let e: MiniSignal;

    beforeEach(() => {
      e = new MiniSignal();
    });

    it('removes all events', () => {
      e.add(oops);
      e.add(oops);
      e.add(oops);
      e.add(oops);

      expect(e.hasListeners()).equals(true);

      expect(e.detachAll()).equals(e);
      expect(e.hasListeners()).equals(false);

      expect(e.dispatch()).equals(false);
    });

    it('should not throw an error if no listeners are set', () => {
      expect(e.detachAll()).equals(e);
      expect(e.hasListeners()).equals(false);

      expect(e.dispatch()).equals(false);
    });

    it('Should not throw error when calling detach after detachAll', () => {
      const binding = e.add(oops);
      e.detachAll();
      e.detach(binding);
    });
  });

  describe('Garbage Collection', () => {
    it('should not leak memory', async () => {
      const e = new MiniSignal();
      const w = e.add(() => {
        /* */
      });

      expect((e as any)._getRef(w).deref()).to.exist;
      e.dispatch();
      expect((e as any)._getRef(w).deref()).to.exist;

      e.detach(w);

      await new Promise(resolve => setTimeout(resolve, 0));
      global.gc!();
      expect((e as any)._getRef(w).deref()).to.be.undefined;

      // should not throw an error when detaching gc ref
      e.detach(w);
    });

    it('can clean up after itself when using add', async () => {
      const e = new MiniSignal();
      const w = e.add(() => {
        e.detach(w);
      });

      expect((e as any)._getRef(w).deref()).to.exist;
      e.dispatch();
      expect((e as any)._getRef(w).deref()).to.exist;

      await new Promise(resolve => setTimeout(resolve, 0));
      global.gc!();
      expect((e as any)._getRef(w).deref()).to.be.undefined;
    });
  });
});
