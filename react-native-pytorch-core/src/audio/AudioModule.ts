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
  /**
   * Records an audio of a specific time duration.
   *
   * ```typescript
   * const audio: Audio = await AudioUtil.record(5);
   * ```
   *
   * @param length Time duration of the audio in seconds.
   * @returns A promise resolving into an [[Audio]]..
   */
  async record(length: number): Promise<Audio> {
    const ref: NativeJSRef = await AudioModule.record(length);
    return wrapRef(ref);
  },

  /**
   * Saves an audio to a file.
   *
   * ```typescript
   * const path: string = await AudioUtil.toFile(audio);
   * ```
   *
   * @param audio Audio to save.
   * @returns path Path to the audio file.
   */
  async toFile(audio: Audio): Promise<string> {
    return await AudioModule.toFile(audio);
  },

  /**
   * The `fromFile` function loads an [[Audio]] at the filepath (e.g., stored
   * on the file system).
   *
   * ```typescript
   * const audio: Audio = await AudioUtil.fromFile('/data/0/pytorch/audio.wav');
   * ```
   *
   * @param filePath The file path to the audio.
   * @returns A promise resolving into an [[Audio]].
   */
  async fromFile(filePath: string): Promise<Audio> {
    const ref: NativeJSRef = await AudioModule.fromFile(filePath);
    return wrapRef(ref);
  },
};
