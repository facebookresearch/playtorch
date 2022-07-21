---
id: "torchlive_torch"
title: "Module: torchlive/torch"
sidebar_label: "torchlive/torch"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [Module](../interfaces/torchlive_torch.module.md)
- [Tensor](../interfaces/torchlive_torch.tensor.md)
- [Torch](../interfaces/torchlive_torch.torch.md)

## Type aliases

### Dtype

Ƭ **Dtype**: ``"double"`` \| ``"float"`` \| ``"float32"`` \| ``"float64"`` \| ``"int"`` \| ``"int16"`` \| ``"int32"`` \| ``"int64"`` \| ``"int8"`` \| ``"long"`` \| ``"short"`` \| ``"uint8"``

A [Dtype](torchlive_torch.md#dtype) is an object that represents the data type of a [Tensor](../interfaces/torchlive_torch.tensor.md).

:::note

The `int64` (a.k.a. `long`) data types are not fully supported in React Native.
For now, use `.to({dtype: torch.int32})` to downcast before accessing such
methods as `.data()` and `.item()`.

:::

[https://pytorch.org/docs/1.11/tensor_attributes.html#torch-dtype](https://pytorch.org/docs/1.11/tensor_attributes.html#torch-dtype)

#### Defined in

[torchlive/torch.ts:107](https://github.com/facebookresearch/playtorch/blob/b0e78db/react-native-pytorch-core/src/torchlive/torch.ts#L107)

___

### MemoryFormat

Ƭ **MemoryFormat**: ``"channelsLast"`` \| ``"contiguousFormat"`` \| ``"preserveFormat"``

A [MemoryFormat](torchlive_torch.md#memoryformat) is an object representing the memory format on which a [Tensor](../interfaces/torchlive_torch.tensor.md) is or will be allocated.

[https://pytorch.org/docs/1.11/tensor_attributes.html#torch.torch.memory_format](https://pytorch.org/docs/1.11/tensor_attributes.html#torch.torch.memory_format)

#### Defined in

[torchlive/torch.ts:133](https://github.com/facebookresearch/playtorch/blob/b0e78db/react-native-pytorch-core/src/torchlive/torch.ts#L133)

___

### Scalar

Ƭ **Scalar**: `number`

#### Defined in

[torchlive/torch.ts:139](https://github.com/facebookresearch/playtorch/blob/b0e78db/react-native-pytorch-core/src/torchlive/torch.ts#L139)

___

### TensorOptions

Ƭ **TensorOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dtype?` | [Dtype](torchlive_torch.md#dtype) | The desired data type of a tensor. |

#### Defined in

[torchlive/torch.ts:121](https://github.com/facebookresearch/playtorch/blob/b0e78db/react-native-pytorch-core/src/torchlive/torch.ts#L121)

## Variables

### torch

• `Const` **torch**: [Torch](../interfaces/torchlive_torch.torch.md)

#### Defined in

[torchlive/torch.ts:577](https://github.com/facebookresearch/playtorch/blob/b0e78db/react-native-pytorch-core/src/torchlive/torch.ts#L577)
