/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {getSDKPath, isPackageInstalled} from '../../android/AndroidSDK';
import {TaskContext} from '../../task/Task';
import {execCommand, isMacOS, spawnCommand} from '../../utils/SystemUtils';
import {IInstallerTask, getInstallerErrorMitigationMessage} from '../IInstaller';
import AbstractAndroidCommandLineTools from './AbstractAndroidCommandLineTools';

export default class AndroidSDKManagerInstaller
  extends AbstractAndroidCommandLineTools
  implements IInstallerTask {
  constructor() {
    super('tools/bin/sdkmanager');
  }

  isValid(): boolean {
    return isMacOS();
  }

  getDescription(): string {
    return 'Android SDK Manager';
  }

  isInstalled(): boolean {
    const sdkPath = getSDKPath();
    return (
      sdkPath != null &&
      fs.existsSync(path.join(sdkPath, 'tools')) &&
      fs.existsSync(path.join(sdkPath, 'platform-tools')) &&
      fs.existsSync(path.join(sdkPath, 'emulator')) &&
      isPackageInstalled('emulator') &&
      isPackageInstalled('platform-tools') &&
      isPackageInstalled('platforms;android-29') &&
      isPackageInstalled('system-images;android-29;google_apis;x86_64')
    );
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(
      this,
      'https://developer.android.com/studio',
    );
  }

  async run(context: TaskContext): Promise<void> {
    const sdkPath = getSDKPath();
    const cltPath = this.getCommandLineToolPath();

    context.update('Setting up ~/.android/repositories.cfg');

    const androidPath = path.join(os.homedir(), '.android');
    const repositoriesPath = path.join(androidPath, 'repositories.cfg');
    fs.writeFileSync(
      repositoriesPath,
      '### User Sources for Android SDK Manager',
      {encoding: 'utf-8'},
    );

    context.update('Accepting licenses');

    const licensesCmd = `yes | ${cltPath} --licenses`;
    execCommand(context, licensesCmd);

    context.update('Installing platform-tools and emulator');

    await spawnCommand(context, cltPath, [
      `--sdk_root=${sdkPath}`,
      'platform-tools',
      'emulator',
    ]);

    context.update('Installing platforms;android-29');

    await spawnCommand(context, cltPath, [
      `--sdk_root=${sdkPath}`,
      'platforms;android-29',
    ]);

    context.update('Installing system-images;android-29;google_apis;x86_64');

    await spawnCommand(context, cltPath, [
      `--sdk_root=${sdkPath}`,
      'system-images;android-29;google_apis;x86_64',
    ]);
  }
}
