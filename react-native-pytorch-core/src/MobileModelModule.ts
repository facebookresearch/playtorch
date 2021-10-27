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

/**
 * Cache for previously resolved model paths (i.e., asset sources).
 */
const MODEL_PATH_CACHE: {[key: number]: ImageResolvedAssetSource} = {};

/**
 * Resolves the model asset source. It will first try to find the asset source
 * in the cache if it was previously resolved, otherwise it will use the
 * `resolveAssetSource` provided by the React Native [[Image]].
 *
 * @param modelPath The model path (i.e., a `require`).
 */
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
 * Result of model inference. Each model result has the inference time and the
 * model result. The model result depends on the model and is therefore
 * specified as a generic type (i.e., template).
 *
 * @template T Model result type
 */
export interface ModelResult<T> {
  /**
   * The model result.
   */
  result: T;

  /**
   * The model result metrics, e.g., including inference time in milliseconds.
   */
  metrics: ModelResultMetrics;
}

/**
 * @packageDocumentation
 *
 * The `MobileModel` is the core module providing functions to run model
 * inference and preload models.
 */
export interface MobileModel {
  /**
   * Preload a model. If a model is not preloaded, it will be loaded during the
   * first inference call. However, the first inference time will therefore
   * take significantly longer. This function allows to preload a model ahead
   * of time before running the first inference.
   *
   * @param modelPath The model path (i.e., a `require`).
   */
  preload(modelPath: ImageRequireSource): Promise<void>;

  /**
   * Unload all model. If any model were loaded previously, they will be discarded.
   * This function allows to load a new version of a model without restarting the
   * app.
   */
  unload(): Promise<void>;

  /**
   * Run inference on a model.
   *
   * ```typescript
   * const classificationModel = require('../models/mobilenet_v3_small.ptl');
   *
   * const image: Image = await ImageUtils.fromURL('https://image.url');
   *
   * const { result: {scores} } = await MobileModel.execute(
   *   classificationModel,
   *   {
   *     image,
   *     cropWidth: size,
   *     cropHeight: size,
   *     scaleWidth: 224,
   *     scaleHeight: 224,
   *   }
   * );
   *
   * const idx = argmax(scores);
   * const className = CLASSES[idx];
   * ```
   *
   * @param modelPath The model path (i.e., `require`).
   * @param params The input parameters for the model.
   */
  execute<T>(
    modelPath: ImageRequireSource,
    params: any,
  ): Promise<ModelResult<T>>;
}

export const MobileModel: MobileModel = {
  async preload(modelPath: ImageRequireSource): Promise<void> {
    const source = getModelAssetSource(modelPath);
    return await MobileModelModule.preload(source.uri);
  },
  async unload(): Promise<void> {
    return await MobileModelModule.unload();
  },
  async execute<T>(
    modelPath: ImageRequireSource,
    params: any,
  ): Promise<ModelResult<T>> {
    const source = getModelAssetSource(modelPath);
    return await MobileModelModule.execute(source.uri, params);
  },
};
