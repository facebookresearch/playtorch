---
id: "torchlive_vision.transforms"
title: "Interface: Transforms"
sidebar_label: "Transforms"
custom_edit_url: null
---

[torchlive/vision](../modules/torchlive_vision.md).Transforms

Transforms are common image transformations available in the
torchvision.transforms module.

[https://pytorch.org/vision/0.12/transforms.html](https://pytorch.org/vision/0.12/transforms.html)

## Methods

### centerCrop

▸ **centerCrop**(`size`): `Transform`

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

`Transform`

#### Defined in

[torchlive/vision.ts:33](https://github.com/pytorch/live/blob/32554ae/react-native-pytorch-core/src/torchlive/vision.ts#L33)

___

### normalize

▸ **normalize**(`mean`, `std`, `inplace?`): `Transform`

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

`Transform`

#### Defined in

[torchlive/vision.ts:48](https://github.com/pytorch/live/blob/32554ae/react-native-pytorch-core/src/torchlive/vision.ts#L48)

___

### resize

▸ **resize**(`size`): `Transform`

Resize the input tensor image to the given size. It is expected to have
`[…, H, W]` shape, where `…` means an arbitrary number of leading
dimensions.

[https://pytorch.org/vision/0.12/generated/torchvision.transforms.Resize.html](https://pytorch.org/vision/0.12/generated/torchvision.transforms.Resize.html)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` \| [`number`] \| [`number`, `number`] | Desired output size. If size is a sequence like `(h, w)`, output size will be matched to this. If size is an int, smaller edge of the image will be matched to this number. i.e, if `height > width`, then image will be rescaled to `(size * height / width, size)`. |

#### Returns

`Transform`

#### Defined in

[torchlive/vision.ts:62](https://github.com/pytorch/live/blob/32554ae/react-native-pytorch-core/src/torchlive/vision.ts#L62)
