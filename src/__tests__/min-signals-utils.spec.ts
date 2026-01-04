import { vi, describe, it, expect, beforeEach, assert } from 'vitest';
import {
  asyncSignal,
  createSignalMap,
  syncSignal,
} from '../mini-signals-utils.ts';

describe('syncSignal/asyncSignal', () => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);

  it('should run readme syncSignal example', () => {
    // Define a mini-signal
    // The optional type argument specifies the listener parameter types
    const mySignal = syncSignal<[string, string]>();

    // Add a listener
    // The listener parameter types must match the type argument specified in the MiniSignal constructor
    // The returned binding can be used to remove the listener later
    const binding = mySignal.add((foo: string, bar: string) => {
      console.log('signal dispatched');
      assert(foo === 'foo');
      assert(bar === 'bar');
    });

    // Dispatch the signal, passing parameters to the listeners
    mySignal.dispatch('foo', 'bar');

    // Remove the listener using the binding
    mySignal.detach(binding);
  });

  it('should run readme asyncSignal example', async () => {
    const somethingAsync = async (): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, 10));
    };

    // Define a mini-signal
    // The optional type argument specifies the listener parameter types
    const mySignal = asyncSignal<[string, string]>();

    // Add a listener
    // The listener parameter types must match the type argument specified in the MiniSignal constructor
    // The returned binding can be used to remove the listener later
    const binding = mySignal.add(async (foo: string, bar: string) => {
      await somethingAsync();
      console.log('signal dispatched');
      assert(foo === 'foo');
      assert(bar === 'bar');
    });

    // Dispatch the signal, passing parameters to each listener in series
    // Wait for all listeners to complete
    await mySignal.dispatchSerial('foo', 'bar');

    // Dispatch the signal, passing parameters to each listener in parallel
    // Wait for all listeners to complete
    await mySignal.dispatchParallel('foo', 'bar');

    // Remove the listener using the binding
    mySignal.detach(binding);
  });

  it('should create a sync signal', () => {
    const signal = syncSignal<[number, string]>();
    let callCount = 0;
    signal.add((num: number, str: string) => {
      callCount++;
      expect(num).toBe(42);
      expect(str).toBe('hello');
    });
    signal.dispatch(42, 'hello');
    expect(callCount).toBe(1);
  });

  it('should create an async signal', async () => {
    const signal = asyncSignal<[number, string]>();
    let callCount = 0;
    signal.add(async (num: number, str: string) => {
      callCount++;
      expect(num).toBe(7);
      expect(str).toBe('world');
    });
    await signal.dispatchSerial(7, 'world');
    expect(callCount).toBe(1);
  });
});

describe('createSignalMap', () => {
  it('should create a signal map for given events', () => {
    type MyEvents = {
      eventA: (data: string) => void;
      eventB: (num: number, flag: boolean) => void;
    };

    const signalMap = createSignalMap<MyEvents>(['eventA', 'eventB']);
    expect(signalMap).toHaveProperty('eventA');
    expect(signalMap).toHaveProperty('eventB');

    let eventACalled = false;
    let eventBCalled = false;

    signalMap.eventA.add((data: string) => {
      eventACalled = true;
      expect(data).toBe('test');
    });

    signalMap.eventB.add((num: number, flag: boolean) => {
      eventBCalled = true;
      expect(num).toBe(10);
      expect(flag).toBe(true);
    });

    signalMap.eventA.dispatch('test');
    signalMap.eventB.dispatch(10, true);

    expect(eventACalled).toBe(true);
    expect(eventBCalled).toBe(true);
  });
});
