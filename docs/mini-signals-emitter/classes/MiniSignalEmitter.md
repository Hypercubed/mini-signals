[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals-emitter](../README.md) / MiniSignalEmitter

# Class: MiniSignalEmitter\<T\>

Defined in: [mini-signals-emitter.ts:16](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L16)

## Type Parameters

### T

`T` *extends* `MiniSignalMap`\<`any`\>

## Documents

- [mini-signal-emitter](documents/mini-signal-emitter.md)

## Constructors

### Constructor

> **new MiniSignalEmitter**\<`T`\>(`signals`): `MiniSignalEmitter`\<`T`\>

Defined in: [mini-signals-emitter.ts:19](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L19)

#### Parameters

##### signals

`T`

#### Returns

`MiniSignalEmitter`\<`T`\>

## Methods

### clear()

> **clear**\<`K`\>(`event?`): `void`

Defined in: [mini-signals-emitter.ts:100](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L100)

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

Defined in: [mini-signals-emitter.ts:68](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L68)

Emit an event with data

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`boolean`

***

### emitParallel()

> **emitParallel**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:76](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L76)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### emitSerial()

> **emitSerial**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:84](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L84)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>

#### Returns

`Promise`\<`boolean`\>

***

### off()

> **off**\<`K`, `B`\>(`event`, `binding`): `void`

Defined in: [mini-signals-emitter.ts:92](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L92)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### B

`B` *extends* `MiniSignalBinding`\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

#### Parameters

##### event

`K`

##### binding

`B`

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `handler`): `MiniSignalBinding`\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

Defined in: [mini-signals-emitter.ts:39](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L39)

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

`MiniSignalBinding`\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

***

### once()

> **once**\<`K`\>(`event`, `handler`): `MiniSignalBinding`\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>

Defined in: [mini-signals-emitter.ts:50](https://github.com/Hypercubed/mini-signals/blob/31b86fc9e63ab0aae58887a1f4573f42c984749e/src/mini-signals-emitter.ts#L50)

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

`MiniSignalBinding`\<`Parameters`\<`ExtractHandler`\<`T`, `K`\>\>, `K`\>
