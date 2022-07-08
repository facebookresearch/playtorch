---
id: "torchlive_torch.torch"
title: "Interface: Torch"
sidebar_label: "Torch"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Torch

## Properties

### channelsLast

• **channelsLast**: ``"channelsLast"``

#### Defined in

[torchlive/torch.ts:538](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L538)

___

### contiguousFormat

• **contiguousFormat**: ``"contiguousFormat"``

#### Defined in

[torchlive/torch.ts:539](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L539)

___

### double

• **double**: ``"double"``

#### Defined in

[torchlive/torch.ts:524](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L524)

___

### float

• **float**: ``"float"``

#### Defined in

[torchlive/torch.ts:525](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L525)

___

### float32

• **float32**: ``"float32"``

#### Defined in

[torchlive/torch.ts:526](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L526)

___

### float64

• **float64**: ``"float64"``

#### Defined in

[torchlive/torch.ts:527](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L527)

___

### int

• **int**: ``"int"``

#### Defined in

[torchlive/torch.ts:528](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L528)

___

### int16

• **int16**: ``"int16"``

#### Defined in

[torchlive/torch.ts:529](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L529)

___

### int32

• **int32**: ``"int32"``

#### Defined in

[torchlive/torch.ts:530](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L530)

___

### int64

• **int64**: ``"int64"``

#### Defined in

[torchlive/torch.ts:531](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L531)

___

### int8

• **int8**: ``"int8"``

#### Defined in

[torchlive/torch.ts:532](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L532)

___

### jit

• **jit**: `JIT`

JIT module

#### Defined in

[torchlive/torch.ts:521](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L521)

___

### long

• **long**: ``"long"``

#### Defined in

[torchlive/torch.ts:533](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L533)

___

### preserveFormat

• **preserveFormat**: ``"preserveFormat"``

#### Defined in

[torchlive/torch.ts:540](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L540)

___

### short

• **short**: ``"short"``

#### Defined in

[torchlive/torch.ts:534](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L534)

___

### uint8

• **uint8**: ``"uint8"``

#### Defined in

[torchlive/torch.ts:535](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L535)

## Methods

### arange

▸ **arange**(`end`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
`[0, end)` taken with common difference step beginning from start.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `end` | `number` | The ending value for the set of points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:394](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L394)

▸ **arange**(`start`, `end`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / 1` with values from the
interval `[start, end)` taken with common difference 1 beginning from
`start`.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:406](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L406)

▸ **arange**(`start`, `end`, `step`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / step` with values from the
interval `[start, end)` taken with common difference `step` beginning from
`start`.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |
| `step` | `number` | The gap between each pair of adjacent points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:419](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L419)

___

### empty

▸ **empty**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with uninitialized data. The shape of the tensor
is defined by the variable argument size.

[https://pytorch.org/docs/1.11/generated/torch.empty.html](https://pytorch.org/docs/1.11/generated/torch.empty.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:434](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L434)

___

### eye

▸ **eye**(`n`, `m?`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with ones on the diagonal, and zeroes elsewhere.
The shape of the tensor is defined by the arguments n and m.

[https://pytorch.org/docs/1.11/generated/torch.eye.html](https://pytorch.org/docs/1.11/generated/torch.eye.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n` | `number` | An integer defining the number of rows in the result. |
| `m?` | `number` | An integer defining the number of columns in the result. Optional, defaults to n. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:444](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L444)

___

### fromBlob

▸ **fromBlob**(`blob`, `sizes?`, `options?`): [Tensor](torchlive_torch.tensor.md)

Exposes the given data as a Tensor without taking ownership of the
original data.

:::note

The function exists in JavaScript and C++ (torch::from_blob).

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blob` | `any` | The blob holding the data. |
| `sizes?` | `number`[] | Should specify the shape of the tensor, strides the stride |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options in each dimension. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:460](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L460)

___

### ones

▸ **ones**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with the scalar value 1, with the shape defined
by the argument `size`.

[https://pytorch.org/docs/1.11/generated/torch.ones.html](https://pytorch.org/docs/1.11/generated/torch.ones.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:470](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L470)

___

### rand

▸ **rand**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random numbers from a uniform distribution on
the interval `[0, 1)`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:478](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L478)

___

### randint

▸ **randint**(`high`, `size`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random integers generated uniformly between
`0` (inclusive) and `high` (exclusive).

[https://pytorch.org/docs/1.11/generated/torch.randint.html](https://pytorch.org/docs/1.11/generated/torch.randint.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `high` | `number` | One above the highest integer to be drawn from the distribution. |
| `size` | `number`[] | A tuple defining the shape of the output tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:488](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L488)

▸ **randint**(`low`, `high`, `size`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random integers generated uniformly between
`low` (inclusive) and `high` (exclusive).

[https://pytorch.org/docs/1.11/generated/torch.randint.html](https://pytorch.org/docs/1.11/generated/torch.randint.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `low` | `number` | Lowest integer to be drawn from the distribution. |
| `high` | `number` | One above the highest integer to be drawn from the distribution. |
| `size` | `number`[] | A tuple defining the shape of the output tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:499](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L499)

___

### tensor

▸ **tensor**(`data`, `options?`): [Tensor](torchlive_torch.tensor.md)

Constructs a tensor with no autograd history.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `number` \| `ItemArray` | Tensor data as multi-dimensional array. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:506](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L506)

___

### zeros

▸ **zeros**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with the scalar value 0, with the shape defined
by the argument `size`.

[https://pytorch.org/docs/1.11/generated/torch.zeros.html](https://pytorch.org/docs/1.11/generated/torch.zeros.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:516](https://github.com/pytorch/live/blob/99ecf4b/react-native-pytorch-core/src/torchlive/torch.ts#L516)
