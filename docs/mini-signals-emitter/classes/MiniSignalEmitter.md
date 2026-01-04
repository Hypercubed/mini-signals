[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals-emitter](../README.md) / MiniSignalEmitter

# Class: MiniSignalEmitter\<T\>

Defined in: [mini-signals-emitter.ts:31](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L31)

## Type Parameters

### T

`T` *extends* [`MiniSignalMap`](../../types/type-aliases/MiniSignalMap.md)\<`any`\>

## Constructors

### Constructor

> **new MiniSignalEmitter**\<`T`\>(`signals`): `MiniSignalEmitter`\<`T`\>

Defined in: [mini-signals-emitter.ts:34](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L34)

#### Parameters

##### signals

`T`

#### Returns

`MiniSignalEmitter`\<`T`\>

## Methods

### clear()

> **clear**\<`K`\>(`event?`): `void`

Defined in: [mini-signals-emitter.ts:115](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L115)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: [mini-signals-emitter.ts:83](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L83)

Emit an event with data

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`OnlySync`\<`T`, `K`\>

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`boolean`

***

### emitParallel()

> **emitParallel**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:91](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L91)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`OnlyAsync`\<`T`, `K`\>

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### emitSerial()

> **emitSerial**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:99](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L99)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`OnlyAsync`\<`T`, `K`\>

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### on()

> **on**\<`K`\>(`event`, `handler`): [`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

Defined in: [mini-signals-emitter.ts:54](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L54)

Register a listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`ExtractHandler`\<`T`, `K`\>

#### Returns

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

***

### once()

> **once**\<`K`\>(`event`, `handler`): [`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

Defined in: [mini-signals-emitter.ts:65](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L65)

Register a one-time listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`ExtractHandler`\<`T`, `K`\>

#### Returns

[`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

***

### removeListener()

> **removeListener**\<`K`, `B`\>(`event`, `binding`): `void`

Defined in: [mini-signals-emitter.ts:107](https://github.com/Hypercubed/mini-signals/blob/7f3303b5adbfd4cff0e235bc0bb1b765b79a6452/src/mini-signals-emitter.ts#L107)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### B

`B` *extends* [`MiniSignalBinding`](../../types/interfaces/MiniSignalBinding.md)\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

#### Parameters

##### event

`K`

##### binding

`B`

#### Returns

`void`
