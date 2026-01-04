[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals](../README.md) / MiniSignal

# Class: MiniSignal\<T, S\>

Defined in: [mini-signals.ts:23](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L23)

## Type Parameters

### T

`T` *extends* `EventHandler`\<`any`[]\> = `EventHandler`\<`any`[]\>

### S

`S` = `symbol` \| `string`

## Constructors

### Constructor

> **new MiniSignal**\<`T`, `S`\>(): `MiniSignal`\<`T`, `S`\>

#### Returns

`MiniSignal`\<`T`, `S`\>

## Methods

### add()

> **add**(`fn`): [`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

Defined in: [mini-signals.ts:47](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L47)

Register a new listener.

#### Parameters

##### fn

`T`

#### Returns

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

***

### detach()

> **detach**(`sym`): `this`

Defined in: [mini-signals.ts:152](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L152)

Remove binding object.

#### Parameters

##### sym

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

#### Returns

`this`

***

### detachAll()

> **detachAll**(): `this`

Defined in: [mini-signals.ts:179](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L179)

Detach all listeners.

#### Returns

`this`

***

### dispatch()

> **dispatch**(...`args`): `boolean`

Defined in: [mini-signals.ts:57](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L57)

Dispatches a signal to all registered listeners.

#### Parameters

##### args

...`OnlySync`\<`T`, `Parameters`\<`T`\>\>

#### Returns

`boolean`

***

### dispatchParallel()

> **dispatchParallel**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:110](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L110)

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

Defined in: [mini-signals.ts:82](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L82)

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

Defined in: [mini-signals.ts:40](https://github.com/Hypercubed/mini-signals/blob/59a7232128e02abfd4d45f3b40b292bdb81023d5/src/mini-signals.ts#L40)

Check if there are any listeners attached.

#### Returns

`boolean`
