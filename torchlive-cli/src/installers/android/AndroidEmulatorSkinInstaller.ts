/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fs from 'fs';
import path from 'path';
import {getSkinsPath} from '../../android/AndroidSDK';
import {TaskContext} from '../../task/Task';
import {isMacOS} from '../../utils/SystemUtils';
import {IInstallerTask} from '../IInstaller';

function copyDir(srcDir: string, destDir: string): void {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, {recursive: true});
  }

  const list = fs.readdirSync(srcDir);
  let src: string;
  let dest: string;
  list.forEach(file => {
    src = path.join(srcDir, file);
    dest = path.join(destDir, file);

    const stat = fs.statSync(src);
    if (stat && stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, {recursive: true});
      }
      copyDir(src, dest);
    } else {
      fs.writeFileSync(dest, fs.readFileSync(src));
    }
  });
}

export default class AndroidEmulatorSkinsInstaller implements IInstallerTask {
  private _skins: string[] = ['pixel_4'];

  isValid(): boolean {
    return isMacOS();
  }

  getDescription(): string {
    return 'Android Emulator Skins';
  }

  isInstalled(): boolean {
    const skinsPath = getSkinsPath();
    return this._skins.every(skin => {
      const skinPath = path.join(skinsPath, skin);
      return fs.existsSync(skinPath);
    });
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(_context: TaskContext): Promise<void> {
    const skinsPath = getSkinsPath();
    this._skins.forEach(skin => {
      const skinPath = path.join(skinsPath, skin);
      if (!fs.existsSync(skinPath)) {
        const bundleSkinPath = path.join(
          __dirname,
          '../../../assets/android/sdk/skins',
          skin,
        );
        copyDir(bundleSkinPath, skinPath);
      }
    });
  }
}
