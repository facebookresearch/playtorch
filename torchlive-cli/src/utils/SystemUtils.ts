/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {exec, execSync, spawn} from 'child_process';
import {getJDKPath} from '../android/JDK';
import {getSDKPath} from '../android/AndroidSDK';
import {TaskContext} from '../task/Task';
import execa from 'execa';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const platform: string = os.platform();

export function isMacOS(): boolean {
  return os.platform() === 'darwin';
}

export function isLinux(): boolean {
  return os.platform() === 'linux';
}

export function isWindows(): boolean {
  return os.platform() === 'win32';
}

function addToEnvPath(
  env: NodeJS.ProcessEnv,
  paths: string[],
  binPath: string,
): void {
  if (fs.existsSync(binPath)) {
    if (!env.PATH.includes(binPath)) {
      paths.push(binPath);
    }
  }
}

export function getEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
  };
  const paths = [];

  addToEnvPath(env, paths, `${os.homedir()}/.yarn/bin`);
  addToEnvPath(
    env,
    paths,
    `${os.homedir()}/.config/yarn/global/node_modules/.bin`,
  );

  const jdkPath = getJDKPath();
  if (jdkPath !== null) {
    env.JAVA_HOME = jdkPath;
    paths.push(path.join(jdkPath, 'bin'));
  }

  const androidSDKPath = getSDKPath();
  if (androidSDKPath !== null) {
    env.ANDROID_HOME = androidSDKPath;
    env.ANDROID_SDK_ROOT = androidSDKPath;
    paths.push(
      path.join(androidSDKPath, 'platform-tools'),
      path.join(androidSDKPath, 'emulator'),
      path.join(androidSDKPath, 'tools'),
      path.join(androidSDKPath, 'tools/bin'),
    );
  }

  paths.push(process.env.PATH);

  return {
    ...env,
    PATH: paths.join(path.delimiter),
  };
}

export function spawnCommand(
  context: TaskContext,
  cmd: string,
  args: Array<string>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(cmd, args, {
      env: getEnv(),
    });

    childProcess.stdout?.on('data', data => {
      context.update(String(data).trim());
    });

    childProcess.on('error', error => {
      console.error('error', error);
      reject(error);
    });

    childProcess.on('close', () => {
      resolve();
    });
  });
}

export function execCommand(context: TaskContext, cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = exec(
      cmd,
      {
        env: getEnv(),
      },
      error => {
        if (error != null) {
          reject(error);
          return;
        }
        resolve();
      },
    );

    childProcess.stdout?.on('data', data => {
      context.update(String(data).trim());
    });
  });
}

export function execCommandSync(cmd: string): string {
  return execSync(cmd, {
    encoding: 'utf8',
    env: getEnv(),
  }).trim();
}

export function execaCommandSync(
  cmd: string,
  args?: readonly string[],
): string {
  return execa
    .sync(cmd, args, {
      encoding: 'utf8',
      env: getEnv(),
      all: true,
    })
    .stdout.trim();
}
