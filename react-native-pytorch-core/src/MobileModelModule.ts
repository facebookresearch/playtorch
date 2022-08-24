/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeModules} from 'react-native';
import {getModelUri, ModelPath} from './Models';

const {PyTorchCoreModelLoaderModule: ModelLoaderModule} = NativeModules;

export interface ModelResultMetrics {
  /**
   * The pack time, model inference time, and unpack time in milliseconds.
   */
  totalTime: number;
  /**
   * The model inference time in milliseconds.
   */
  inferenceTime: number;
  /**
   * The pack time in milliseconds.
   */
  packTime: number;
  /**
   * The unpack time in milliseconds.
   */
  unpackTime: number;
}

/**
 * @packageDocumentation
 *
 * The `MobileModel` is the core module providing functions to run model
 * inference and preload models.
 */
export interface MobileModel {
  /**
   * Download a model to the local file system and return the local file path
   * as a model. If the model path is a file path already, it will return the
   * same path as a result.
   *
   * @param modelPath The model path as require or uri (i.e., `require`).
   *
   * @deprecated Use third-party file downloader (e.g., expo-file-system or react-native-fs)
   */
  download(modelPath: ModelPath): Promise<string>;
}

export const MobileModel: MobileModel = {
  async download(modelPath: ModelPath): Promise<string> {
    const uri = getModelUri(modelPath);
    return await ModelLoaderModule.download(uri);
  },
};
