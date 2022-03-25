---
id: "audio_audiomodule.audio"
title: "Interface: Audio"
sidebar_label: "Audio"
custom_edit_url: null
---

[audio/AudioModule](../modules/audio_audiomodule.md).Audio

## Hierarchy

- [NativeJSRef](nativejsref.nativejsref-1.md)

  ↳ **Audio**

## Properties

### ID

• **ID**: `string`

The internal ID for the object instance in native. Instead of serializing
the object in native and sending it via the React Native Bridge, each
native object will be assigned an ID which is sent to JavaScript instead.
The ID will be used to reference the native object instance when calling
functions on the JavaScript object.

#### Inherited from

[NativeJSRef](nativejsref.nativejsref-1.md).[ID](nativejsref.nativejsref-1.md#id)

#### Defined in

[NativeJSRef.ts:64](https://github.com/pytorch/live/blob/bb3eb3c/react-native-pytorch-core/src/NativeJSRef.ts#L64)

## Methods

### play

▸ **play**(): `void`

Play an audio.

#### Returns

`void`

#### Defined in

[audio/AudioModule.ts:21](https://github.com/pytorch/live/blob/bb3eb3c/react-native-pytorch-core/src/audio/AudioModule.ts#L21)
