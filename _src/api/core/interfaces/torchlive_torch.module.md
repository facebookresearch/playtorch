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
| `In` | `In`: [Tensor](torchlive_torch.tensor.md) |
| `Out` | `Out`: `ModuleValue` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...inputs` | `In`[] | Module inputs. It currently only supports [Tensor](torchlive_torch.tensor.md) as inputs. |

#### Returns

`Promise`<Out\>

Module output, which is particular to the model and can be any of
the [[ModuleValue]] union types.

#### Defined in

[torchlive/torch.ts:63](https://github.com/pytorch/live/blob/d47c0e2/react-native-pytorch-core/src/torchlive/torch.ts#L63)

___

### forwardSync

▸ **forwardSync**<In, Out\>(...`inputs`): `Out`

Synchronous module forward function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `In` | `In`: [Tensor](torchlive_torch.tensor.md) |
| `Out` | `Out`: `ModuleValue` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...inputs` | `In`[] | Module inputs. It currently only supports [Tensor](torchlive_torch.tensor.md) as inputs. |

#### Returns

`Out`

Module output, which is particular to the model and can be any of
the [[ModuleValue]] union types.

#### Defined in

[torchlive/torch.ts:74](https://github.com/pytorch/live/blob/d47c0e2/react-native-pytorch-core/src/torchlive/torch.ts#L74)
