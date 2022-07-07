/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {Audio} from '../audio/AudioModule';

/**
 * :::caution
 *
 * Experimental functions are subject to change.
 * Avoid using these functions.
 *
 * :::
 */
interface Experimental {
  /**
   * @experimental
   *
   * The `audioFromBytes` function create an [[Audio]] from the PCM byte array.
   *
   * @param bytes The PCM byte array data.
   * @param sampleRate The sample rate of the audio.
   * @returns A promise resolving into an [[Audio]].
   */
  audioFromBytes(bytes: number[], sampleRate: number): Promise<Audio>;
}

type Torchlive = {
  experimental: Experimental;
};

declare const __torchlive__: Torchlive;

export const experimental: Experimental = __torchlive__.experimental;
