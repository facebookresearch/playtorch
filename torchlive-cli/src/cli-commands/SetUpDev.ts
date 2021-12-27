/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Command} from 'commander';
import AndroidEmulatorDeviceInstaller from '../installers/android/AndroidEmulatorDeviceInstaller';
import AndroidSDKInstaller from '../installers/android/AndroidSDKInstaller';
import AndroidSDKManagerInstaller from '../installers/android/AndroidSDKManagerInstaller';
import OpenJDKInstaller from '../installers/android/OpenJDKInstaller';
import HomebrewInstaller from '../installers/HomebrewInstaller';
import {IInstallerTask} from '../installers/IInstaller';
import CocoaPodsInstaller from '../installers/ios/CocoaPodsInstaller';
import NodeInstaller from '../installers/NodeInstaller';
import WatchmanInstaller from '../installers/WatchmanInstaller';
import YarnInstaller from '../installers/YarnInstaller';
import {print as printHeader} from '../utils/header';
import {runTasks} from '../utils/TaskUtils';

type SetupDevOptions = {
  yes: boolean;
  cocoapodsInstaller: string | undefined;
};

const setUpDev = async (options: SetupDevOptions): Promise<void> => {
  printHeader();

  const tasks: Array<IInstallerTask> = [
    new HomebrewInstaller(),
    new OpenJDKInstaller(),
    new WatchmanInstaller(),
    new NodeInstaller(),
    new YarnInstaller(),
    new AndroidSDKInstaller(),
    new AndroidSDKManagerInstaller(),
    new AndroidEmulatorDeviceInstaller(),
    new CocoaPodsInstaller(),
  ];

  await runTasks(tasks, options);
};

export function makeSetUpDevCommand() {
  return new Command('setup-dev')
    .description('set up development dependencies')
    .option('-y, --yes', 'Accept all questions')
    .option(
      '--cocoapods-installer [installer]',
      'CocoaPods Package Installer (gem or homebrew)',
    )
    .action(setUpDev);
}
