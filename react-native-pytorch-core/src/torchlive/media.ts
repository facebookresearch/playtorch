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

export interface Blob {
  arrayBuffer(): Uint8Array;
}

interface Media {
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
