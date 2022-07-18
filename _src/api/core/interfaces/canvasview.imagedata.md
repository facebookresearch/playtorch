---
id: "canvasview.imagedata"
title: "Interface: ImageData"
sidebar_label: "ImageData"
custom_edit_url: null
---

[CanvasView](../modules/canvasview.md).ImageData

## Hierarchy

- [NativeJSRef](nativejsref.nativejsref-1.md)

  ↳ **ImageData**

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

[NativeJSRef.ts:64](https://github.com/pytorch/live/blob/966a71c/react-native-pytorch-core/src/NativeJSRef.ts#L64)

___

### data

• **data**: `Uint8ClampedArray`

#### Defined in

[CanvasView.tsx:30](https://github.com/pytorch/live/blob/966a71c/react-native-pytorch-core/src/CanvasView.tsx#L30)

___

### height

• **height**: `number`

#### Defined in

[CanvasView.tsx:29](https://github.com/pytorch/live/blob/966a71c/react-native-pytorch-core/src/CanvasView.tsx#L29)

___

### width

• **width**: `number`

#### Defined in

[CanvasView.tsx:28](https://github.com/pytorch/live/blob/966a71c/react-native-pytorch-core/src/CanvasView.tsx#L28)

## Methods

### release

▸ **release**(): `Promise`<void\>

#### Returns

`Promise`<void\>

#### Defined in

[CanvasView.tsx:31](https://github.com/pytorch/live/blob/966a71c/react-native-pytorch-core/src/CanvasView.tsx#L31)
