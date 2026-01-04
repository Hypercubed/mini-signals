[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals](../README.md) / MiniSignal

# Class: MiniSignal\<T, S\>

Defined in: [mini-signals.ts:18](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L18)

## Type Parameters

### T

`T` *extends* `any`[] = `any`[]

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

> **add**(`fn`): `MiniSignalBinding`\<`T`, `S`\>

Defined in: [mini-signals.ts:39](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L39)

Register a new listener.

#### Parameters

##### fn

`EventHandler`\<`T`\>

#### Returns

`MiniSignalBinding`\<`T`, `S`\>

***

### detach()

> **detach**(`sym`): `this`

Defined in: [mini-signals.ts:142](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L142)

Remove binding object.

#### Parameters

##### sym

`MiniSignalBinding`\<`T`, `S`\>

#### Returns

`this`

***

### detachAll()

> **detachAll**(): `this`

Defined in: [mini-signals.ts:169](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L169)

Detach all listeners.

#### Returns

`this`

***

### dispatch()

> **dispatch**(...`args`): `boolean`

Defined in: [mini-signals.ts:49](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L49)

Dispatches a signal to all registered listeners.

#### Parameters

##### args

...`T`

#### Returns

`boolean`

***

### dispatchParallel()

> **dispatchParallel**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:102](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L102)

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

Defined in: [mini-signals.ts:74](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L74)

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

Defined in: [mini-signals.ts:32](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals.ts#L32)

Check if there are any listeners attached.

#### Returns

`boolean`
