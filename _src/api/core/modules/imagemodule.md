---
id: "imagemodule"
title: "Module: ImageModule"
sidebar_label: "ImageModule"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [Image](../interfaces/imagemodule.image.md)

## Variables

### ImageUtil

• `Const` **ImageUtil**: `Object`

The [ImageUtil](imagemodule.md#imageutil) object provides functions to load an [Image](../interfaces/imagemodule.image.md) either from
a URL or load an image that is bundled with the React Native app bundle. The
returned Image object can the then be used to run model inference or it can
be drawn on a canvas.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromBundle` | (`imagePath`: `number`) => `Promise`<[Image](../interfaces/imagemodule.image.md)\> |
| `fromFile` | (`path`: `string`) => `Promise`<[Image](../interfaces/imagemodule.image.md)\> |
| `fromImageData` | (`imageData`: [ImageData](../interfaces/canvasview.imagedata.md)) => `Promise`<[Image](../interfaces/imagemodule.image.md)\> |
| `fromJSRef` | (`imageRef`: [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md)) => [Image](../interfaces/imagemodule.image.md) |
| `fromURL` | (`url`: `string`) => `Promise`<[Image](../interfaces/imagemodule.image.md)\> |
| `release` | (`image`: [Image](../interfaces/imagemodule.image.md)) => `Promise`<void\> |
| `toFile` | (`image`: [Image](../interfaces/imagemodule.image.md)) => `Promise`<string\> |

#### Defined in

[ImageModule.ts:142](https://github.com/facebookresearch/playtorch/blob/3e9c98e/react-native-pytorch-core/src/ImageModule.ts#L142)

## Functions

### wrapRef

▸ `Const` **wrapRef**(`ref`): [Image](../interfaces/imagemodule.image.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | [NativeJSRef](../interfaces/nativejsref.nativejsref-1.md) |

#### Returns

[Image](../interfaces/imagemodule.image.md)

#### Defined in

[ImageModule.ts:97](https://github.com/facebookresearch/playtorch/blob/3e9c98e/react-native-pytorch-core/src/ImageModule.ts#L97)
