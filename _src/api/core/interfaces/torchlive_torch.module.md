---
id: "torchlive_torch.module"
title: "Interface: Module"
sidebar_label: "Module"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Module

## Methods

### forward

▸ **forward**(...`input`): `Promise`<[ModuleValue](../modules/torchlive_torch.md#modulevalue)\>

Module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [Tensor](torchlive_torch.tensor.md)[] | Module input. |

#### Returns

`Promise`<[ModuleValue](../modules/torchlive_torch.md#modulevalue)\>

#### Defined in

[torchlive/torch.ts:60](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L60)

___

### forwardSync

▸ **forwardSync**(...`input`): [ModuleValue](../modules/torchlive_torch.md#modulevalue)

Synchronous module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [Tensor](torchlive_torch.tensor.md)[] | Module input. |

#### Returns

[ModuleValue](../modules/torchlive_torch.md#modulevalue)

#### Defined in

[torchlive/torch.ts:66](https://github.com/pytorch/live/blob/6d01cb0/react-native-pytorch-core/src/torchlive/torch.ts#L66)
