/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import * as FileSystem from 'expo-file-system';
import {DownloadProgressData} from 'expo-file-system';
import {ModelInfo} from 'react-native-pytorch-core';

const FILE_SCHEME = 'file://';

export const modelsDir = FileSystem.cacheDirectory + 'models/';

/**
 * Create a file Uri for a model. The model id can be the model name.
 *
 * @param modelId Model name (e.g., ResNet 18)
 * @param temp Adds a ".tmp" extension to the Uri when true
 * @returns A model file Uri relative to the cache directory + 'models/'
 */
const modelsFileUri = (modelId: string, temp?: boolean) => {
  // Replace any white-space with an underscore because the
  // torch.jit._loadForMobile does not support it
  const partiallySanitizedModelId = modelId.replace(/\s/g, '_');
  return (
    modelsDir + `model_${partiallySanitizedModelId}.ptl${temp ? '.tmp' : ''}`
  );
};

// Checks if models directory exists. If not, create it
async function ensureDirExists(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(modelsDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(modelsDir, {intermediates: true});
  }
}

function getFilePath(uri: string): string {
  if (uri.startsWith(FILE_SCHEME)) {
    return uri.substring(FILE_SCHEME.length, uri.length);
  }
  return uri;
}

export type ModelDownload = {
  waitToComplete(): Promise<string>;
  cancel(): Promise<void>;
};

/**
 * Checks if the model is available on the local file system.
 *
 * @param modelInfo The model info for the model
 * @returns True if the model is available on the local file system, otherwise
 * returns false
 */
export async function isModelAvailable(modelInfo: ModelInfo) {
  const modelId = modelInfo.name;
  const modelUri = modelsFileUri(modelId);
  const fileInfo = await FileSystem.getInfoAsync(modelUri);
  // Model file exists on local filesystem if true
  return fileInfo.exists;
}

export async function downloadModel(
  modelInfo: ModelInfo,
  callback: (downloadProgress: DownloadProgressData) => void,
): Promise<ModelDownload | null> {
  if (typeof modelInfo.model !== 'string') {
    return null;
  }

  const modelId = modelInfo.name;
  const modelUri = modelsFileUri(modelId);

  const fileInfo = await FileSystem.getInfoAsync(modelUri);
  // Model file exists on local filesystem. Return file from local filesystem
  // instead of downloading it.
  if (fileInfo.exists) {
    return {
      async waitToComplete(): Promise<string> {
        const {uri} = fileInfo;
        return getFilePath(uri);
      },
      async cancel() {},
    };
  }

  await ensureDirExists();

  const tempModelUri = modelsFileUri(modelId, true);

  const downloadResumable = FileSystem.createDownloadResumable(
    modelInfo.model,
    tempModelUri,
    {},
    callback,
  );

  const waitPromise = new Promise<string>(async (resolve, reject) => {
    const result = await downloadResumable.downloadAsync();
    try {
      if (result != null) {
        const {uri} = result;
        await FileSystem.moveAsync({from: uri, to: modelUri});
        const filePath = getFilePath(modelUri);
        resolve(filePath);
      }
    } catch (e) {
      reject(e);
    }
  });

  return {
    async cancel() {
      await downloadResumable.cancelAsync();
      // Try to clean up temp file on cancel
      const tempFileInfo = await FileSystem.getInfoAsync(tempModelUri);
      if (tempFileInfo.exists) {
        await FileSystem.deleteAsync(tempFileInfo.uri);
      }
    },
    async waitToComplete() {
      return waitPromise;
    },
  };
}
