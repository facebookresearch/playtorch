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

___

### contiguousFormat

• **contiguousFormat**: ``"contiguousFormat"``

___

### double

• **double**: ``"double"``

___

### float

• **float**: ``"float"``

___

### float32

• **float32**: ``"float32"``

___

### float64

• **float64**: ``"float64"``

___

### int

• **int**: ``"int"``

___

### int16

• **int16**: ``"int16"``

___

### int32

• **int32**: ``"int32"``

___

### int64

• **int64**: ``"int64"``

___

### int8

• **int8**: ``"int8"``

___

### jit

• **jit**: [JIT](torchlive_torch.jit.md)

JIT module

___

### long

• **long**: ``"long"``

___

### preserveFormat

• **preserveFormat**: ``"preserveFormat"``

___

### short

• **short**: ``"short"``

___

### uint8

• **uint8**: ``"uint8"``

## Methods

### arange

▸ **arange**(`end`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
`[0, end)` taken with common difference step beginning from start.

[https://pytorch.org/docs/1.12/generated/torch.arange.html](https://pytorch.org/docs/1.12/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `end` | `number` | The ending value for the set of points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

▸ **arange**(`start`, `end`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / 1` with values from the
interval `[start, end)` taken with common difference 1 beginning from
`start`.

[https://pytorch.org/docs/1.12/generated/torch.arange.html](https://pytorch.org/docs/1.12/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

▸ **arange**(`start`, `end`, `step`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a 1-D tensor of size `(end - start) / step` with values from the
interval `[start, end)` taken with common difference `step` beginning from
`start`.

[https://pytorch.org/docs/1.12/generated/torch.arange.html](https://pytorch.org/docs/1.12/generated/torch.arange.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The starting value for the set of points. |
| `end` | `number` | The ending value for the set of points. |
| `step` | `number` | The gap between each pair of adjacent points. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) |  |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### cat

▸ **cat**(`tensors`, `options?`): [Tensor](torchlive_torch.tensor.md)

Concatenate a list of tensors along the specified axis, which default to be axis 0

[https://pytorch.org/docs/1.12/generated/torch.cat.html](https://pytorch.org/docs/1.12/generated/torch.cat.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tensors` | [Tensor](torchlive_torch.tensor.md)[] | A sequence of Tensor to be concatenated. |
| `options?` | `Object` | used to specify the dimenstion to concate. |
| `options.dim?` | `number` | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### empty

▸ **empty**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with uninitialized data. The shape of the tensor
is defined by the variable argument size.

[https://pytorch.org/docs/1.12/generated/torch.empty.html](https://pytorch.org/docs/1.12/generated/torch.empty.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### eye

▸ **eye**(`n`, `m?`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with ones on the diagonal, and zeroes elsewhere.
The shape of the tensor is defined by the arguments n and m.

[https://pytorch.org/docs/1.12/generated/torch.eye.html](https://pytorch.org/docs/1.12/generated/torch.eye.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n` | `number` | An integer defining the number of rows in the result. |
| `m?` | `number` | An integer defining the number of columns in the result. Optional, defaults to n. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | - |

#### Returns

[Tensor](torchlive_torch.tensor.md)

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

___

### full

▸ **full**(`size`, `fillValue`, `options?`): [Tensor](torchlive_torch.tensor.md)

Creates a tensor of size `size` filled with `fillValue`. The tensor’s dtype is default to be `torch.float32`,
unless specified with `options`.

[https://pytorch.org/docs/1.12/generated/torch.full.html](https://pytorch.org/docs/1.12/generated/torch.full.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A list of integers defining the shape of the output tensor. |
| `fillValue` | `number` | The value to fill the output tensor with. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Object to customizing dtype, etc. default to be {dtype: torch.float32} |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### linspace

▸ **linspace**(`start`, `end`, `steps`, `options?`): [Tensor](torchlive_torch.tensor.md)

Creates a one-dimensional tensor of size steps whose values are evenly spaced from `start` to `end`,
inclusive.

[https://pytorch.org/docs/1.12/generated/torch.linspace.html](https://pytorch.org/docs/1.12/generated/torch.linspace.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | Starting value for the set of points |
| `end` | `number` | Ending value for the set of points |
| `steps` | `number` | Size of the constructed tensor |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Object to customizing dtype. default to be {dtype: torch.float32} |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### logspace

▸ **logspace**(`start`, `end`, `steps`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a one-dimensional tensor of size steps whose values are evenly spaced from
base^start to base^end, inclusive, on a logarithmic scale with base.

[https://pytorch.org/docs/1.12/generated/torch.logspace.html](https://pytorch.org/docs/1.12/generated/torch.logspace.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | Starting value for the set of points |
| `end` | `number` | Ending value for the set of points |
| `steps` | `number` | Size of the constructed tensor |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) & { `base`: `number`  } | Object to customizing base and dtype. default to be {base: 10, dtype: torch.float32} |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### ones

▸ **ones**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with the scalar value 1, with the shape defined
by the argument `size`.

[https://pytorch.org/docs/1.12/generated/torch.ones.html](https://pytorch.org/docs/1.12/generated/torch.ones.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

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

___

### randint

▸ **randint**(`high`, `size`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random integers generated uniformly between
`0` (inclusive) and `high` (exclusive).

[https://pytorch.org/docs/1.12/generated/torch.randint.html](https://pytorch.org/docs/1.12/generated/torch.randint.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `high` | `number` | One above the highest integer to be drawn from the distribution. |
| `size` | `number`[] | A tuple defining the shape of the output tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

▸ **randint**(`low`, `high`, `size`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random integers generated uniformly between
`low` (inclusive) and `high` (exclusive).

[https://pytorch.org/docs/1.12/generated/torch.randint.html](https://pytorch.org/docs/1.12/generated/torch.randint.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `low` | `number` | Lowest integer to be drawn from the distribution. |
| `high` | `number` | One above the highest integer to be drawn from the distribution. |
| `size` | `number`[] | A tuple defining the shape of the output tensor. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### randn

▸ **randn**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with random numbers from a normal distribution
with mean 0 and variance 1 (also called the standard normal distribution).

[https://pytorch.org/docs/1.12/generated/torch.randn.html](https://pytorch.org/docs/1.12/generated/torch.randn.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

___

### randperm

▸ **randperm**(`n`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a random permutation of integers from 0 to n - 1

[https://pytorch.org/docs/1.12/generated/torch.randperm.html](https://pytorch.org/docs/1.12/generated/torch.randperm.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n` | `number` | The upper bound (exclusive) |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Object to customizing dtype, etc. default to be {dtype: torch.int64}. |

#### Returns

[Tensor](torchlive_torch.tensor.md)

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

___

### zeros

▸ **zeros**(`size`, `options?`): [Tensor](torchlive_torch.tensor.md)

Returns a tensor filled with the scalar value 0, with the shape defined
by the argument `size`.

[https://pytorch.org/docs/1.12/generated/torch.zeros.html](https://pytorch.org/docs/1.12/generated/torch.zeros.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number`[] | A sequence of integers defining the shape of the output tensor. |
| `options?` | [TensorOptions](../modules/torchlive_torch.md#tensoroptions) | Tensor options. |

#### Returns

[Tensor](torchlive_torch.tensor.md)
