[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals](../README.md) / MiniSignal

# Class: MiniSignal\<T, S\>

Defined in: [mini-signals.ts:15](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L15)

## Type Parameters

### T

`T` *extends* `any`[] = `any`[]

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

Defined in: [mini-signals.ts:36](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L36)

Register a new listener.

#### Parameters

##### fn

`EventHandler`\<`T`\>

#### Returns

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

***

### detach()

> **detach**(`sym`): `this`

Defined in: [mini-signals.ts:139](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L139)

Remove binding object.

#### Parameters

##### sym

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`T`, `S`\>

#### Returns

`this`

***

### detachAll()

> **detachAll**(): `this`

Defined in: [mini-signals.ts:166](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L166)

Detach all listeners.

#### Returns

`this`

***

### dispatch()

> **dispatch**(...`args`): `boolean`

Defined in: [mini-signals.ts:46](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L46)

Dispatches a signal to all registered listeners.

#### Parameters

##### args

...`T`

#### Returns

`boolean`

***

### dispatchParallel()

> **dispatchParallel**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:99](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L99)

Dispatches listeners in parallel, waiting for all to complete if they return Promises.
Returns a Promise that resolves to true if listeners were called, false otherwise.

#### Parameters

##### args

...`T`

#### Returns

`Promise`\<`boolean`\>

***

### dispatchSerial()

> **dispatchSerial**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:71](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L71)

Dispatches listeners serially, waiting for each to complete if they return a Promise.
Returns a Promise that resolves to true if listeners were called, false otherwise.

#### Parameters

##### args

...`T`

#### Returns

`Promise`\<`boolean`\>

***

### hasListeners()

> **hasListeners**(): `boolean`

Defined in: [mini-signals.ts:29](https://github.com/Hypercubed/mini-signals/blob/bb93e2d9b625c0b069f1644b26c86bf27045ef7d/src/mini-signals.ts#L29)

Check if there are any listeners attached.

#### Returns

`boolean`
