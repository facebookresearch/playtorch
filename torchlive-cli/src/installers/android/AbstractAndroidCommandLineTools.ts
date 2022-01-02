/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import path from 'path';
import {getSDKPath} from '../../android/AndroidSDK';
import os from 'os';

export default abstract class AbstractAndroidCommandLineTools {
  private commandLineTool: string;

  constructor(commandLineTool: string) {
    this.commandLineTool = commandLineTool;
  }

  getCommandLineToolPath(): string {
    const sdkPath = getSDKPath();
    if (sdkPath === null) {
      throw new Error('no Android SDK found');
    }
    return path.join(sdkPath, this.commandLineTool);
  }

  getAbi(): string {
    return os.cpus()[0].model === 'Apple M1' ? 'arm64-v8a' : 'x86_64';
  }
}
