---
id: "torchlive_torch"
title: "Module: torchlive/torch"
sidebar_label: "torchlive/torch"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [JIT](../interfaces/torchlive_torch.jit.md)
- [Module](../interfaces/torchlive_torch.module.md)
- [Tensor](../interfaces/torchlive_torch.tensor.md)
- [Torch](../interfaces/torchlive_torch.torch.md)

## Type aliases

### Device

Ƭ **Device**: ``"cpu"``

Allowed torch devices

[https://pytorch.org/docs/1.12/tensor_attributes.html#torch-device](https://pytorch.org/docs/1.12/tensor_attributes.html#torch-device)

___

### Dict

Ƭ **Dict**: `Object`

#### Index signature

▪ [key: `string`]: [IValue](torchlive_torch.md#ivalue)

___

### Dtype

Ƭ **Dtype**: ``"double"`` \| ``"float"`` \| ``"float32"`` \| ``"float64"`` \| ``"int"`` \| ``"int16"`` \| ``"int32"`` \| ``"int64"`` \| ``"int8"`` \| ``"long"`` \| ``"short"`` \| ``"uint8"``

A [Dtype](torchlive_torch.md#dtype) is an object that represents the data type of a [Tensor](../interfaces/torchlive_torch.tensor.md).

:::note

The `int64` (a.k.a. `long`) data types are not fully supported in React Native.
For now, use `.to({dtype: torch.int32})` to downcast before accessing such
methods as `.data()` and `.item()`.

:::

[https://pytorch.org/docs/1.12/tensor_attributes.html#torch-dtype](https://pytorch.org/docs/1.12/tensor_attributes.html#torch-dtype)

___

### ExtraFilesMap

Ƭ **ExtraFilesMap**: `Object`

Defining type for extra files loaded with `torch.jit._loadForMobile` and
`torch.jit._loadForMobileSync`.

#### Index signature

▪ [key: `string`]: `string` \| ``null``

___

### IValue

Ƭ **IValue**: ``null`` \| `string` \| `number` \| `boolean` \| [Tensor](../interfaces/torchlive_torch.tensor.md) \| [Dict](torchlive_torch.md#dict) \| [IValue](torchlive_torch.md#ivalue)[]

The [IValue](torchlive_torch.md#ivalue) type is a convenient type representative of all possible
module input/output values.

___

### MemoryFormat

Ƭ **MemoryFormat**: ``"channelsLast"`` \| ``"contiguousFormat"`` \| ``"preserveFormat"``

A [MemoryFormat](torchlive_torch.md#memoryformat) is an object representing the memory format on which a [Tensor](../interfaces/torchlive_torch.tensor.md) is or will be allocated.

[https://pytorch.org/docs/1.12/tensor_attributes.html#torch.torch.memory_format](https://pytorch.org/docs/1.12/tensor_attributes.html#torch.torch.memory_format)

___

### Scalar

Ƭ **Scalar**: `number`

___

### TensorOptions

Ƭ **TensorOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dtype?` | [Dtype](torchlive_torch.md#dtype) | The desired data type of a tensor. |

## Variables

### torch

• `Const` **torch**: [Torch](../interfaces/torchlive_torch.torch.md)
