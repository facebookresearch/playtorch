/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {spawn} from 'child_process';
import {Command} from 'commander';
import {getEmulatorPath} from '../android/AndroidSDK';
import {TaskContext} from '../task/Task';
import {execCommandSync, getEnv, spawnCommand} from '../utils/SystemUtils';
import {executeCommandForTask} from '../utils/TaskUtils';
import {AndroidVirtualDeviceName} from '../utils/ToolingUtils';

const sleep = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

type RunAndroidOptions = {
  name: string;
};

function isDeviceConnected(): Promise<boolean> {
  return new Promise(resolve => {
    // TODO(T90269321) Change check if device is connected
    const result = execCommandSync('adb devices').split('\n');
    resolve(result.length > 1);
  });
}

function waitForDevice(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const adbProcess = spawn('adb', ['wait-for-device'], {
      env: getEnv(),
    });

    adbProcess.on('exit', code => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve();
    });
  });
}

function waitForSysBootCompleted(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    while (true) {
      const isBootCompleted =
        execCommandSync('adb shell getprop sys.boot_completed') === '1';
      if (isBootCompleted) {
        resolve();
        break;
      }
      await sleep(2000);
    }
  });
}

async function bootAndWaitForDevice(context: TaskContext, avdName: string) {
  // Don't await this command or otherwise it won't continue with the following
  // calls to wait for device and sysboot completed.
  spawnCommand(context, getEmulatorPath(), ['-avd', avdName]);
  await waitForDevice();
  await waitForSysBootCompleted();
}

async function runYarnAndroid(context: TaskContext): Promise<void> {
  executeCommandForTask(context, 'yarn', ['android']);
}

const runAndroid = async (options: RunAndroidOptions): Promise<void> => {
  const context: TaskContext = {
    ctx: undefined,
    task: undefined,
    update: (message: string) => {
      console.log(message);
    },
  };

  if (!(await isDeviceConnected())) {
    // Boot Android virtual device and wait for the device to be ready.
    await bootAndWaitForDevice(context, options.name);
  }

  // Build app and deploy on to virtual device (and/or connected physical
  // device).
  await runYarnAndroid(context);
};

export function makeRunAndroidCommand() {
  return new Command('run-android')
    .description('run project on android')
    .option(
      '-n, --name [name]',
      `avd name [${AndroidVirtualDeviceName}]`,
      AndroidVirtualDeviceName,
    )
    .action(runAndroid);
}
