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
   * The Blob interface's size property returns the size of the Blob in bytes.
   */
  readonly size: number;
  /**
   * A string indicating the MIME type of the data contained in the Blob.
   * If the type is unknown, this string is empty.
   */
  readonly type: string;

  /**
   * The `arrayBuffer()` function returns a `Promise` that resolves with the
   * contents of the blob as binary data contained in an ArrayBuffer.
   */
  arrayBuffer(): Promise<Uint8Array>;
  /**
   * The `slice() function creates and returns a new [[Blob]] object which contains
   * data from a subset of the blob on which it's called.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice}
   *
   * ```
   * slice()
   * slice(start)
   * slice(start, end)
   * ```
   *
   * @param start An index into the [[Blob]] indicating the first byte to include
   * in the new [[Blob]]. If you specify a negative value, it's treated as an offset
   * from the end of the [[Blob]] toward the beginning. For example, -10 would be
   * the 10th from last byte in the [[Blob]]. The default value is 0.
   * If you specify a value for `start` that is larger than the size of the source
   * [[Blob]], the returned [[Blob]] has size 0 and contains no data.
   * @param end An index into the [[Blob]] indicating the first byte that will *not*
   * be included in the new [[Blob]] (i.e. the byte exactly at this index is not
   * included). If you specify a negative value, it's treated as an offset from
   * the end of the [[Blob]] toward the beginning. For example, -10 would be the 10th
   * from last byte in the [[Blob]]. The default value is `size`.
   * @returns A new [[Blob]] object containing the specified subset of the data contained
   * within the blob on which this method was called. The original blob is not altered.
   */
  slice(start?: number, end?: number): Blob;
}

export interface Media {
  /**
   *
   * @deprecated This function will be removed in the next release. Use `imageFromTensor` instead.
   * ```typescript
   * const tensor = torch.fromBlob(blob, [imageHeight, imageWidth, channels]);
   * const image = media.imageFromTensor(tensor);
   * ```
   *
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
   * There are some assumptions made about the input tensor:
   * - If the tensor has 4 channels, it is assumed to be RGBA.
   * - If the tensor has 3 channels, it is assumed to be RGB.
   * - If the tensor has 1 channel, it is assumed to be grayscale.
   *
   * @param tensor [[Tensor]] to turn into an [[Image]].
   * @returns An [[Image]] object created from the [[Tensor]].
   */
  imageFromTensor(tensor: Tensor): Image;

  /**
   * @experimental This function is experimental and can change.
   *
   * Saves an [[Image]] to a file. The second argument is the local filepath at
   * which the image will be saved. The filepath can be created by using a
   * third-party React Native package like `react-native-fs` (i.e., RNFS).
   *
   * ```typescript
   * const image = await ImageUtil.fromURL('https://example.com/image.jpg');
   * const filepath = media.imageToFile(
   *   image,
   *   RNFS.DownloadDirectoryPath + '/saved_image.png',
   * );
   * image.release();
   * ```
   *
   * The function will throw an error if the [[Image]] couldn't be saved.
   *
   * @param image Image that should be saved to a file.
   * @param filepath The filepath at which the image will be saved.
   * @returns The filepath of the saved image.
   */
  imageToFile(image: Image, filepath: string): string;

  /**
   * @experimental This function is experimental and can change.
   *
   * Loads an [[Image]] from a file. The function will throw an error if the
   * image couldn't be loaded.
   *
   * @param filepath A local file path to an image.
   * @returns An [[Image]] loaded from filepath.
   */
  imageFromFile(filepath: string): Image;

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
