import { expectAssignable, expectError, expectType } from 'tsd';
import { MiniSignal } from './mini-signals';

describe('MiniSignal Typing', () => {
  it('should have correct types', () => {
    const e1 = new MiniSignal<[string]>();

    const l1 = e1.add((a) => {
      expectType<string>(a);
    });

    expectType<boolean>(e1.dispatch('foo'));

    expectType<typeof e1>(e1.detach(l1));
  });

  it('should show TS error on incorrect listeners and dispatch', () => {
    const e1 = new MiniSignal<[string]>();

    expectError(
      e1.add((a: number) => {
        /* noop */
      })
    );

    expectError(e1.dispatch(5));
  });

  it('should show TS error on incorrect binding with different types', () => {
    const e1 = new MiniSignal<[string]>();
    const e2 = new MiniSignal<[number]>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<number>);

    expectType<typeof e1>(e1.detach(l1));

    expectError(e1.detach(l2));

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show ts error on incorrect branded types using flavors', () => {
    const e1 = new MiniSignal<[string], 'e1'>();
    const e2 = new MiniSignal<[string], 'e2'>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectType<typeof e1>(e1.detach(l1));

    expectError(e1.detach(l2));

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show ts error on incorrect branded types using symbols', () => {
    const e1s = Symbol('e1');
    const e2s = Symbol('e2');

    const e1 = new MiniSignal<[string], typeof e1s>();
    const e2 = new MiniSignal<[string], typeof e2s>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectType<typeof e1>(e1.detach(l1));

    expectError(e1.detach(l2));

    expectType<boolean>(e1.dispatch('foo'));
  });
});
