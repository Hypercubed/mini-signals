**mini-signals**

***

# mini-signals

signals, in JavaScript, fast

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for TypeScript/JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)). However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)). `mini-signals` is a fast, minimal emitter, with an API similar to [js-signals](https://github.com/millermedeiros/js-signals).

> Note: Signals here are the type defined by Miller Medeiros in [js-signals](https://github.com/millermedeiros/js-signals) inspired by AS3-Signals.  They should not to be confused with [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) or [Angular signals](https://github.com/angular/angular/discussions/49090).

## mini-signals 2.1.0

New features:

- `.dispatchSerial` - Dispatches listeners serially, waiting for each to complete if they return a Promise.
- `.dispatchParallel` - Dispatches listeners in parallel, waiting for all to complete if they return Promises.

## Install

### npm:

```sh
npm install mini-signals
```

## Examples

```ts
import { MiniSignal } from 'mini-signals';

const mySignal = new MiniSignal<[string, string]>();  // the type variable optionally and defines the parameters to be dispatched

const binding = mySignal.add((foo: string, bar: string) => { // add listener, note the parameter types match the type variable in the constructor
  console.log('signal dispatched');
  assert(foo === 'foo');
  assert(bar === 'bar');
});

mySignal.dispatch('foo', 'bar'); // dispatch signal passing custom parameters
mySignal.detach(binding); // remove a single listener
```

### Another Example

```ts
const myObject = {
  foo: "bar",
  updated: new MiniSignal<[]>(); // in this case the type variable is empty, since we are not passing any parameters
};

myObject.updated.add(() => {
  console.log('signal dispatched');
  assert(myObject.foo === 'baz');
});

myObject.foo = 'baz';
myObject.updated.dispatch(); // dispatch signal
```

### Flavoring the signal

```ts
import { MiniSignal } from 'mini-signals';

const mySignal = new MiniSignal<[string, string], 'mySignal'>();
const myOtherSignal = new MiniSignal<[string, string], 'myOtherSignal'>();

const binding = mySignal.add((foo: string, bar: string) => {
  // ...
});

myOtherSignal.detach(binding); // TypeScript error: Argument of type 'MiniSignalBinding<[string, string], "mySignal">' is not assignable to parameter of type 'MiniSignalBinding<[string, string], "myOtherSignal">'.
```

## API

See [API.md](https://github.com/Hypercubed/mini-signals/blob/master/docs/classes/MiniSignal.md)

## License

Copyright (c) 2015-2023 Jayson Harshbarger

MIT License
