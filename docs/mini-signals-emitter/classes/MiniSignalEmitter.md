[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals-emitter](../README.md) / MiniSignalEmitter

# Class: MiniSignalEmitter\<T\>

Defined in: [mini-signals-emitter.ts:41](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L41)

## Type Parameters

### T

`T` *extends* `EventMap`\<`any`\> \| `MiniSignalMap`\<`EventMap`\<`any`\>\> = `any`

## Documents

- [mini-signal-emitter](documents/mini-signal-emitter.md)

## Constructors

### Constructor

> **new MiniSignalEmitter**\<`T`\>(`signals`): `MiniSignalEmitter`\<`T`\>

Defined in: [mini-signals-emitter.ts:48](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L48)

#### Parameters

##### signals

`SignalMap`\<`T`\>

#### Returns

`MiniSignalEmitter`\<`T`\>

## Methods

### clear()

> **clear**\<`K`\>(`event?`): `void`

Defined in: [mini-signals-emitter.ts:125](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L125)

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

Defined in: [mini-signals-emitter.ts:96](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L96)

Emit an event with data

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Args`\<`T`\[`K`\]\>

#### Returns

`boolean`

***

### emitParallel()

> **emitParallel**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:101](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L101)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Args`\<`T`\[`K`\]\>

#### Returns

`Promise`\<`boolean`\>

***

### emitSerial()

> **emitSerial**\<`K`\>(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals-emitter.ts:109](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L109)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Args`\<`T`\[`K`\]\>

#### Returns

`Promise`\<`boolean`\>

***

### off()

> **off**\<`K`, `B`\>(`event`, `binding`): `void`

Defined in: [mini-signals-emitter.ts:117](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L117)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### B

`B` *extends* `Binding`\<`T`\[`K`\], `K`\>

#### Parameters

##### event

`K`

##### binding

`B`

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `handler`): `Binding`\<`T`\[`K`\], `K`\>

Defined in: [mini-signals-emitter.ts:70](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L70)

Register a listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`Listener`\<`T`\[`K`\]\>

#### Returns

`Binding`\<`T`\[`K`\], `K`\>

***

### once()

> **once**\<`K`\>(`event`, `handler`): `Binding`\<`T`\[`K`\], `K`\>

Defined in: [mini-signals-emitter.ts:81](https://github.com/Hypercubed/mini-signals/blob/3445a74a06e244101b618bff9a11f76035a65e89/src/mini-signals-emitter.ts#L81)

Register a one-time listener for a specific event

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

`Listener`\<`T`\[`K`\]\>

#### Returns

`Binding`\<`T`\[`K`\], `K`\>
