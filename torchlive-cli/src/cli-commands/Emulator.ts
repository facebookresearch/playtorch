/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Command} from 'commander';
import {getEmulatorPath} from '../android/AndroidSDK';
import {TaskContext} from '../task/Task';
import {print as printHeader} from '../utils/header';
import {spawnCommand} from '../utils/SystemUtils';
import {AndroidVirtualDeviceName} from '../utils/ToolingUtils';

const runEmulator = async (): Promise<void> => {
  printHeader();

  const context: TaskContext = {
    ctx: undefined,
    task: undefined,
    update: (message: string) => {
      console.log(message);
    },
  };
  spawnCommand(context, getEmulatorPath(), ['-avd', AndroidVirtualDeviceName]);
};

export function makeEmulatorCommand() {
  return new Command('emulator')
    .description('torchlive emulator')
    .action(runEmulator);
}
