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

### MemoryFormat

Ƭ **MemoryFormat**: ``"channelsLast"`` \| ``"contiguousFormat"`` \| ``"preserveFormat"``

A [MemoryFormat](torchlive_torch.md#memoryformat) is an object representing the memory format on which a [Tensor](../interfaces/torchlive_torch.tensor.md) is or will be allocated.

[https://pytorch.org/docs/1.11/tensor_attributes.html#torch.torch.memory_format](https://pytorch.org/docs/1.11/tensor_attributes.html#torch.torch.memory_format)

#### Defined in

[torchlive/torch.ts:118](https://github.com/pytorch/live/blob/6e5d797/react-native-pytorch-core/src/torchlive/torch.ts#L118)

___

### Scalar

Ƭ **Scalar**: `number`

#### Defined in

[torchlive/torch.ts:124](https://github.com/pytorch/live/blob/6e5d797/react-native-pytorch-core/src/torchlive/torch.ts#L124)

___

### TensorOptions

Ƭ **TensorOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dtype?` | ``"double"`` \| ``"float"`` \| ``"float32"`` \| ``"float64"`` \| ``"int"`` \| ``"int16"`` \| ``"int32"`` \| ``"int8"`` \| ``"short"`` \| ``"uint8"`` | The desired data type of a tensor. |

#### Defined in

[torchlive/torch.ts:92](https://github.com/pytorch/live/blob/6e5d797/react-native-pytorch-core/src/torchlive/torch.ts#L92)

## Variables

### torch

• `Const` **torch**: [Torch](../interfaces/torchlive_torch.torch.md)

#### Defined in

[torchlive/torch.ts:536](https://github.com/pytorch/live/blob/6e5d797/react-native-pytorch-core/src/torchlive/torch.ts#L536)
