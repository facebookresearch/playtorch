/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';
import {Command} from 'commander';
import AndroidEmulatorDeviceInstaller from '../installers/android/AndroidEmulatorDeviceInstaller';
import AndroidEmulatorSkinsInstaller from '../installers/android/AndroidEmulatorSkinInstaller';
import AndroidSDKInstaller from '../installers/android/AndroidSDKInstaller';
import AndroidSDKManagerInstaller from '../installers/android/AndroidSDKManagerInstaller';
import OpenJDKInstaller from '../installers/android/OpenJDKInstaller';
import HomebrewInstaller from '../installers/HomebrewInstaller';
import {IInstallerTask} from '../installers/IInstaller';
import NodeInstaller from '../installers/NodeInstaller';
import WatchmanInstaller from '../installers/WatchmanInstaller';
import YarnInstaller from '../installers/YarnInstaller';
import {print as printHeader} from '../utils/header';
import {runTasks} from '../utils/TaskUtils';

const setUpDev = async (): Promise<void> => {
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
    new AndroidEmulatorSkinsInstaller(),
  ];

  await runTasks(tasks);
};

export function makeSetUpDevCommand() {
  return new Command('setup-dev')
    .description('set up development dependencies')
    .action(setUpDev);
}
