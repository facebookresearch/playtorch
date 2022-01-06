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

#### Defined in

[Models.ts:22](https://github.com/pytorch/live/blob/7909a40/react-native-pytorch-core/src/Models.ts#L22)

___

### ModelPath

Ƭ **ModelPath**: `string` \| `ImageRequireSource`

An ML model can be loaded from three different sources, and must be one of
the following options:

* url to a model file (e.g., https://example.com/my_model.ptl)
* path to a local model file (e.g., /data/0/some/path/my_model.ptl)
* a path in the JavaScript bundle (e.g., `require('./my_model.ptl')`)

#### Defined in

[Models.ts:20](https://github.com/pytorch/live/blob/7909a40/react-native-pytorch-core/src/Models.ts#L20)
