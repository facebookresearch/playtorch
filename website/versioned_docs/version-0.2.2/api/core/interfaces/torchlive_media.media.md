---
id: "torchlive_media.media"
title: "Interface: Media"
sidebar_label: "Media"
custom_edit_url: null
---

[torchlive/media](../modules/torchlive_media.md).Media

## Methods

### imageFromBlob

▸ **imageFromBlob**(`blob`, `width`, `height`): [Image](imagemodule.image.md)

**`deprecated`** This function will be removed in the next release. Use `imageFromTensor` instead.
```typescript
const tensor = torch.fromBlob(blob, [imageHeight, imageWidth, channels]);
const image = media.imageFromTensor(tensor);
```

Converts a [Blob](torchlive_media.blob.md) into an [Image](imagemodule.image.md). The blob should be in RGB format.
The width and height input should match the blob size.
i.e. `blob.getDirectSize()` equals `width * height * 3`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blob` | [Blob](torchlive_media.blob.md) | [Blob](torchlive_media.blob.md) to turn into an [Image](imagemodule.image.md). |
| `width` | `number` | The width of the image. |
| `height` | `number` | - |

#### Returns

[Image](imagemodule.image.md)

An [Image](imagemodule.image.md) object created from the [Blob](torchlive_media.blob.md).

___

### imageFromTensor

▸ **imageFromTensor**(`tensor`): [Image](imagemodule.image.md)

Converts a [Tensor](torchlive_torch.tensor.md) into an [Image](imagemodule.image.md). The tensor should be in CHW (channels,
height, width) format, with uint8 type.

There are some assumptions made about the input tensor:
- If the tensor has 4 channels, it is assumed to be RGBA.
- If the tensor has 3 channels, it is assumed to be RGB.
- If the tensor has 1 channel, it is assumed to be grayscale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tensor` | [Tensor](torchlive_torch.tensor.md) | [Tensor](torchlive_torch.tensor.md) to turn into an [Image](imagemodule.image.md). |

#### Returns

[Image](imagemodule.image.md)

An [Image](imagemodule.image.md) object created from the [Tensor](torchlive_torch.tensor.md).

___

### toBlob

▸ **toBlob**(`obj`): [Blob](torchlive_media.blob.md)

Converts a [Tensor](torchlive_torch.tensor.md) or [NativeJSRef](../modules/nativejsref.md) into a [Blob](torchlive_media.blob.md). The blob can be
used to create a [Tensor](torchlive_torch.tensor.md) object or convert into a [NativeJSRef](../modules/nativejsref.md) like
an image or audio.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | [NativeJSRef](nativejsref.nativejsref-1.md) \| [Tensor](torchlive_torch.tensor.md) | Object to turn into a [Blob](torchlive_media.blob.md). |

#### Returns

[Blob](torchlive_media.blob.md)
