/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {Tensor} from './torch';

type Transform = (tensor: Tensor) => Tensor;

/**
 * Transforms are common image transformations available in the
 * torchvision.transforms module.
 *
 * {@link https://pytorch.org/vision/0.12/transforms.html}
 */
export interface Transforms {
  /**
   * Crops the image Tensor at the center. It is expected to have `[…, H, W]`
   * shape, where `…` means an arbitrary number of leading dimensions. If image
   * size is smaller than output size along any edge, image is padded with 0
   * and then center cropped.
   *
   * {@link https://pytorch.org/vision/0.12/generated/torchvision.transforms.CenterCrop.html}
   *
   * @param size Desired output size of the crop. If size is an int instead of
   * sequence like `(h, w)`, a square crop `(size, size)` is made. If provided
   * a sequence of length 1, it will be interpreted as `(size[0], size[0])`.
   */
  centerCrop(size: number | [number] | [number, number]): Transform;

  /**
   * Normalize a tensor image with mean and standard deviation. Given mean:
   * `(mean[1],...,mean[n])` and std: `(std[1],..,std[n])` for `n` channels,
   * this transform will normalize each channel of the input torch.
   *
   * Tensor i.e., `output[channel] = (input[channel] - mean[channel]) / std[channel]`.
   *
   * {@link https://pytorch.org/vision/0.12/generated/torchvision.transforms.Normalize.html}
   *
   * @param mean Sequence of means for each channel.
   * @param std Sequence of standard deviations for each channel.
   * @param inplace Bool to make this operation in-place.
   */
  normalize(mean: number[], std: number[], inplace?: boolean): Transform;

  /**
   * Resize the input tensor image to the given size. It is expected to have
   * `[…, H, W]` shape, where `…` means an arbitrary number of leading
   * dimensions.
   *
   * {@link https://pytorch.org/vision/0.12/generated/torchvision.transforms.Resize.html}
   *
   * @param size Desired output size. If size is a sequence like `(h, w)`,
   * output size will be matched to this. If size is an int, smaller edge of
   * the image will be matched to this number. i.e, if `height > width`, then
   * image will be rescaled to `(size * height / width, size)`.
   */
  resize(size: number | [number] | [number, number]): Transform;
}

interface Vision {
  transforms: Transforms;
}

type Torchlive = {
  vision: Vision;
};

declare const __torchlive__: Torchlive;

export const vision: Vision = __torchlive__.vision;
