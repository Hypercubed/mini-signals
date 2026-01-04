[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals](../README.md) / MiniSignal

# Class: MiniSignal\<T, S\>

Defined in: [mini-signals.ts:26](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L26)

## Type Parameters

### T

`T` *extends* `EventHandler`\<`any`[]\> = `EventHandler`\<`any`[]\>

### S

`S` = `symbol` \| `string`

## Documents

- [mini-signal](documents/mini-signal.md)

## Constructors

### Constructor

> **new MiniSignal**\<`T`, `S`\>(): `MiniSignal`\<`T`, `S`\>

#### Returns

`MiniSignal`\<`T`, `S`\>

## Methods

### add()

> **add**(`fn`): [`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

Defined in: [mini-signals.ts:50](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L50)

Register a new listener.

#### Parameters

##### fn

`T`

#### Returns

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

***

### detach()

> **detach**(`sym`): `this`

Defined in: [mini-signals.ts:155](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L155)

Remove binding object.

#### Parameters

##### sym

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

#### Returns

`this`

***

### detachAll()

> **detachAll**(): `this`

Defined in: [mini-signals.ts:182](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L182)

Detach all listeners.

#### Returns

`this`

***

### dispatch()

> **dispatch**(...`args`): `boolean`

Defined in: [mini-signals.ts:60](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L60)

Dispatches a signal to all registered listeners.

#### Parameters

##### args

...`OnlySync`\<`T`, `Parameters`\<`T`\>\>

#### Returns

`boolean`

***

### dispatchParallel()

> **dispatchParallel**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:113](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L113)

Dispatches listeners in parallel, waiting for all to complete if they return Promises.
Returns a Promise that resolves to true if listeners were called, false otherwise.

#### Parameters

##### args

...`OnlyAsync`\<`T`, `Parameters`\<`T`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### dispatchSerial()

> **dispatchSerial**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:85](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L85)

Dispatches listeners serially, waiting for each to complete if they return a Promise.
Returns a Promise that resolves to true if listeners were called, false otherwise.

#### Parameters

##### args

...`OnlyAsync`\<`T`, `Parameters`\<`T`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### hasListeners()

> **hasListeners**(): `boolean`

Defined in: [mini-signals.ts:43](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals.ts#L43)

Check if there are any listeners attached.

#### Returns

`boolean`
