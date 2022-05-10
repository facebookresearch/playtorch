---
id: "torchlive_torch.module"
title: "Interface: Module"
sidebar_label: "Module"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Module

## Methods

### forward

▸ **forward**(...`input`): `Promise`<ModuleValue\>

Module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [Tensor](torchlive_torch.tensor.md)[] | Module input. |

#### Returns

`Promise`<ModuleValue\>

#### Defined in

[torchlive/torch.ts:90](https://github.com/pytorch/live/blob/edbdb85/react-native-pytorch-core/src/torchlive/torch.ts#L90)

___

### forwardSync

▸ **forwardSync**(...`input`): `ModuleValue`

Synchronous module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [Tensor](torchlive_torch.tensor.md)[] | Module input. |

#### Returns

`ModuleValue`

#### Defined in

[torchlive/torch.ts:96](https://github.com/pytorch/live/blob/edbdb85/react-native-pytorch-core/src/torchlive/torch.ts#L96)
