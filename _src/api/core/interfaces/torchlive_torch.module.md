---
id: "torchlive_torch.module"
title: "Interface: Module"
sidebar_label: "Module"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Module

## Methods

### forward

▸ **forward**(...`input`): `Promise`<[IValue](torchlive_torch.ivalue.md)\>

Module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [IValue](torchlive_torch.ivalue.md)[] | Module input. |

#### Returns

`Promise`<[IValue](torchlive_torch.ivalue.md)\>

#### Defined in

[torchlive/torch.ts:81](https://github.com/pytorch/live/blob/ccda43e/react-native-pytorch-core/src/torchlive/torch.ts#L81)

___

### forwardSync

▸ **forwardSync**(...`input`): [IValue](torchlive_torch.ivalue.md)

Synchronous module forward function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...input` | [IValue](torchlive_torch.ivalue.md)[] | Module input. |

#### Returns

[IValue](torchlive_torch.ivalue.md)

#### Defined in

[torchlive/torch.ts:87](https://github.com/pytorch/live/blob/ccda43e/react-native-pytorch-core/src/torchlive/torch.ts#L87)
