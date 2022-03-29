---
id: "torchlive_torchvision.transforms"
title: "Interface: Transforms"
sidebar_label: "Transforms"
custom_edit_url: null
---

[torchlive/torchvision](../modules/torchlive_torchvision.md).Transforms

Transforms are common image transformations available in the
torchvision.transforms module.

[https://pytorch.org/vision/0.12/transforms.html](https://pytorch.org/vision/0.12/transforms.html)

## Methods

### centerCrop

▸ **centerCrop**(`size`): [Transform](../modules/torchlive_torchvision.md#transform)

Crops the image Tensor at the center. It is expected to have `[…, H, W]`
shape, where `…` means an arbitrary number of leading dimensions. If image
size is smaller than output size along any edge, image is padded with 0
and then center cropped.

[https://pytorch.org/vision/0.12/generated/torchvision.transforms.CenterCrop.html](https://pytorch.org/vision/0.12/generated/torchvision.transforms.CenterCrop.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` \| [`number`] \| [`number`, `number`] | Desired output size of the crop. If size is an int instead of sequence like `(h, w)`, a square crop `(size, size)` is made. If provided a sequence of length 1, it will be interpreted as `(size[0], size[0])`. |

#### Returns

[Transform](../modules/torchlive_torchvision.md#transform)

#### Defined in

[torchlive/torchvision.ts:42](https://github.com/pytorch/live/blob/2ea8b9e/react-native-pytorch-core/src/torchlive/torchvision.ts#L42)

___

### grayscale

▸ **grayscale**(`numOutputChannels?`): [Transform](../modules/torchlive_torchvision.md#transform)

Convert image to grayscale. It is expected to have […, 3, H, W] shape,
where … means an arbitrary number of leading dimensions.

[https://pytorch.org/vision/0.12/generated/torchvision.transforms.Grayscale.html](https://pytorch.org/vision/0.12/generated/torchvision.transforms.Grayscale.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numOutputChannels?` | ``1`` \| ``3`` | Number of channels desired for output image. |

#### Returns

[Transform](../modules/torchlive_torchvision.md#transform)

#### Defined in

[torchlive/torchvision.ts:52](https://github.com/pytorch/live/blob/2ea8b9e/react-native-pytorch-core/src/torchlive/torchvision.ts#L52)

___

### normalize

▸ **normalize**(`mean`, `std`, `inplace?`): [Transform](../modules/torchlive_torchvision.md#transform)

Normalize a tensor image with mean and standard deviation. Given mean:
`(mean[1],...,mean[n])` and std: `(std[1],..,std[n])` for `n` channels,
this transform will normalize each channel of the input torch.

Tensor i.e., `output[channel] = (input[channel] - mean[channel]) / std[channel]`.

[https://pytorch.org/vision/0.12/generated/torchvision.transforms.Normalize.html](https://pytorch.org/vision/0.12/generated/torchvision.transforms.Normalize.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mean` | `number`[] | Sequence of means for each channel. |
| `std` | `number`[] | Sequence of standard deviations for each channel. |
| `inplace?` | `boolean` | Bool to make this operation in-place. |

#### Returns

[Transform](../modules/torchlive_torchvision.md#transform)

#### Defined in

[torchlive/torchvision.ts:67](https://github.com/pytorch/live/blob/2ea8b9e/react-native-pytorch-core/src/torchlive/torchvision.ts#L67)

___

### resize

▸ **resize**(`size`, `interpolation?`, `maxSize?`, `antialias?`): [Transform](../modules/torchlive_torchvision.md#transform)

Resize the input tensor image to the given size. It is expected to have
`[…, H, W]` shape, where `…` means an arbitrary number of leading
dimensions.

[https://pytorch.org/vision/0.12/generated/torchvision.transforms.Resize.html](https://pytorch.org/vision/0.12/generated/torchvision.transforms.Resize.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` \| [`number`] \| [`number`, `number`] | Desired output size. If size is a sequence like `(h, w)`, output size will be matched to this. If size is an int, smaller edge of the image will be matched to this number. i.e, if `height > width`, then image will be rescaled to `(size * height / width, size)`. |
| `interpolation?` | `InterpolationMode` | Desired interpolation enum. |
| `maxSize?` | `number` | The maximum allowed for the longer edge of the resized image. |
| `antialias?` | `boolean` | Antialias flag. The flag is false by default and can be set to true for InterpolationMode.BILINEAR only mode. |

#### Returns

[Transform](../modules/torchlive_torchvision.md#transform)

#### Defined in

[torchlive/torchvision.ts:86](https://github.com/pytorch/live/blob/2ea8b9e/react-native-pytorch-core/src/torchlive/torchvision.ts#L86)
