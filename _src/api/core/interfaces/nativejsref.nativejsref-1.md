---
id: "nativejsref.nativejsref-1"
title: "Interface: NativeJSRef"
sidebar_label: "NativeJSRef"
custom_edit_url: null
---

[NativeJSRef](../modules/nativejsref.md).NativeJSRef

## Hierarchy

- **NativeJSRef**

  ↳ [ImageData](canvasview.imagedata.md)

  ↳ [Image](imagemodule.image.md)

  ↳ [Audio](audio_audiomodule.audio.md)

## Properties

### ID

• **ID**: `string`

The internal ID for the object instance in native. Instead of serializing
the object in native and sending it via the React Native Bridge, each
native object will be assigned an ID which is sent to JavaScript instead.
The ID will be used to reference the native object instance when calling
functions on the JavaScript object.

#### Defined in

[NativeJSRef.ts:64](https://github.com/pytorch/live/blob/6d24853/react-native-pytorch-core/src/NativeJSRef.ts#L64)
