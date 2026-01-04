import { vi, describe, it, expect, beforeEach, assert } from 'vitest';
import { createSignalMap } from '../mini-signals-utils.ts';

describe('createSignalMap', () => {
  it('should create a signal map for given events', () => {
    type MyEvents = {
      eventA: [string];
      eventB: [number, boolean];
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
