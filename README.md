# mini-signals

signals, in JavaScript, fast

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for TypeScript/JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)). However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)). `mini-signals` is a fast, minimal emitter, with an API similar to [js-signals](https://github.com/millermedeiros/js-signals).

> Note: Signals here are the type defined by Miller Medeiros in [js-signals](https://github.com/millermedeiros/js-signals) inspired by AS3-Signals.  They should not to be confused with [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) or [Angular signals](https://github.com/angular/angular/discussions/49090).

## mini-signals 2.0.0

MiniSignals v2.0.0 has been rewritten in TypeScript and had it's API changed to improve performance and add type safety.

New features:

- `.add` now returns a node reference which can be used to remove the listener directly from the signal.  Reduces memory leaks.
- `.add` is now type safe.  The type of the listener is checked against the type variable in the constructor as well as an optional "flavor".

Breaking changes:

- `.add` now returns a node reference instead of an object.  The returned node cannot be removed directly; it must be from the signal using `MiniSignal#detach`.
- `.once` has been removed.  Use `.add` instead with a call to `.detach` in the callback.
- The `thisArg` parameter has been removed from `.add`.  Use `.add` with a call to `.bind` or (preferred) use an arrow function with a closure.
- `.dispatch` now throws an error if the signal is already dispatching.
`.detach` now throws an error if the node reference was not generated from the signal.

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
  updated: new MiniSignal<never>() // in this case the type variable is never, since we are not passing any parameters
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
