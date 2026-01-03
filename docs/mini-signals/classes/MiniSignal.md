[**mini-signals**](../../README.md)

***

[mini-signals](../../modules.md) / [mini-signals](../README.md) / MiniSignal

# Class: MiniSignal\<T, S\>

Defined in: [mini-signals.ts:9](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L9)

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

> **add**(`fn`): [`Binding`](../../types/interfaces/Binding.md)\<`T`, `S`\>

Defined in: [mini-signals.ts:121](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L121)

Register a new listener.

#### Parameters

##### fn

[`EventHandler`](../../types/type-aliases/EventHandler.md)\<`T`\>

#### Returns

[`Binding`](../../types/interfaces/Binding.md)\<`T`, `S`\>

***

### detach()

> **detach**(`sym`): `this`

Defined in: [mini-signals.ts:131](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L131)

Remove binding object.

#### Parameters

##### sym

[`Binding`](../../types/interfaces/Binding.md)\<`T`, `S`\>

#### Returns

`this`

***

### detachAll()

> **detachAll**(): `this`

Defined in: [mini-signals.ts:158](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L158)

Detach all listeners.

#### Returns

`this`

***

### dispatch()

> **dispatch**(...`args`): `boolean`

Defined in: [mini-signals.ts:28](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L28)

Dispatches a signal to all registered listeners.

#### Parameters

##### args

...`T`

#### Returns

`boolean`

***

### dispatchParallel()

> **dispatchParallel**(...`args`): `Promise`\<`boolean`\>

Defined in: [mini-signals.ts:81](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L81)

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

Defined in: [mini-signals.ts:53](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L53)

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

Defined in: [mini-signals.ts:21](https://github.com/Hypercubed/mini-signals/blob/a7fac082839dff42d89c8f6da1674c2dfa7f96ca/src/mini-signals.ts#L21)

#### Returns

`boolean`
