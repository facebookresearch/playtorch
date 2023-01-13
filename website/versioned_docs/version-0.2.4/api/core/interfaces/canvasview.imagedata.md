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

___

### data

• **data**: `Uint8ClampedArray`

___

### height

• **height**: `number`

___

### width

• **width**: `number`

## Methods

### release

▸ **release**(): `Promise`<void\>

#### Returns

`Promise`<void\>
