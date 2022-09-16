---
id: "mobilemodelmodule.mobilemodel"
title: "Interface: MobileModel"
sidebar_label: "MobileModel"
custom_edit_url: null
---

[MobileModelModule](../modules/mobilemodelmodule.md).MobileModel

## Methods

### download

▸ **download**(`modelPath`): `Promise`<string\>

Download a model to the local file system and return the local file path
as a model. If the model path is a file path already, it will return the
same path as a result.

**`deprecated`** Use third-party file downloader (e.g., expo-file-system or react-native-fs)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelPath` | [ModelPath](../modules/models.md#modelpath) | The model path as require or uri (i.e., `require`). |

#### Returns

`Promise`<string\>
