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

### ModuleValue

Ƭ **ModuleValue**: ``null`` \| `string` \| `number` \| `boolean` \| [Tensor](../interfaces/torchlive_torch.tensor.md) \| { [key: string]: [ModuleValue](torchlive_torch.md#modulevalue);  } \| [ModuleValue](torchlive_torch.md#modulevalue)[]

The [ModuleValue](torchlive_torch.md#modulevalue) type is a convenient type representative of all possible
module output values.

#### Defined in

[torchlive/torch.ts:45](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L45)

___

### Scalar

Ƭ **Scalar**: `number`

#### Defined in

[torchlive/torch.ts:100](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L100)

___

### TensorOptions

Ƭ **TensorOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dtype?` | ``"double"`` \| ``"float"`` \| ``"float32"`` \| ``"float64"`` \| ``"int"`` \| ``"int16"`` \| ``"int32"`` \| ``"int8"`` \| ``"short"`` \| ``"uint8"`` | The desired data type of a tensor. |

#### Defined in

[torchlive/torch.ts:78](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L78)

## Variables

### torch

• `Const` **torch**: [Torch](../interfaces/torchlive_torch.torch.md)

#### Defined in

[torchlive/torch.ts:452](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L452)
