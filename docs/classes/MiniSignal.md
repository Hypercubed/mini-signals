[mini-signals](../README.md) / [Exports](../modules.md) / MiniSignal

# Class: MiniSignal<T, S\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |
| `S` | extends `any` = { `[MiniSignalSymbol]`: ``true``  } |

## Table of contents

### Constructors

- [constructor](MiniSignal.md#constructor)

### Properties

- [\_head](MiniSignal.md#_head)
- [\_tail](MiniSignal.md#_tail)
- [dispatching](MiniSignal.md#dispatching)
- [symbol](MiniSignal.md#symbol)

### Methods

- [\_addNode](MiniSignal.md#_addnode)
- [\_destroyNode](MiniSignal.md#_destroynode)
- [\_disconnectNode](MiniSignal.md#_disconnectnode)
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
| `S` | extends `unknown` = { `[MiniSignalSymbol]`: ``true``  } |

## Properties

### \_head

• `Private` `Optional` **\_head**: `MiniSignalNode`<`T`\> = `undefined`

#### Defined in

[mini-signals.ts:18](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L18)

___

### \_tail

• `Private` `Optional` **\_tail**: `MiniSignalNode`<`T`\> = `undefined`

#### Defined in

[mini-signals.ts:19](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L19)

___

### dispatching

• `Private` **dispatching**: `boolean` = `false`

#### Defined in

[mini-signals.ts:22](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L22)

___

### symbol

• `Private` `Readonly` **symbol**: `symbol`

#### Defined in

[mini-signals.ts:21](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L21)

## Methods

### \_addNode

▸ `Private` **_addNode**(`node`): `MiniSignalNodeRef`<`T`, `S`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `MiniSignalNode`<`T`\> |

#### Returns

`MiniSignalNodeRef`<`T`, `S`\>

#### Defined in

[mini-signals.ts:132](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L132)

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

[mini-signals.ts:101](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L101)

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

[mini-signals.ts:107](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L107)

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

[mini-signals.ts:53](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L53)

___

### detach

▸ **detach**(`ref`): [`MiniSignal`](MiniSignal.md)<`T`, `S`\>

Remove binding object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `MiniSignalNodeRef`<`T`, `S`\> |

#### Returns

[`MiniSignal`](MiniSignal.md)<`T`, `S`\>

#### Defined in

[mini-signals.ts:66](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L66)

___

### detachAll

▸ **detachAll**(): [`MiniSignal`](MiniSignal.md)<`T`, `S`\>

Detach all listeners.

#### Returns

[`MiniSignal`](MiniSignal.md)<`T`, `S`\>

#### Defined in

[mini-signals.ts:88](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L88)

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

[mini-signals.ts:31](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L31)

___

### hasListeners

▸ **hasListeners**(): `boolean`

#### Returns

`boolean`

#### Defined in

[mini-signals.ts:24](https://github.com/Hypercubed/mini-signals/blob/8bd4ace/src/mini-signals.ts#L24)
