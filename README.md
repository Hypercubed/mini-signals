# mini-signals

signals, in TypeScript, strongly typed, fast

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for TypeScript/JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)). However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)). `mini-signals` is a fast, minimal emitter, with an API similar to [js-signals](https://github.com/millermedeiros/js-signals).

> Note: Signals here are the type defined by Miller Medeiros in [js-signals](https://github.com/millermedeiros/js-signals) inspired by AS3-Signals.  They should not to be confused with [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) or [Angular signals](https://github.com/angular/angular/discussions/49090).

## mini-signals 3.0.0

Breaking Changes:

`MiniSignal<T>` type argument `T` must now be a function type representing the listener signature. For example, use `MiniSignal<(arg1: string, arg2: number) => void>` instead of `MiniSignal<[string, number]>`.  If you prefer the previous syntax, you can use the `syncSignal` and `asyncSignal` utility functions to create signals with the old syntax.

> Why? This change allows for better type inference and compatibility with functions that return Promises, enabling the new dispatch methods.

New features:

- `MiniSignalEmitter` class to manage multiple named signals.
- `.dispatchSerial` - Dispatches listeners serially, waiting for each to complete if they return a Promise.
- `.dispatchParallel` - Dispatches listeners in parallel, waiting for all to complete if they return Promises.
- `syncSignal` and `asyncSignal` utility functions to create MiniSignals with the previous syntax.

## Install

### npm:

```sh
npm install mini-signals
```

## Examples

### Basic Usage

```typescript
import { syncSignal } from 'mini-signals';

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
```

### Basic Async Usage

```typescript
import { asyncSignal } from 'mini-signals';

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
```

### Basic Usage with MiniSignal constructor

```typescript
import { MiniSignal } from 'mini-signals';

// Define a mini-signal
// The optional type argument specifies the listener parameter types
const mySignal = new MiniSignal<(x: string, y: string) => void>();

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
```

See [MiniSignal Documentation](docs/mini-signals/classes/documents/mini-signal.md) for more examples.

### MiniSignalEmitter Usage

```typescript
import { MiniSignal } from 'mini-signals';
import { MiniSignalEmitter, type SignalMap } from './mini-signal-emitter';

// Create signals
const signals = {
  'user:login': new MiniSignal<(string, number) => void>(),
  'user:logout': new MiniSignal<(string, number) => void>(),
  'data:update': new MiniSignal<() => Promise<void>>(),
} as const;

// Create emitter (type is inferred!)
const emitter = new MiniSignalEmitter(signals);

// Listen to events
const cleanup = emitter.on('user:login', (userId, timestamp) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// Emit events
emitter.emit('user:login', 'user123', Date.now());

// Emit async event
await emitter.emitParallel('data:update');

// Cleanup
cleanup();
```

## API

See [API.md](https://github.com/Hypercubed/mini-signals/blob/master/docs/classes/MiniSignal.md)

## License

Copyright (c) 2015-2023 Jayson Harshbarger

MIT License
