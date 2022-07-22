---
id: "torchlive_torch.module"
title: "Interface: Module"
sidebar_label: "Module"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).Module

## Methods

### forward

▸ **forward**<In, Out\>(...`inputs`): `Promise`<Out\>

Module forward function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `In` | `In`: `ModuleInputValue` |
| `Out` | `Out`: `ModuleValue` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...inputs` | `In`[] | Module inputs. Input could be of type [[ModuleInputValue]] |

#### Returns

`Promise`<Out\>

Module output, which is particular to the model and can be any of
the [[ModuleValue]] union types.

#### Defined in

[torchlive/torch.ts:68](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L68)

___

### forwardSync

▸ **forwardSync**<In, Out\>(...`inputs`): `Out`

Synchronous module forward function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `In` | `In`: `ModuleInputValue` |
| `Out` | `Out`: `ModuleValue` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...inputs` | `In`[] | Module inputs. Input could be of type [[ModuleInputValue]] |

#### Returns

`Out`

Module output, which is particular to the model and can be any of
the [[ModuleValue]] union types.

#### Defined in

[torchlive/torch.ts:78](https://github.com/facebookresearch/playtorch/blob/a792455/react-native-pytorch-core/src/torchlive/torch.ts#L78)
