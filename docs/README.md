**mini-signals**

***

# mini-signals

signals, in TypeScript, fast and safe

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for TypeScript/JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)). However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)). `mini-signals` is a fast, minimal emitter, with an API similar to [js-signals](https://github.com/millermedeiros/js-signals).

> Note: Signals here are the type defined by Miller Medeiros in [js-signals](https://github.com/millermedeiros/js-signals) inspired by AS3-Signals.  They should not be confused with [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) or [Angular signals](https://github.com/angular/angular/discussions/49090).

## mini-signals 3.0.0

Breaking Changes:

- Possible breaking change on imports, now exports `index.cjs` and `index.mjs`

New features:

- `MiniSignalEmitter` class to manage multiple named signals.
- `.dispatchSerial` - Dispatches listeners serially, waiting for each to complete if they return a Promise.
- `.dispatchParallel` - Dispatches listeners in parallel, waiting for all to complete if they return Promises.

[See CHANGELOG.md for details.](_media/CHANGELOG.md)

## Install

### npm:

```sh
npm install mini-signals
```

## Usage

MiniSignals (since version 3.0.0) can be used either as a single-channel broadcast system using `MiniSignal`, or as a multi-channel event emitter using `MiniSignalEmitter`.  `MiniSignal` has a slight performance advantage, while multi-channel event emitters provide better organization for many events.  `MiniSignalEmitter` is built on top of `MiniSignal`. `MiniSignalEmitter` API is similar to Node.js `EventEmitter` API and has the convenience that each event is "flavored" with its own `MiniSignal` instance.

> Flavoring (or branding) a signal ensures that only bindings  created by that specific signal (the object returned when adding a listener) can only be used to detach listeners from that signal. This prevents accidentally attempting to detach a binding from a different signal; which would result in a runtime error.

Both `MiniSignal` and `MiniSignalEmitter` support asynchronous listeners that return Promises.  Dispatch methods can be used to wait for all listeners to complete either in series or in parallel.

### MiniSignal Usage

```typescript
import { MiniSignal } from 'mini-signals';

// Define a mini-signal
// The optional type argument specifies the listener parameter types
const mySignal = new MiniSignal<[string, string]>();

// Add a listener
// The listener parameter types must match the type argument specified in the MiniSignal constructor
// The returned binding can be used to remove the listener later
const binding = mySignal.add((foo: string, bar: string) => {
  console.log('signal dispatched');
  expect(foo).toBe('foo');
  expect(bar).toBe('bar');
});

// Dispatch the signal, passing parameters to the listeners
mySignal.dispatch('foo', 'bar');

// Remove the listener using the binding
mySignal.detach(binding);
```

### MiniSignal Async Usage

```typescript
import { MiniSignal } from 'mini-signals';

// Define a mini-signal
// The optional type argument specifies the listener parameter types
const mySignal = new MiniSignal<[string, string]>();

// Add a listener
// The listener parameter types must match the type argument specified in the MiniSignal constructor
// The returned binding can be used to remove the listener later
const binding = mySignal.add(async (foo: string, bar: string) => {
  await doSomethingAsync();
  console.log('signal dispatched');
  expect(foo).toBe('foo');
  expect(bar).toBe('bar');
});

// Dispatch the signal, passing parameters to each listener in series
// Wait for all listeners to complete
await mySignal.dispatchSerial('foo', 'bar');

// Dispatch the signal, passing parameters to each listener in parallel
// Wait for all listeners to complete
await mySignal.dispatchParallel('foo', 'bar');

// Remove the listener using the binding
mySignal.detach(binding);
```

See [MiniSignal Documentation](mini-signals/classes/documents/mini-signal.md) for more examples.

### MiniSignalEmitter Usage

```typescript
import { MiniSignal, MiniSignalEmitter } from 'mini-signals';

// Create emitter
const emitter = new MiniSignalEmitter({
  'user:login': new MiniSignal<[string, number]>(),
  'user:logout': new MiniSignal<[string, number]>(),
  'data:update': new MiniSignal<[]>(),
});

// Listen to events
const cleanup = emitter.on('user:login', (userId, timestamp) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// Emit events
emitter.emit('user:login', 'user123', Date.now());

// Emit async event
await emitter.emitParallel('data:update');

// Cleanup
emitter.off('user:login', cleanup);
```

See [MiniSignal Documentation](mini-signals-emitter/classes/documents/mini-signal-emitter.md) for more examples.

## API

See [API.md](_media/modules.md)

## License

Copyright (c) 2015-2026 Jayson Harshbarger

MIT License
