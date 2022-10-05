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
import {modelsDir} from '../examples/utils/ModelManager';

const oneMB = 1024 * 1024;
const oneGB = 1024 * oneMB;
const cacheDir = modelsDir;
interface FileInfo {
  size: number;
  uri: string;
}

async function trimCache() {
  try {
    // 1. Calculate the size to free
    const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
    const cacheDirInfo = await FileSystem.getInfoAsync(cacheDir);
    if (!cacheDirInfo.exists) {
      return;
    }
    let sizeToFree = calculateSizeToFree(
      freeDiskStorage,
      cacheDirInfo.size as number,
    );

    if (sizeToFree === 0) {
      return;
    }

    // 2. Recursively tranverse files and get their sizes and modificationTime
    const fileInfoMap = new Map<number, FileInfo>();
    await getFileInfoRecursively(cacheDir, fileInfoMap);

    // 3. Sort it by modificationTime
    const sortedFileInfoMap = new Map([...fileInfoMap].sort());

    // 4. Delete the LRU files
    for (const fileInfo of sortedFileInfoMap.values()) {
      sizeToFree -= fileInfo.size;
      await FileSystem.deleteAsync(fileInfo.uri, {idempotent: true});
      if (sizeToFree <= 0) {
        return;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Run trimCache only once
trimCache();

/**
 * If freeDiskSize is larger than 2 GB, trim dir size under 1 GB.
 * If freeDiskSize is not larger than 2 GB, trim dir size under 500 MB.
 */
function calculateSizeToFree(
  freeDiskSize: number,
  currentDirSize: number,
): number {
  if (freeDiskSize > 2 * oneGB) {
    return Math.max(currentDirSize - oneGB, 0);
  }
  return Math.max(currentDirSize - 500 * oneMB, 0);
}

async function getFileInfoRecursively(
  fileUri: string,
  fileInfoMap: Map<number, FileInfo>,
) {
  const fileNames = await FileSystem.readDirectoryAsync(fileUri);
  for (const fileName of fileNames) {
    const filePath = fileUri + fileName;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.isDirectory) {
      await getFileInfoRecursively(filePath + '/', fileInfoMap);
    } else if (fileInfo.exists) {
      fileInfoMap.set(fileInfo.modificationTime, {
        size: fileInfo.size,
        uri: fileInfo.uri,
      });
    }
  }
}
