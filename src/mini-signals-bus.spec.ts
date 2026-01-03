import { vi, describe, it, expect, beforeEach } from 'vitest';

import { MiniSignalEmitter } from './mini-signals-bus';
import { MiniSignal } from './mini-signals';
import type { EventHandler } from './shared-types';

type TestEvents = {
  'user:login': [userId: string, timestamp: number];
  'user:logout': [userId: string];
  'data:update': [id: string, value: any];
  'no-args': [];
};

const LOGIN = Symbol('login');
const LOGOUT = Symbol('logout');

type SymbolEvents = {
  [LOGIN]: [userId: string];
  [LOGOUT]: [reason: string];
};

describe('MiniSignalEmitter', () => {
  describe('constructor', () => {
    it('should create an emitter with provided signals', () => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };

      const emitter = new MiniSignalEmitter<TestEvents>(signals);
      expect(emitter).toBeDefined();
    });

    it('should create a shallow copy of the signals map', () => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };

      const emitter = new MiniSignalEmitter<TestEvents>(signals);
      
      // Mutating the original shouldn't affect the emitter
      const newSignal = new MiniSignal<[string, number]>();
      signals['user:login'] = newSignal;

      const handler = vi.fn();
      emitter.on('user:login', handler);
      emitter.emit('user:login', 'user123', Date.now());

      expect(handler).toHaveBeenCalled();
    });

    it('should handle symbol keys', () => {
      const signals = {
        [LOGIN]: new MiniSignal<[string]>(),
        [LOGOUT]: new MiniSignal<[string]>(),
      };

      const emitter = new MiniSignalEmitter<SymbolEvents>(signals);
      const handler = vi.fn();

      emitter.on(LOGIN, handler);
      emitter.emit(LOGIN, 'user123');

      expect(handler).toHaveBeenCalledWith('user123');
    });
  });

  describe('on', () => {
    let emitter: MiniSignalEmitter<TestEvents>;
    let signals: Record<keyof TestEvents, MiniSignal<any>>;

    beforeEach(() => {
      signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should register a listener', () => {
      const handler = vi.fn();
      emitter.on('user:login', handler);
      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should allow multiple listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on('user:login', handler1);
      emitter.on('user:login', handler2);
      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler1).toHaveBeenCalledWith('user123', 1234567890);
      expect(handler2).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should return a cleanup function', () => {
      const handler = vi.fn();
      const cleanup = emitter.on('user:login', handler);

      emitter.emit('user:login', 'user123', 1234567890);
      expect(handler).toHaveBeenCalledTimes(1);

      cleanup();
      emitter.emit('user:login', 'user456', 9876543210);
      expect(handler).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle events with no arguments', () => {
      const handler = vi.fn();
      emitter.on('no-args', handler);
      emitter.emit('no-args');

      expect(handler).toHaveBeenCalledWith();
    });

    it('should throw for missing signal', () => {
      const emptyEmitter = new MiniSignalEmitter<TestEvents>({
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      });

      // TypeScript won't let us pass wrong keys, but at runtime:
      expect(() => {
        (emitter as any).on('invalid-event', vi.fn());
      }).toThrow("Signal for event 'invalid-event' not found");
    });

    it('should support async handlers', async () => {
      const handler = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return userId;
      });

      emitter.on('user:logout', handler as unknown as EventHandler<[userId: string]>);
      emitter.emit('user:logout', 'user123');

      expect(handler).toHaveBeenCalledWith('user123');
    });
  });

  describe('once', () => {
    let emitter: MiniSignalEmitter<TestEvents>;

    beforeEach(() => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should only fire the handler once', () => {
      const handler = vi.fn();
      emitter.once('user:login', handler);

      emitter.emit('user:login', 'user123', 1234567890);
      emitter.emit('user:login', 'user456', 9876543210);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should return a cleanup function', () => {
      const handler = vi.fn();
      const cleanup = emitter.once('user:login', handler);

      cleanup(); // Remove before it fires
      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should work with multiple once handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.once('user:login', handler1);
      emitter.once('user:login', handler2);

      emitter.emit('user:login', 'user123', 1234567890);
      emitter.emit('user:login', 'user456', 9876543210);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should throw for missing signal', () => {
      expect(() => {
        (emitter as any).once('invalid-event', vi.fn());
      }).toThrow("Signal for event 'invalid-event' not found");
    });
  });

  describe('emit', () => {
    let emitter: MiniSignalEmitter<TestEvents>;

    beforeEach(() => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should emit events with correct arguments', () => {
      const handler = vi.fn();
      emitter.on('user:login', handler);
      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should return true when dispatch succeeds', () => {
      const handler = vi.fn();
      emitter.on('user:login', handler);
      
      const result = emitter.emit('user:login', 'user123', 1234567890);
      expect(result).toBe(true);
    });

    it('should emit to all registered listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      emitter.on('user:login', handler1);
      emitter.on('user:login', handler2);
      emitter.on('user:login', handler3);

      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler1).toHaveBeenCalledWith('user123', 1234567890);
      expect(handler2).toHaveBeenCalledWith('user123', 1234567890);
      expect(handler3).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should throw for missing signal', () => {
      expect(() => {
        (emitter as any).emit('invalid-event', 'data');
      }).toThrow("Signal for event 'invalid-event' not found");
    });

    it('should work with events that have no arguments', () => {
      const handler = vi.fn();
      emitter.on('no-args', handler);
      emitter.emit('no-args');

      expect(handler).toHaveBeenCalledWith();
    });
  });

  describe('emitSerial', () => {
    let emitter: MiniSignalEmitter<TestEvents>;

    beforeEach(() => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should emit events and wait for async handlers to complete', async () => {
      const results: number[] = [];
      
      const handler1 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        results.push(1);
      });
      
      const handler2 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 30));
        results.push(2);
      });

      emitter.on('user:logout', handler1);
      emitter.on('user:logout', handler2);

      await emitter.emitSerial('user:logout', 'user123');

      expect(handler1).toHaveBeenCalledWith('user123');
      expect(handler2).toHaveBeenCalledWith('user123');
      expect(results).toEqual([1, 2]); // Serial execution order
    });

    it('should execute handlers in serial order', async () => {
      const executionOrder: string[] = [];
      
      const handler1 = vi.fn(async () => {
        executionOrder.push('start-1');
        await new Promise(resolve => setTimeout(resolve, 50));
        executionOrder.push('end-1');
      });
      
      const handler2 = vi.fn(async () => {
        executionOrder.push('start-2');
        await new Promise(resolve => setTimeout(resolve, 30));
        executionOrder.push('end-2');
      });

      emitter.on('no-args', handler1);
      emitter.on('no-args', handler2);

      await emitter.emitSerial('no-args');

      // Handler 1 should complete before handler 2 starts
      expect(executionOrder).toEqual(['start-1', 'end-1', 'start-2', 'end-2']);
    });

    it('should handle sync handlers in emitSerial', async () => {
      const handler1 = vi.fn((userId: string) => {
        return 'sync';
      });
      
      const handler2 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async';
      });

      emitter.on('user:logout', handler1);
      emitter.on('user:logout', handler2);

      await emitter.emitSerial('user:logout', 'user123');

      expect(handler1).toHaveBeenCalledWith('user123');
      expect(handler2).toHaveBeenCalledWith('user123');
    });

    it('should throw for missing signal', async () => {
      await expect(async () => {
        await (emitter as any).emitSerial('invalid-event', 'data');
      }).rejects.toThrow("Signal for event 'invalid-event' not found");
    });

    it('should propagate errors from handlers', async () => {
      const handler = vi.fn(async () => {
        throw new Error('Handler error');
      });

      emitter.on('no-args', handler);

      await expect(async () => {
        await emitter.emitSerial('no-args');
      }).rejects.toThrow('Handler error');
    });
  });

  describe('emitParallel', () => {
    let emitter: MiniSignalEmitter<TestEvents>;

    beforeEach(() => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should emit events and wait for all async handlers to complete', async () => {
      const results: number[] = [];
      
      const handler1 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        results.push(1);
      });
      
      const handler2 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 30));
        results.push(2);
      });

      emitter.on('user:logout', handler1);
      emitter.on('user:logout', handler2);

      await emitter.emitParallel('user:logout', 'user123');

      expect(handler1).toHaveBeenCalledWith('user123');
      expect(handler2).toHaveBeenCalledWith('user123');
      expect(results).toHaveLength(2);
      expect(results).toContain(1);
      expect(results).toContain(2);
    });

    it('should execute handlers in parallel', async () => {
      const executionOrder: string[] = [];
      
      const handler1 = vi.fn(async () => {
        executionOrder.push('start-1');
        await new Promise(resolve => setTimeout(resolve, 50));
        executionOrder.push('end-1');
      });
      
      const handler2 = vi.fn(async () => {
        executionOrder.push('start-2');
        await new Promise(resolve => setTimeout(resolve, 30));
        executionOrder.push('end-2');
      });

      emitter.on('no-args', handler1);
      emitter.on('no-args', handler2);

      await emitter.emitParallel('no-args');

      // Both handlers should start before either completes
      expect(executionOrder[0]).toBe('start-1');
      expect(executionOrder[1]).toBe('start-2');
      // Handler 2 should finish before handler 1 (shorter timeout)
      expect(executionOrder[2]).toBe('end-2');
      expect(executionOrder[3]).toBe('end-1');
    });

    it('should be faster than serial execution', async () => {
      const handler1 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });
      
      const handler2 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      emitter.on('no-args', handler1);
      emitter.on('no-args', handler2);

      const parallelStart = Date.now();
      await emitter.emitParallel('no-args');
      const parallelTime = Date.now() - parallelStart;

      // Parallel should take ~50ms, serial would take ~100ms
      expect(parallelTime).toBeLessThan(80);
    });

    it('should handle sync handlers in emitParallel', async () => {
      const handler1 = vi.fn((userId: string) => {
        return 'sync';
      });
      
      const handler2 = vi.fn(async (userId: string) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async';
      });

      emitter.on('user:logout', handler1);
      emitter.on('user:logout', handler2);

      await emitter.emitParallel('user:logout', 'user123');

      expect(handler1).toHaveBeenCalledWith('user123');
      expect(handler2).toHaveBeenCalledWith('user123');
    });

    it('should throw for missing signal', async () => {
      await expect(async () => {
        await (emitter as any).emitParallel('invalid-event', 'data');
      }).rejects.toThrow("Signal for event 'invalid-event' not found");
    });

    it('should propagate errors from handlers', async () => {
      const handler1 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const handler2 = vi.fn(async () => {
        throw new Error('Handler error');
      });

      emitter.on('no-args', handler1);
      emitter.on('no-args', handler2);

      await expect(async () => {
        await emitter.emitParallel('no-args');
      }).rejects.toThrow('Handler error');
    });
  });

  describe('clear', () => {
    let emitter: MiniSignalEmitter<TestEvents>;

    beforeEach(() => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      emitter = new MiniSignalEmitter<TestEvents>(signals);
    });

    it('should clear listeners for a specific event', () => {
      const loginHandler = vi.fn();
      const logoutHandler = vi.fn();

      emitter.on('user:login', loginHandler);
      emitter.on('user:logout', logoutHandler);

      emitter.clear('user:login');

      emitter.emit('user:login', 'user123', 1234567890);
      emitter.emit('user:logout', 'user123');

      expect(loginHandler).not.toHaveBeenCalled();
      expect(logoutHandler).toHaveBeenCalledWith('user123');
    });

    it('should clear all listeners when no event specified', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      emitter.on('user:login', handler1);
      emitter.on('user:logout', handler2);
      emitter.on('data:update', handler3);

      emitter.clear();

      emitter.emit('user:login', 'user123', 1234567890);
      emitter.emit('user:logout', 'user123');
      emitter.emit('data:update', 'id123', 'value');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).not.toHaveBeenCalled();
    });

    it('should clear symbol event listeners', () => {
      const signals = {
        [LOGIN]: new MiniSignal<[string]>(),
        [LOGOUT]: new MiniSignal<[string]>(),
      };
      const symbolEmitter = new MiniSignalEmitter<SymbolEvents>(signals);

      const handler = vi.fn();
      symbolEmitter.on(LOGIN, handler);
      symbolEmitter.clear(LOGIN);
      symbolEmitter.emit(LOGIN, 'user123');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should throw for missing signal when clearing specific event', () => {
      expect(() => {
        (emitter as any).clear('invalid-event');
      }).toThrow("Signal for event 'invalid-event' not found");
    });

    it('should allow re-registering after clear', () => {
      const handler = vi.fn();
      emitter.on('user:login', handler);
      emitter.clear('user:login');

      const newHandler = vi.fn();
      emitter.on('user:login', newHandler);
      emitter.emit('user:login', 'user123', 1234567890);

      expect(handler).not.toHaveBeenCalled();
      expect(newHandler).toHaveBeenCalledWith('user123', 1234567890);
    });
  });

  describe('shared signals between emitters', () => {
    it('should allow multiple emitters to share the same signals', () => {
      const sharedSignals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };

      const emitter1 = new MiniSignalEmitter<TestEvents>(sharedSignals);
      const emitter2 = new MiniSignalEmitter<TestEvents>(sharedSignals);

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter1.on('user:login', handler1);
      emitter2.on('user:login', handler2);

      // Emitting from emitter1 should trigger both handlers
      emitter1.emit('user:login', 'user123', 1234567890);

      expect(handler1).toHaveBeenCalledWith('user123', 1234567890);
      expect(handler2).toHaveBeenCalledWith('user123', 1234567890);
    });

    it('should work with emitSerial on shared signals', async () => {
      const sharedSignals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };

      const emitter1 = new MiniSignalEmitter<TestEvents>(sharedSignals);
      const emitter2 = new MiniSignalEmitter<TestEvents>(sharedSignals);

      const handler1 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const handler2 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      emitter1.on('no-args', handler1);
      emitter2.on('no-args', handler2);

      await emitter1.emitSerial('no-args');

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should work with emitParallel on shared signals', async () => {
      const sharedSignals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };

      const emitter1 = new MiniSignalEmitter<TestEvents>(sharedSignals);
      const emitter2 = new MiniSignalEmitter<TestEvents>(sharedSignals);

      const handler1 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const handler2 = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      emitter1.on('no-args', handler1);
      emitter2.on('no-args', handler2);

      await emitter1.emitParallel('no-args');

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('type safety', () => {
    it('should enforce correct argument types at compile time', () => {
      const signals = {
        'user:login': new MiniSignal<[string, number]>(),
        'user:logout': new MiniSignal<[string]>(),
        'data:update': new MiniSignal<[string, any]>(),
        'no-args': new MiniSignal<[]>(),
      };
      const emitter = new MiniSignalEmitter<TestEvents>(signals);

      // These should compile
      emitter.on('user:login', (userId, timestamp) => {
        const _userId: string = userId;
        const _timestamp: number = timestamp;
      });

      emitter.emit('user:login', 'user123', 1234567890);

      // TypeScript would catch these at compile time:
      // emitter.emit('user:login', 123, 'wrong'); // Error
      // emitter.emit('user:login', 'user123'); // Error: missing argument
      // emitter.on('invalid', () => {}); // Error: invalid event name
    });
  });
});