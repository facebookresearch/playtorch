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

type ModelLoader = {
  /**
   * Download a model to the local file system and return the local file path
   * as a model. If the model path is a file path already, it will return the
   * same path as a result.
   *
   * @param modelPath The model path as require or uri (i.e., `require`).
   */
  download(modelPath: ModelPath): Promise<string>;
};

export const ModelLoader: ModelLoader = {
  async download(modelPath: ModelPath): Promise<string> {
    const uri = getModelUri(modelPath);
    return await ModelLoaderModule.download(uri);
  },
};
