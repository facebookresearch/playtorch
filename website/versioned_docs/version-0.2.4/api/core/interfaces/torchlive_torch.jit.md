---
id: "torchlive_torch.jit"
title: "Interface: JIT"
sidebar_label: "JIT"
custom_edit_url: null
---

[torchlive/torch](../modules/torchlive_torch.md).JIT

## Methods

### \_loadForMobile

▸ **_loadForMobile**<T\>(`filePath`, `device?`, `extraFiles?`): `Promise`<T\>

Loads a serialized mobile module.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: [Module](torchlive_torch.module.md) = [Module](torchlive_torch.module.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | Path to serialized mobile module. |
| `device?` | ``"cpu"`` | Device on which the model will be loaded. |
| `extraFiles?` | [ExtraFilesMap](../modules/torchlive_torch.md#extrafilesmap) | Load extra files when loading the model. |

#### Returns

`Promise`<T\>

Serialized mobile module of the specified type extending [Module](torchlive_torch.module.md),
which, if not specified, default to be [Module](torchlive_torch.module.md)

___

### \_loadForMobileSync

▸ **_loadForMobileSync**<T\>(`filePath`, `device?`, `extraFiles?`): `T`

Loads a serialized mobile module synchronously.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: [Module](torchlive_torch.module.md) = [Module](torchlive_torch.module.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | Path to serialized mobile module. |
| `device?` | ``"cpu"`` | Device on which the model will be loaded. |
| `extraFiles?` | [ExtraFilesMap](../modules/torchlive_torch.md#extrafilesmap) | Load extra files when loading the model. |

#### Returns

`T`

Serialized mobile module of the specified type extending [Module](torchlive_torch.module.md),
which, if not specified, default to be [Module](torchlive_torch.module.md)
