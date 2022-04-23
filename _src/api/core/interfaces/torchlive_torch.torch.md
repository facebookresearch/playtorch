---
id: "torchlive_torch.torch"
title: "Interface: Torch"
sidebar_label: "Torch"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Torch

## Properties

### double

• **double**: ``"double"``

#### Defined in

[torchlive/torch.ts:404](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L404)

___

### float

• **float**: ``"float"``

#### Defined in

[torchlive/torch.ts:405](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L405)

___

### float32

• **float32**: ``"float32"``

#### Defined in

[torchlive/torch.ts:406](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L406)

___

### float64

• **float64**: ``"float64"``

#### Defined in

[torchlive/torch.ts:407](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L407)

___

### int

• **int**: ``"int"``

#### Defined in

[torchlive/torch.ts:408](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L408)

___

### int16

• **int16**: ``"int16"``

#### Defined in

[torchlive/torch.ts:409](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L409)

___

### int32

• **int32**: ``"int32"``

#### Defined in

[torchlive/torch.ts:410](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L410)

___

### int64

• **int64**: ``"int64"``

#### Defined in

[torchlive/torch.ts:411](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L411)

___

### int8

• **int8**: ``"int8"``

#### Defined in

[torchlive/torch.ts:412](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L412)

___

### jit

• **jit**: `JIT`

JIT module

#### Defined in

[torchlive/torch.ts:401](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L401)

___

### long

• **long**: ``"long"``

#### Defined in

[torchlive/torch.ts:413](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L413)

___

### short

• **short**: ``"short"``

#### Defined in

[torchlive/torch.ts:414](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L414)

___

### uint8

• **uint8**: ``"uint8"``

#### Defined in

[torchlive/torch.ts:415](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L415)

## Methods

### arange

▸ **arange**(`end`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
`[0, end)` taken with common difference step beginning from start.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `end` | `number` | The ending value for the set of points. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:302](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L302)

▸ **arange**(`start`, `end`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / 1` with values from the
interval `[start, end)` taken with common difference step beginning from
start.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:313](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L313)

▸ **arange**(`start`, `end`, `step`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / step` with values from the
interval `[start, end)` taken with common difference step beginning from
start.

[https://pytorch.org/docs/1.11/generated/torch.arange.html](https://pytorch.org/docs/1.11/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |
| `step` | `number` | The gap between each pair of adjacent points. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:325](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L325)

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

[torchlive/torch.ts:335](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L335)

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

[torchlive/torch.ts:345](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L345)

___

### fromBlob

▸ **fromBlob**(`blob`, `sizes?`): [Tensor](torchlive_torch.tensor.md)

Exposes the given data as a Tensor without taking ownership of the
original data.

:::note

The function exists in JavaScript and C++ (torch::from_blob).

:::

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blob` | `any` | The blob holding the data. |
| `sizes?` | `number`[] | Should specify the shape of the tensor, strides the stride in each dimension. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:360](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L360)

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

[torchlive/torch.ts:368](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L368)

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

[torchlive/torch.ts:378](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L378)

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

[torchlive/torch.ts:389](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L389)

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

[torchlive/torch.ts:396](https://github.com/pytorch/live/blob/c947816/react-native-pytorch-core/src/torchlive/torch.ts#L396)
