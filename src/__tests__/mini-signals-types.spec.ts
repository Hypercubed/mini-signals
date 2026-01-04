import { expectError, expectType } from 'tsd';
import { describe, expect, it } from 'vitest';

import { MiniSignal } from '../mini-signals.ts';
import { MiniSignalEmitter } from '../mini-signals-emitter.ts';

describe('MiniSignal Typing', () => {
  it('should have correct types', () => {
    const e1 = new MiniSignal<(s: string) => void>();

    const l1 = e1.add((a) => {
      expectType<string>(a);
    });

    expectType<boolean>(e1.dispatch('foo'));

    expectType<typeof e1>(e1.detach(l1));
  });

  it('should show TS error on incorrect listeners and dispatch', () => {
    const e1 = new MiniSignal<(s: string) => void>();

    expectError(
      e1.add((a: number) => {
        /* noop */
      })
    );
    expectError(e1.dispatch(5));
  });

  it('should show TS error on incorrect binding with different types', () => {
    const e1 = new MiniSignal<(s: string) => void>();
    const e2 = new MiniSignal<(n: number) => void>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<number>);

    expectType<typeof e1>(e1.detach(l1));

    expect(() => {
      expectError(e1.detach(l2));
    }).toThrow();

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show TS error on incorrect branded types using flavors', () => {
    const e1 = new MiniSignal<(s: string) => void, 'e1'>();
    const e2 = new MiniSignal<(s: string) => void, 'e2'>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectType<typeof e1>(e1.detach(l1));

    expect(() => {
      expectError(e1.detach(l2));
    }).toThrow();

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show TS error on incorrect branded types using symbols', () => {
    const e1s = Symbol('e1');
    const e2s = Symbol('e2');

    const e1 = new MiniSignal<(s: string) => void, typeof e1s>();
    const e2 = new MiniSignal<(s: string) => void, typeof e2s>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectType<typeof e1>(e1.detach(l1));

    expect(() => {
      expectError(e1.detach(l2));
    }).toThrow();

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show TS error trying to dispatch when async', () => {
    const e1 = new MiniSignal<() => Promise<void>>();
    expectError(e1.dispatch());

    const e2 = new MiniSignal<(x: string) => Promise<void>>();
    expectError(e2.dispatch('test'));
  });

  it('should show TS error trying to dispatchSerial when sync', () => {
    const e1 = new MiniSignal<() => void>();
    expectError(e1.dispatchSerial());
  });

  it('should show TS error trying to dispatchSerial when sync', () => {
    const e1 = new MiniSignal<(x: string) => void>();
    expectError(e1.dispatchSerial('string'));
  });

  it('should show TS error trying to dispatchParallel when sync', () => {
    const e1 = new MiniSignal<() => void>();
    expectError(e1.dispatchParallel());
  });

  it('should show TS error trying to dispatchParallel when sync', () => {
    const e1 = new MiniSignal<(x: string) => void>();
    expectError(e1.dispatchParallel('test'));
  });

  it('should not show TS errors on dispatch on untyped signals', async () => {
    const e1 = new MiniSignal();
    expectType<boolean>(e1.dispatch());
    expectType<Promise<boolean>>(e1.dispatchParallel());
    expectType<Promise<boolean>>(e1.dispatchSerial());
  });
});

describe('MiniSignalEmitter Typing', () => {
  it('should have correct types', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<(s: string) => void>(),
      logout: new MiniSignal<(s: string) => void>(),
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
      [LOGIN]: new MiniSignal<(s: string) => void>(),
      [LOGOUT]: new MiniSignal<(s: string) => void>(),
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
      login: new MiniSignal<(s: string) => void>(),
      logout: new MiniSignal<(s: string) => void>(),
    });

    expect(() => {
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
    }).toThrow();
  });

  it('should show TS error on incorrect event names', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<(s: string) => void>(),
      logout: new MiniSignal<(s: string) => void>(),
    });

    expect(() => {
      expectError(
        emitter.on('signout', (reason) => {
          expectType<string>(reason);
        })
      );
      expectError(emitter.emit('signout', 'user123'));
    }).toThrow();
  });

  it('should show TS error on incorrect event names (symbols)', () => {
    const LOGIN = Symbol('login');
    const LOGOUT = Symbol('logout');

    const emitter = new MiniSignalEmitter({
      [LOGIN]: new MiniSignal<(s: string) => void>(),
      [LOGOUT]: new MiniSignal<(s: string) => void>(),
    });

    const SIGNOUT = Symbol('signout');

    expect(() => {
      expectError(
        emitter.on(SIGNOUT, (reason) => {
          expectType<string>(reason);
        })
      );
      expectError(emitter.emit(SIGNOUT, 'user123'));
    }).toThrow();
  });

  it('should show TS error on removing listener with incorrect event name', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<(s: string) => void>(),
      logout: new MiniSignal<(s: string) => void>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });
    expect(() => {
      expectError(emitter.removeListener('signout', offLogin));
    }).toThrow();
  });

  it('should show TS error on removing listener with incorrect event name (symbols)', () => {
    const LOGIN = Symbol('login');
    const LOGOUT = Symbol('logout');

    const emitter = new MiniSignalEmitter({
      [LOGIN]: new MiniSignal<(s: string) => void>(),
      [LOGOUT]: new MiniSignal<(s: string) => void>(),
    });
    const offLogin = emitter.on(LOGIN, (userId) => {
      expectType<string>(userId);
    });
    const SIGNOUT = Symbol('signout');
    expect(() => {
      expectError(emitter.removeListener(SIGNOUT, offLogin));
    }).toThrow();
  });

  it('should show TS error on incorrect listener type when removing', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<(s: string) => void>(),
      logout: new MiniSignal<(s: string) => void>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });

    const offLogout = emitter.on('logout', (userId) => {
      expectType<string>(userId);
    });

    expect(() => {
      expectError(emitter.removeListener('login', offLogout));
    }).toThrow();
  });

  it('should show TS error on sync/async dispatch mismatch', () => {
    const emitter = new MiniSignalEmitter({
      syncEvent: new MiniSignal<(s: string) => void>(),
      asyncEvent: new MiniSignal<(s: string) => Promise<void>>(),
    });

    expectError(emitter.emit('asyncEvent', 'test'));
    expectError(emitter.emitParallel('syncEvent', 'test'));
    expectError(emitter.emitSerial('syncEvent', 'test'));
  });

  it('should not show TS error on untyped signals', () => {
    const emitter = new MiniSignalEmitter({
      syncEvent: new MiniSignal(),
      asyncEvent: new MiniSignal(),
    });

    emitter.emit('asyncEvent', 'test');
    emitter.emitParallel('syncEvent', 'test');
    emitter.emitSerial('syncEvent', 'test');
  });
});
