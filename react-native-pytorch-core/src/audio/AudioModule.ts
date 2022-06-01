/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeModules} from 'react-native';
import {NativeJSRef, toPlainNativeJSRef} from '../NativeJSRef';

const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

const {PyTorchCoreAudioModule: AudioModule} = NativeModules;

export interface Audio extends NativeJSRef {
  /**
   * Play an audio.
   */
  play(): void;

  /**
   * Pause an audio.
   */
  pause(): void;

  /**
   * Stop the current playing audio.
   */
  stop(): void;

  /**
   * Get the duration of an audio in ms.
   */
  getDuration(): number;

  /**
   * Until explicitly released, an [[Audio]] will have a reference in memory.
   * Not calling [[Audio.release]] can eventually result in an
   * `OutOfMemoryException`.
   *
   * :::caution
   *
   * While this is an `async` function, it does not need to be `await`ed. For
   * example, the `GC` on Android will eventually free the allocated memory.
   *
   * :::
   */
  release(): Promise<void>;
}

export const wrapRef = (ref: NativeJSRef): Audio => ({
  ...ref,
  play(): void {
    return AudioModule.play(ref);
  },
  pause(): void {
    return AudioModule.pause(ref);
  },
  stop(): void {
    return AudioModule.stop(ref);
  },
  getDuration(): number {
    return AudioModule.getDuration(ref);
  },
  async release(): Promise<void> {
    return await AudioModule.release(ref);
  },
});

export const AudioUtil = {
  /**
   * Returns the native state of audio recording.
   *
   * ```typescript
   * const isRecording = await AudioUtil.isRecording();
   * ```
   */
  isRecording(): Promise<boolean> {
    return AudioModule.isRecording();
  },

  /**
   * Records an audio of a specific time duration.
   *
   * ```typescript
   * AudioUtil.startRecord();
   * ```
   */
  startRecord(): void {
    AudioModule.startRecord();
  },

  /**
   * Stops an active audio recording session.
   *
   * ```typescript
   * const audio: Audio = await AudioUtil.stopRecord();
   * ```
   *
   * @returns A promise resolving into an [[Audio]] or null
   */
  async stopRecord(): Promise<Audio | null> {
    const ref: NativeJSRef = await AudioModule.stopRecord();
    if (ref != null) {
      return wrapRef(ref);
    }
    return null;
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
    // TODO(T122223365) Temporary solution to make the toFile function work
    // with either NativeJSRef audio or true native audio.
    //
    // Without this reassignment of just the image ID, the bridge will
    // eventually throw an error because it can't serialize the the native
    // audio.
    const audioRef = toPlainNativeJSRef(audio);
    return await AudioModule.toFile(audioRef);
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

  /**
   * The `fromBundle` function loads an [[Audio]] that is bundled with the
   * React Native app bundle. The function param is a `require` with a relative
   * path (the path is relative to the file that contains the
   * [[AudioUtil.fromBundle]] call)
   *
   * ```typescript
   * const audioAsset = require('../../assets/audio/audio_file.wav');
   * const audio: Audio = await AudioUtil.fromBundle(audioAsset);
   * ```
   *
   * @param audioPath The audio path (i.e., a `require`).
   * @returns A promise resolving into an [[Audio]].
   */
  async fromBundle(path: number): Promise<Audio> {
    const source = resolveAssetSource(path);
    const ref: NativeJSRef = await AudioModule.fromBundle(source.uri);
    return wrapRef(ref);
  },
};
