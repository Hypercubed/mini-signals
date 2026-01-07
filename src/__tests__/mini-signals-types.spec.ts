import { expectError, expectType } from 'tsd';
import { describe, expect, it } from 'vitest';

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

    expect(() => {
      expectError(e1.detach(l2));
    }).toThrow();

    expectType<boolean>(e1.dispatch('foo'));
  });

  it('should show TS error on incorrect branded types using flavors', () => {
    const e1 = new MiniSignal<[string], 'e1'>();
    const e2 = new MiniSignal<[string], 'e2'>();

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

    const e1 = new MiniSignal<[string], typeof e1s>();
    const e2 = new MiniSignal<[string], typeof e2s>();

    const l1 = e1.add(expectType<string>);
    const l2 = e2.add(expectType<string>);

    expectType<typeof e1>(e1.detach(l1));

    expect(() => {
      expectError(e1.detach(l2));
    }).toThrow();

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

    emitter.off('login', offLogin);
    emitter.off('logout', offLogout);
  });

  it('has correct types when using generic event map', () => {
    type Events = {
      login: [string];
      logout: [string];
      error: [Error, number];
    };

    const emitter = new MiniSignalEmitter<Events>({
      login: new MiniSignal(),
      logout: new MiniSignal(),
      error: new MiniSignal(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });
    const offLogout = emitter.once('logout', (reason) => {
      expectType<string>(reason);
    });
    const offError = emitter.on('error', (err, code) => {
      expectType<Error>(err);
      expectType<number>(code);
    });

    expectType<boolean>(emitter.emit('login', 'user123'));
    expectType<boolean>(emitter.emit('logout', 'timeout'));
    expectType<boolean>(emitter.emit('error', new Error('fail'), 500));
    emitter.off('login', offLogin);
    emitter.off('logout', offLogout);
    emitter.off('error', offError);
  });

  it('should have the correct types with signals map', () => {
    type SignalsMap = {
      login: MiniSignal<[string]>;
      logout: MiniSignal<[string]>;
    };

    const emitter = new MiniSignalEmitter<SignalsMap>({
      login: new MiniSignal(),
      logout: new MiniSignal(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });
    const offLogout = emitter.once('logout', (reason) => {
      expectType<string>(reason);
    });

    expectType<boolean>(emitter.emit('login', 'user123'));
    expectType<boolean>(emitter.emit('logout', 'timeout'));

    emitter.off('login', offLogin);
    emitter.off('logout', offLogout);
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

    emitter.off(LOGIN, offLogin);
    emitter.off(LOGOUT, offLogout);
  });

  it('should show TS error on incorrect listeners and dispatch', () => {
    const emitter = new MiniSignalEmitter({
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
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
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
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
      [LOGIN]: new MiniSignal<[string]>(),
      [LOGOUT]: new MiniSignal<[string]>(),
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
      login: new MiniSignal<[string]>(),
      logout: new MiniSignal<[string]>(),
    });

    const offLogin = emitter.on('login', (userId) => {
      expectType<string>(userId);
    });
    expect(() => {
      expectError(emitter.off('signout', offLogin));
    }).toThrow();
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
    expect(() => {
      expectError(emitter.off(SIGNOUT, offLogin));
    }).toThrow();
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

    expect(() => {
      expectError(emitter.off('login', offLogout));
    }).toThrow();
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

  it('should show TS error on incorrect listener type when removing', () => {
    const signals = {
      login: new MiniSignal<[string], '__login__'>(),
      logout: new MiniSignal<[string]>(),
    };

    const emitter = new MiniSignalEmitter(signals);

    const offLogin = signals.login.add((userId) => {
      expectType<string>(userId);
    });

    const offLogout = emitter.on('logout', (userId) => {
      expectType<string>(userId);
    });

    emitter.off('login', offLogin);
    emitter.off('logout', offLogout);
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
