/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  NativeModules,
  Image,
  ImageResolvedAssetSource,
  ImageRequireSource,
} from 'react-native';

const {resolveAssetSource} = Image;

const {PyTorchCoreMobileModelModule: MobileModelModule} = NativeModules;

const MODEL_PATH_CACHE: {[key: number]: ImageResolvedAssetSource} = {};

const getModelAssetSource = (
  modelPath: ImageRequireSource,
): ImageResolvedAssetSource => {
  let source = MODEL_PATH_CACHE[modelPath];
  if (source == null) {
    source = resolveAssetSource(modelPath);
    MODEL_PATH_CACHE[modelPath] = source;
  }
  return source;
};

export const MobileModel = {
  getModelAssetSource,
  async preload(modelPath: ImageRequireSource): Promise<void> {
    const source = getModelAssetSource(modelPath);
    return await MobileModelModule.preload(source.uri);
  },
  async execute(modelPath: ImageRequireSource, data: any): Promise<any> {
    const source = getModelAssetSource(modelPath);
    return await MobileModelModule.execute(source.uri, data);
  },
};
