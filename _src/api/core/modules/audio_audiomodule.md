---
id: "audio_audiomodule"
title: "Module: audio/AudioModule"
sidebar_label: "audio/AudioModule"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [Audio](../interfaces/audio_audiomodule.audio.md)

## Variables

### AudioUtil

• `Const` **AudioUtil**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromFile` | (`filePath`: `string`) => `Promise`<[Audio](../interfaces/audio_audiomodule.audio.md)\> |
| `record` | (`length`: `number`) => `Promise`<[Audio](../interfaces/audio_audiomodule.audio.md)\> |
| `toFile` | (`audio`: [Audio](../interfaces/audio_audiomodule.audio.md)) => `Promise`<string\> |

#### Defined in

[audio/AudioModule.ts:29](https://github.com/pytorch/live/blob/885e3bb/react-native-pytorch-core/src/audio/AudioModule.ts#L29)

## Functions

### wrapRef

▸ `Const` **wrapRef**(`ref`): [Audio](../interfaces/audio_audiomodule.audio.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md) |

#### Returns

[Audio](../interfaces/audio_audiomodule.audio.md)

#### Defined in

[audio/AudioModule.ts:22](https://github.com/pytorch/live/blob/885e3bb/react-native-pytorch-core/src/audio/AudioModule.ts#L22)