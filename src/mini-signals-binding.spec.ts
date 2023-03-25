import { MiniSignal } from '../src';
import { expect } from 'chai';

describe('MiniSignalsBinding', () => {
  describe('MiniSignalsBinding#detach', () => {
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
    let pattern: any;

    beforeEach(() => {
      e = new MiniSignal();
      pattern = [];
    });

    it('should only remove the specific listener', () => {
      e.add(a);
      e.add(b);
      const _bar = e.add(bar);

      expect(e.handlers().length).equals(3);
      e.dispatch();
      expect(pattern.join(';')).equals('a;b;bar');
      pattern = [];

      _bar.detach();
      expect(e.handlers().length).equals(2);
      e.dispatch();
      expect(pattern.join(';')).equals('a;b');
    });

    it('should remove from front', () => {
      const _bar = e.add(bar);
      e.add(a);
      e.add(b);

      expect(e.handlers().length).equals(3);
      e.dispatch();
      expect(pattern.join(';')).equals('bar;a;b');
      pattern = [];

      _bar.detach();
      expect(e.handlers().length).equals(2);
      e.dispatch();
      expect(pattern.join(';')).equals('a;b');
    });

    it('should remove from middle', () => {
      e.add(a);
      const _bar = e.add(bar);
      e.add(b);

      expect(e.handlers().length).equals(3);
      e.dispatch();
      expect(pattern.join(';')).equals('a;bar;b');
      pattern = [];

      _bar.detach();
      e.dispatch();
      expect(pattern.join(';')).equals('a;b');
    });

    it('emits to all event listeners after removing', () => {
      e.add(a);
      const _foo = e.add(foo);
      e.add(b);

      _foo.detach();
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
        _foo.detach();
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
        _foo.detach();
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
        _foo.detach();
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
        _foo.detach();
      }
    });

    it('can be called multiple times', () => {
      const binding = e.add(foo);
      expect(binding._owner === e);
      binding.detach();
      expect(binding._owner === null);
      binding.detach();
      binding.detach();
    });

    it('Should not throw error when calling detach after detachAll', () => {
      const binding = e.add(foo);
      e.detachAll();
      binding.detach();
    });
  });
});
