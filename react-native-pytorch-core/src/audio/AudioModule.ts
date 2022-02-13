/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeModules} from 'react-native';
import type {NativeJSRef} from '../NativeJSRef';

const {PyTorchCoreAudioModule: AudioModule} = NativeModules;

export interface Audio extends NativeJSRef {
  /**
   * Play an audio.
   */
  play(): void;
}

export const wrapRef = (ref: NativeJSRef): Audio => ({
  ...ref,
  play(): void {
    return AudioModule.play(ref);
  },
});

export const AudioUtil = {
  async record(length: number): Promise<Audio> {
    const ref: NativeJSRef = await AudioModule.record(length);
    return wrapRef(ref);
  },
};
