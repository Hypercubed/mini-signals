[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals-emitter](../README.md) / MiniSignalEmitter

# Class: MiniSignalEmitter\<T\>

Defined in: [mini-signals-emitter.ts:14](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L14)

## Type Parameters

### T

`T` *extends* `EventMap`\<`any`\> = `EventMap`\<`any`\>

## Documents

- [mini-signal-emitter](documents/mini-signal-emitter.md)

## Constructors

### Constructor

> **new MiniSignalEmitter**\<`T`\>(`signals`): `MiniSignalEmitter`\<`T`\>

Defined in: [mini-signals-emitter.ts:17](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L17)

#### Parameters

##### signals

`MiniSignalMap`\<`T`\>

#### Returns

`MiniSignalEmitter`\<`T`\>

## Methods

### clear()

> **clear**\<`K`\>(`event?`): `void`

Defined in: [mini-signals-emitter.ts:98](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L98)

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

Defined in: [mini-signals-emitter.ts:66](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L66)

Emit an event with data

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`T`\[`K`\]

#### Returns

`boolean`

***

### emitParallel()

> **emitParallel**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:74](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L74)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`T`\[`K`\]

#### Returns

`Promise`\<`boolean`\>

***

### emitSerial()

> **emitSerial**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:82](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L82)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`T`\[`K`\]

#### Returns

`Promise`\<`boolean`\>

***

### off()

> **off**\<`K`, `B`\>(`event`, `binding`): `void`

Defined in: [mini-signals-emitter.ts:90](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L90)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### B

`B` *extends* `MiniSignalBinding`\<`T`\[`K`\], `K`\>

#### Parameters

##### event

`K`

##### binding

`B`

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `handler`): `MiniSignalBinding`\<`T`\[`K`\], `K`\>

Defined in: [mini-signals-emitter.ts:37](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L37)

Register a listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`EventHandler`\<`T`\[`K`\]\>

#### Returns

`MiniSignalBinding`\<`T`\[`K`\], `K`\>

***

### once()

> **once**\<`K`\>(`event`, `handler`): `MiniSignalBinding`\<`T`\[`K`\], `K`\>

Defined in: [mini-signals-emitter.ts:48](https://github.com/Hypercubed/mini-signals/blob/9ce8629a10eac3a85dfe24449edbdf9c087442be/src/mini-signals-emitter.ts#L48)

Register a one-time listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`EventHandler`\<`T`\[`K`\]\>

#### Returns

`MiniSignalBinding`\<`T`\[`K`\], `K`\>
