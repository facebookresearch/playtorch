/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Zip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import {getDefaultSDKPath, getSDKPath} from '../../android/AndroidSDK';
import {TaskContext} from '../../task/Task';
import {downloadFile} from '../../utils/FileUtils';
import {execCommand, isLinux, isMacOS, platform} from '../../utils/SystemUtils';
import {IInstallerTask} from '../IInstaller';

export default class AndroidSDKInstaller implements IInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getDescription(): string {
    return 'Android SDK';
  }

  isInstalled(): boolean {
    const sdkPath = getSDKPath();
    if (sdkPath !== null) {
      return fs.existsSync(path.join(sdkPath, 'tools/bin/sdkmanager'));
    }
    return false;
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    context.update('Installing cmdline-tools');
    const cltPath = await this.downloadCommandLineTools();
    const sdkManager = path.join(cltPath, 'cmdline-tools/bin/sdkmanager');

    const sdkRoot = getDefaultSDKPath();
    const basicsCmd = `yes | ${sdkManager} --sdk_root=${sdkRoot} "tools"`;
    await execCommand(context, basicsCmd);
    context.update(`Installed ${this.getDescription()}`);
  }

  private downloadCommandLineTools(): Promise<string> {
    return new Promise((resolve, reject) => {
      let type: string;
      if (isMacOS()) {
        type = 'mac';
      } else if (isLinux()) {
        type = 'linux';
      } else {
        throw new Error(`platform ${platform} unsupported`);
      }

      const url = `https://dl.google.com/android/repository/commandlinetools-${type}-6858069_latest.zip`;

      tmp.dir((err, dirPath, _dirCleanupCallback) => {
        if (err) {
          reject(err);
          return;
        }
        tmp.file(async (err, filePath, _fd, cleanupCallback) => {
          if (err) {
            reject(err);
            return;
          }
          await downloadFile(url, filePath);
          const zip = new Zip(filePath);
          zip.extractAllTo(dirPath, true);

          // If we don't need the file anymore we could manually call the cleanupCallback
          // But that is not necessary if we didn't pass the keep option because the library
          // will clean after itself.
          cleanupCallback();
          resolve(dirPath);
        });
      });
    });
  }
}
