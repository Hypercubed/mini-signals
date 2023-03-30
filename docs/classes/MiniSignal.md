[mini-signals](../README.md) / [Exports](../modules.md) / MiniSignal

# Class: MiniSignal<T, S\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |
| `S` | extends `any` = `Symbol` \| `string` |

## Table of contents

### Constructors

- [constructor](MiniSignal.md#constructor)

### Properties

- [\_dispatching](MiniSignal.md#_dispatching)
- [\_head](MiniSignal.md#_head)
- [\_refMap](MiniSignal.md#_refmap)
- [\_symbol](MiniSignal.md#_symbol)
- [\_tail](MiniSignal.md#_tail)

### Methods

- [\_addNode](MiniSignal.md#_addnode)
- [\_createRef](MiniSignal.md#_createref)
- [\_destroyNode](MiniSignal.md#_destroynode)
- [\_disconnectNode](MiniSignal.md#_disconnectnode)
- [\_getRef](MiniSignal.md#_getref)
- [add](MiniSignal.md#add)
- [detach](MiniSignal.md#detach)
- [detachAll](MiniSignal.md#detachall)
- [dispatch](MiniSignal.md#dispatch)
- [hasListeners](MiniSignal.md#haslisteners)

## Constructors

### constructor

• **new MiniSignal**<`T`, `S`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |
| `S` | extends `unknown` = `string` \| `Symbol` |

## Properties

### \_dispatching

• `Private` **\_dispatching**: `boolean` = `false`

#### Defined in

[mini-signals.ts:34](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L34)

___

### \_head

• `Private` `Optional` **\_head**: `MiniSignalNode`<`T`\> = `undefined`

#### Defined in

[mini-signals.ts:32](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L32)

___

### \_refMap

• `Private` **\_refMap**: `WeakMap`<`MiniSignalNodeRef`<`T`, `S`\>, `MiniSignalNode`<`T`\>\>

#### Defined in

[mini-signals.ts:30](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L30)

___

### \_symbol

• `Private` `Readonly` **\_symbol**: `symbol`

A Symbol that is used to guarantee the uniqueness of the MiniSignal
instance.

#### Defined in

[mini-signals.ts:29](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L29)

___

### \_tail

• `Private` `Optional` **\_tail**: `MiniSignalNode`<`T`\> = `undefined`

#### Defined in

[mini-signals.ts:33](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L33)

## Methods

### \_addNode

▸ `Private` **_addNode**(`node`): `MiniSignalNode`<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `MiniSignalNode`<`T`\> |

#### Returns

`MiniSignalNode`<`T`\>

#### Defined in

[mini-signals.ts:145](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L145)

___

### \_createRef

▸ `Private` **_createRef**(`node`): `MiniSignalNodeRef`<`T`, `S`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `MiniSignalNode`<`T`\> |

#### Returns

`MiniSignalNodeRef`<`T`, `S`\>

#### Defined in

[mini-signals.ts:159](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L159)

___

### \_destroyNode

▸ `Private` **_destroyNode**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `MiniSignalNode`<`T`\> |

#### Returns

`void`

#### Defined in

[mini-signals.ts:117](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L117)

___

### \_disconnectNode

▸ `Private` **_disconnectNode**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `MiniSignalNode`<`T`\> |

#### Returns

`void`

#### Defined in

[mini-signals.ts:122](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L122)

___

### \_getRef

▸ `Protected` **_getRef**(`sym`): `undefined` \| `MiniSignalNode`<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sym` | `MiniSignalNodeRef`<`T`, `S`\> |

#### Returns

`undefined` \| `MiniSignalNode`<`T`\>

#### Defined in

[mini-signals.ts:165](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L165)

___

### add

▸ **add**(`fn`): `MiniSignalNodeRef`<`T`, `S`\>

Register a new listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `CallBack`<`T`\> |

#### Returns

`MiniSignalNodeRef`<`T`, `S`\>

#### Defined in

[mini-signals.ts:65](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L65)

___

### detach

▸ **detach**(`sym`): [`MiniSignal`](MiniSignal.md)<`T`, `S`\>

Remove binding object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sym` | `MiniSignalNodeRef`<`T`, `S`\> |

#### Returns

[`MiniSignal`](MiniSignal.md)<`T`, `S`\>

#### Defined in

[mini-signals.ts:75](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L75)

___

### detachAll

▸ **detachAll**(): [`MiniSignal`](MiniSignal.md)<`T`, `S`\>

Detach all listeners.

#### Returns

[`MiniSignal`](MiniSignal.md)<`T`, `S`\>

#### Defined in

[mini-signals.ts:102](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L102)

___

### dispatch

▸ **dispatch**(`...args`): `boolean`

Dispatches a signal to all registered listeners.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` |

#### Returns

`boolean`

#### Defined in

[mini-signals.ts:43](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L43)

___

### hasListeners

▸ **hasListeners**(): `boolean`

#### Returns

`boolean`

#### Defined in

[mini-signals.ts:36](https://github.com/Hypercubed/mini-signals/blob/e88de47/src/mini-signals.ts#L36)
