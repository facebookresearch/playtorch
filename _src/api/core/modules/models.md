---
id: "models"
title: "Module: Models"
sidebar_label: "Models"
sidebar_position: 0
custom_edit_url: null
---

## Type aliases

### ModelInfo

Ƭ **ModelInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `model` | [ModelPath](models.md#modelpath) |
| `name` | `string` |
| `vocab?` | `string` |

#### Defined in

[Models.ts:28](https://github.com/pytorch/live/blob/f270d5c/react-native-pytorch-core/src/Models.ts#L28)

___

### ModelPath

Ƭ **ModelPath**: `string` \| `ImageRequireSource`

An ML model can be loaded from three different sources, and must be one of
the following options:

* url to a model file (e.g., https://example.com/my_model.ptl)
* path to a local model file (e.g., /data/0/some/path/my_model.ptl)
* a path in the JavaScript bundle (e.g., `require('./my_model.ptl')`)

#### Defined in

[Models.ts:26](https://github.com/pytorch/live/blob/f270d5c/react-native-pytorch-core/src/Models.ts#L26)

## Functions

### getModelUri

▸ **getModelUri**(`modelPath`): `string`

Checks if the passed in model path is a string or a resolvable asset source.
In case the path is a string it will be used as a URI. If it is a resolvable
asset source, it will resolve the asset source and get its URI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelPath` | [ModelPath](models.md#modelpath) | The model path as require or uri (i.e., `require`). |

#### Returns

`string`

A URI to resolve the model.

#### Defined in

[Models.ts:65](https://github.com/pytorch/live/blob/f270d5c/react-native-pytorch-core/src/Models.ts#L65)
