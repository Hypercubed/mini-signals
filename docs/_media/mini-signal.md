[**mini-signals**](../../../README.md)

***

[mini-signals](../../../modules.md) / [mini-signals](../../README.md) / [MiniSignal](../MiniSignal.md) / mini-signal

# MiniSignal

signals, in TypeScript, fast

## Basic Usage

```ts
import { MiniSignal } from 'mini-signals';

// Define a mini-signal
// The optional type argument specifies the listener parameter types
const mySignal = new MiniSignal<(string, string) => void>();

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

## Adding MiniSignal to Objects

```ts
const myObject = {
  foo: "bar",
  updated: new MiniSignal<() => void>();
};

myObject.updated.add(() => {
  console.log('signal dispatched');
  assert(myObject.foo === 'baz');
});

myObject.foo = 'baz';
myObject.updated.dispatch(); // dispatch signal
```

## Flavoring the signal

Flavoring (or branding) a signal ensures that only bindings created by that specific signal can be used to detach listeners from it. This prevents accidentally attempting to detach a binding from a different signal; which would result in a runtime error.

```ts
import { MiniSignal } from 'mini-signals';

const mySignal = new MiniSignal<(string, string) => void, 'mySignal'>();
const myOtherSignal = new MiniSignal<
  (string, string) => void,
  'myOtherSignal'
>();

const binding = mySignal.add((foo: string, bar: string) => {
  // ...
});

myOtherSignal.detach(binding); // TypeScript error: Argument of type 'MiniSignalBinding<(string, string) => void, "mySignal">' is not assignable to parameter of type 'MiniSignalBinding<(string, string) => void, "myOtherSignal">'.
```

## Async Listeners

Listeners can return Promises to indicate asynchronous operations. The `dispatchSerial` and `dispatchParallel` methods will wait for these Promises to resolve before completing.

```ts
const asyncSignal = new MiniSignal<() => Promise<void>>();

asyncSignal.add(async () => {
  await doSomethingAsync();
});

// Dispatch listeners serially
await asyncSignal.dispatchSerial();

// Dispatch listeners in parallel
await asyncSignal.dispatchParallel();
```
