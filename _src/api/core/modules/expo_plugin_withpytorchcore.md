---
id: "expo_plugin_withpytorchcore"
title: "Module: expo-plugin/withPyTorchCore"
sidebar_label: "expo-plugin/withPyTorchCore"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### default

• **default**: `ConfigPlugin`<Props\>

## Functions

### setClassPath

▸ **setClassPath**(`_config`, `buildGradle`): `string`

Adding the Google Services plugin
NOTE(brentvatne): string replacement is a fragile approach! we need a
better solution than this.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_config` | `Pick`<ExportedConfigWithProps, ``"android"``\> |
| `buildGradle` | `string` |

#### Returns

`string`

#### Defined in

[expo-plugin/withPyTorchCore.ts:69](https://github.com/facebookresearch/playtorch/blob/03b39b6/react-native-pytorch-core/src/expo-plugin/withPyTorchCore.ts#L69)

___

### setProjectRepositories

▸ **setProjectRepositories**(`_config`, `buildGradle`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_config` | `Pick`<ExportedConfigWithProps, ``"android"``\> |
| `buildGradle` | `string` |

#### Returns

`string`

#### Defined in

[expo-plugin/withPyTorchCore.ts:47](https://github.com/facebookresearch/playtorch/blob/03b39b6/react-native-pytorch-core/src/expo-plugin/withPyTorchCore.ts#L47)
