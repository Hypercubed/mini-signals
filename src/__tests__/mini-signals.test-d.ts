import { expectError, expectType } from 'tsd';
import { describe, it } from 'vitest';

import { MiniSignal } from '../mini-signals.ts';
import { MiniSignalEmitter } from '../mini-signals-emitter.ts';

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

describe('MiniSignalEmitter Typing', () => {
  it('should have correct types', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });

    const offLogout = emitter.once('logout', (reason) => {
      expectType<string>(reason);
    });
    expectType<boolean>(emitter.emit('login', 'user123'));
    expectType<boolean>(emitter.emit('logout', 'timeout'));

    emitter.removeListener('login', offLogin);
    emitter.removeListener('logout', offLogout);
  });

  it('should have correct types (symbols)', () => {
    const LOGIN = Symbol('login');
    const LOGOUT = Symbol('logout');

    const emitter = new MiniSignalEmitter({
      [LOGIN]: new MiniSignal<[string]>(),
      [LOGOUT]: new MiniSignal<[string]>(),
    });

    const offLogin = emitter.on(LOGIN, (userId) => {
      expectType<string>(userId);
    });

    const offLogout = emitter.once(LOGOUT, (reason) => {
      expectType<string>(reason);
    });
    expectType<boolean>(emitter.emit(LOGIN, 'user123'));
    expectType<boolean>(emitter.emit(LOGOUT, 'timeout'));

    emitter.removeListener(LOGIN, offLogin);
    emitter.removeListener(LOGOUT, offLogout);
  });

  it('should show TS error on incorrect listeners and dispatch', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    expectError(
      emitter.on('login', (userId: number) => {
        expectType<string>(userId);
      })
    );

    expectError(
      emitter.once('logouts', (reason) => {
        expectType<string>(reason);
      })
    );

    expectError(emitter.emit('login', 123));
    expectError(emitter.emit('logouts', 'timeout'));
  });

  it('should show TS error on incorrect event names', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    expectError(
      emitter.on('signout', (reason) => {
        expectType<string>(reason);
      })
    );
    expectError(emitter.emit('signout', 'user123'));
  });

  it('should show TS error on incorrect event names (symbols)', () => {
    const LOGIN = Symbol('login');
    const LOGOUT = Symbol('logout');

    const emitter = new MiniSignalEmitter({
      [LOGIN]: new MiniSignal<[string]>(),
      [LOGOUT]: new MiniSignal<[string]>(),
    });

    const SIGNOUT = Symbol('signout');

    expectError(
      emitter.on(SIGNOUT, (reason) => {
        expectType<string>(reason);
      })
    );
    expectError(emitter.emit(SIGNOUT, 'user123'));
  });

  it('should show TS error on removing listener with incorrect event name', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });
    expectError(emitter.removeListener('signout', offLogin));
  });

  it('should show TS error on removing listener with incorrect event name (symbols)', () => {
    const LOGIN = Symbol('login');
    const LOGOUT = Symbol('logout');

    const emitter = new MiniSignalEmitter({
      [LOGIN]: new MiniSignal<[string]>(),
      [LOGOUT]: new MiniSignal<[string]>(),
    });
    const offLogin = emitter.on(LOGIN, (userId) => {
      expectType<string>(userId);
    });
    const SIGNOUT = Symbol('signout');
    expectError(emitter.removeListener(SIGNOUT, offLogin));
  });

  it('should show TS error on incorrect listener type when removing', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });

    const offLogout = emitter.on('logout', (userId) => {
      expectType<string>(userId);
    });

    expectError(emitter.removeListener('login', offLogout));
  });
});
