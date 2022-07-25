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

[torchlive/torch.ts:566](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L566)

___

### contiguousFormat

• **contiguousFormat**: ``"contiguousFormat"``

#### Defined in

[torchlive/torch.ts:567](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L567)

___

### double

• **double**: ``"double"``

#### Defined in

[torchlive/torch.ts:552](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L552)

___

### float

• **float**: ``"float"``

#### Defined in

[torchlive/torch.ts:553](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L553)

___

### float32

• **float32**: ``"float32"``

#### Defined in

[torchlive/torch.ts:554](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L554)

___

### float64

• **float64**: ``"float64"``

#### Defined in

[torchlive/torch.ts:555](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L555)

___

### int

• **int**: ``"int"``

#### Defined in

[torchlive/torch.ts:556](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L556)

___

### int16

• **int16**: ``"int16"``

#### Defined in

[torchlive/torch.ts:557](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L557)

___

### int32

• **int32**: ``"int32"``

#### Defined in

[torchlive/torch.ts:558](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L558)

___

### int64

• **int64**: ``"int64"``

#### Defined in

[torchlive/torch.ts:559](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L559)

___

### int8

• **int8**: ``"int8"``

#### Defined in

[torchlive/torch.ts:560](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L560)

___

### jit

• **jit**: `JIT`

JIT module

#### Defined in

[torchlive/torch.ts:549](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L549)

___

### long

• **long**: ``"long"``

#### Defined in

[torchlive/torch.ts:561](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L561)

___

### preserveFormat

• **preserveFormat**: ``"preserveFormat"``

#### Defined in

[torchlive/torch.ts:568](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L568)

___

### short

• **short**: ``"short"``

#### Defined in

[torchlive/torch.ts:562](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L562)

___

### uint8

• **uint8**: ``"uint8"``

#### Defined in

[torchlive/torch.ts:563](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L563)

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

[torchlive/torch.ts:396](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L396)

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

[torchlive/torch.ts:408](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L408)

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

[torchlive/torch.ts:421](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L421)

___

### cat

▸ **cat**(`tensors`, `options?`): [Tensor](torchlive_torch.tensor.md)

Concatenate a list of tensors along the specified axis, which default to be axis 0

[https://pytorch.org/docs/1.11/generated/torch.cat.html](https://pytorch.org/docs/1.11/generated/torch.cat.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tensors` | [Tensor](torchlive_torch.tensor.md)[] | A sequence of Tensor to be concatenated. |
| `options?` | `Object` | used to specify the dimenstion to concate. |
| `options.dim?` | `number` | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:435](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L435)

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

[torchlive/torch.ts:445](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L445)

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

[torchlive/torch.ts:455](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L455)

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

[torchlive/torch.ts:471](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L471)

___

### logspace

▸ **logspace**(`start`, `end`, `steps`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a one-dimensional tensor of size steps whose values are evenly spaced from
base^start to base^end, inclusive, on a logarithmic scale with base.

[https://pytorch.org/docs/1.11/generated/torch.logspace.html](https://pytorch.org/docs/1.11/generated/torch.logspace.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | starting value for the set of points |
| `end` | `number` | ending value for the set of points |
| `steps` | `number` | size of the constructed tensor |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) & { `base`: `number`  } | object to customizing base and dtype. default to be {base: 10, dtype: torch.float32} |

#### Returns

[Tensor](torchlive_torch.tensor.md)

#### Defined in

[torchlive/torch.ts:483](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L483)

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

[torchlive/torch.ts:498](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L498)

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

[torchlive/torch.ts:506](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L506)

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

[torchlive/torch.ts:516](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L516)

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

[torchlive/torch.ts:527](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L527)

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

[torchlive/torch.ts:534](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L534)

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

[torchlive/torch.ts:544](https://github.com/facebookresearch/playtorch/blob/f6eacc3/react-native-pytorch-core/src/torchlive/torch.ts#L544)
