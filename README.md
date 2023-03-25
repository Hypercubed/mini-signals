# mini-signals

signals, in JavaScript, fast

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for TypeScript/JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)). However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)). `mini-signals` is a fast, minimal emitter, with an API similar to [js-signals](https://github.com/millermedeiros/js-signals).

> Note: Signals here are the type defined by [js-signals](https://github.com/millermedeiros/js-signals) inspired by AS3-Signals.  They should not to be confused with [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) or Angular signals.

## Install

### npm:

```sh
npm install mini-signals
```

## Example Usage

```ts
import { MiniSignal } from "mini-signals";

const mySignal = new MiniSignal<[string, string]>();

const binding = mySignal.add(onSignal); //add listener

mySignal.dispatch("foo", "bar"); // dispatch signal passing custom parameters
binding.detach(); // remove a single listener

function onSignal(foo: string, bar: string) {
  assert(foo === "foo");
  assert(bar === "bar");
}
```

## Another Example

```ts
const myObject = {
  foo: "bar",
  updated: new MiniSignal<never>(),
};

myObject.updated.add(onUpdated, myObject); //add listener with context

myObject.foo = "baz";
myObject.updated.dispatch(); //dispatch signal

function onUpdated() {
  assert(this === myObject);
  assert(this.foo === "baz");
}
```

## API

See [API.md](https://github.com/Hypercubed/mini-signals/blob/master/API.md)

## License

Copyright (c) 2015-2023 Jayson Harshbarger

MIT License
