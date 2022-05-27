/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {Tensor} from 'react-native-pytorch-core';
import type {NativeJSRef} from '../NativeJSRef';
import type {Image} from '../ImageModule';

export interface Blob {
  /**
   * The `arrayBuffer()` function returns a `Promise` that resolves with the
   * contents of the blob as binary data contained in an ArrayBuffer.
   */
  arrayBuffer(): Promise<Uint8Array>;
  /**
   * The Blob interface's size property returns the size of the Blob in bytes.
   */
  readonly size: number;
}

interface Media {
  /**
   * Converts a [[Blob]] into an [[Image]]. The blob should be in RGB format.
   * The width and height input should match the blob size.
   * i.e. `blob.getDirectSize()` equals `width * height * 3`.
   *
   * @param blob [[Blob]] to turn into an [[Image]].
   * @param width The width of the image.
   * @param heigth The height of the image.
   * @returns An [[Image]] object created from the [[Blob]].
   */
  imageFromBlob(blob: Blob, width: number, height: number): Image;

  /**
   * Converts a [[Tensor]] into an [[Image]]. The tensor should be in CHW (channels,
   * height, width) format, with uint8 type.
   *
   * @param tensor [[Tensor]] to turn into an [[Image]].
   * @returns An [[Image]] object created from the [[Tensor]].
   */
  imageFromTensor(tensor: Tensor): Image;

  /**
   * Converts a [[Tensor]] or [[NativeJSRef]] into a [[Blob]]. The blob can be
   * used to create a [[Tensor]] object or convert into a [[NativeJSRef]] like
   * an image or audio.
   *
   * @param obj Object to turn into a [[Blob]].
   */
  toBlob(obj: Tensor | NativeJSRef): Blob;
}

type Torchlive = {
  media: Media;
};

declare const __torchlive__: Torchlive;

export const media: Media = __torchlive__.media;
