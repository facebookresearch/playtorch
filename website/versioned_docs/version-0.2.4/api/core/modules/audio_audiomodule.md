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
| `fromBundle` | (`path`: `number`) => `Promise`<[Audio](../interfaces/audio_audiomodule.audio.md)\> |
| `fromFile` | (`filePath`: `string`) => `Promise`<[Audio](../interfaces/audio_audiomodule.audio.md)\> |
| `isRecording` | () => `Promise`<boolean\> |
| `startRecord` | () => `void` |
| `stopRecord` | () => `Promise`<``null`` \| [Audio](../interfaces/audio_audiomodule.audio.md)\> |
| `toFile` | (`audio`: [Audio](../interfaces/audio_audiomodule.audio.md)) => `Promise`<string\> |

## Functions

### wrapRef

▸ `Const` **wrapRef**(`ref`): [Audio](../interfaces/audio_audiomodule.audio.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md) |

#### Returns

[Audio](../interfaces/audio_audiomodule.audio.md)
