/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {Image} from '../ImageModule';

export interface Blob {}

interface Media {
  /**
   * Converts an [[Image]] into a [[Blob]]. The blob can be used to create a
   * [[Tensor]] object.
   *
   * @param image Image used to retrieve a [[Blob]].
   */
  toBlob(image: Image): Blob;
}

type Torchlive = {
  media: Media;
};

declare const __torchlive__: Torchlive;

export const media: Media = __torchlive__.media;
