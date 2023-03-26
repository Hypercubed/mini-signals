import {expectAssignable, expectError, expectType} from 'tsd';
import { MiniSignal } from './mini-signals';

describe('MiniSignal Typing', () => {
  it('should have correct types', () => {
    const e1 = new MiniSignal<[string]>();

    const l1 = e1.add(a => {
      expectType<string>(a);
    });

    expectAssignable<WeakRef<any>>(l1);

    expectType<boolean>(e1.dispatch('foo'));

    expectType<typeof e1>(e1.detach(l1));
  });

  it('should show TS error on incorrect listeners and dispatch', () => {
    const e1 = new MiniSignal<[string]>();

    expectError(e1.add((a: number) => { /* noop */ }));

    expectError(e1.dispatch(5));
  });

  it('should show TS error on incorrect binding with different types', () => {
    const e1 = new MiniSignal<[string]>();
    const e2 = new MiniSignal<[number]>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<number>);

    expectAssignable<WeakRef<any>>(l1);
    expectAssignable<WeakRef<any>>(l2);

    expectType<typeof e1>(e1.detach(l1));

    expectError(e1.detach(l2));

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show ts error on incorrect branded types', () => {
    const e1 = new MiniSignal<[string], { __type: 'e1' }>();
    const e2 = new MiniSignal<[string], { __type: 'e2' }>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectAssignable<WeakRef<any>>(l1);
    expectAssignable<WeakRef<any>>(l2);

    expectType<typeof e1>(e1.detach(l1));

    expectError(e1.detach(l2));

    expectType<boolean>(e1.dispatch('foo'));
  });
});