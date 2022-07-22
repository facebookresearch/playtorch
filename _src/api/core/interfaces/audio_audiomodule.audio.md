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

[NativeJSRef.ts:64](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/NativeJSRef.ts#L64)

## Methods

### getDuration

▸ **getDuration**(): `number`

Get the duration of an audio in ms.

#### Returns

`number`

#### Defined in

[audio/AudioModule.ts:36](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/audio/AudioModule.ts#L36)

___

### pause

▸ **pause**(): `void`

Pause an audio.

#### Returns

`void`

#### Defined in

[audio/AudioModule.ts:26](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/audio/AudioModule.ts#L26)

___

### play

▸ **play**(): `void`

Play an audio.

#### Returns

`void`

#### Defined in

[audio/AudioModule.ts:21](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/audio/AudioModule.ts#L21)

___

### release

▸ **release**(): `Promise`<void\>

Until explicitly released, an [Audio](audio_audiomodule.audio.md) will have a reference in memory.
Not calling [Audio.release](audio_audiomodule.audio.md#release) can eventually result in an
`OutOfMemoryException`.

:::caution

While this is an `async` function, it does not need to be `await`ed. For
example, the `GC` on Android will eventually free the allocated memory.

:::

#### Returns

`Promise`<void\>

#### Defined in

[audio/AudioModule.ts:50](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/audio/AudioModule.ts#L50)

___

### stop

▸ **stop**(): `void`

Stop the current playing audio.

#### Returns

`void`

#### Defined in

[audio/AudioModule.ts:31](https://github.com/facebookresearch/playtorch/blob/dd7be06/react-native-pytorch-core/src/audio/AudioModule.ts#L31)
