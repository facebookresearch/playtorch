/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';

export const AndroidVirtualDeviceName = 'pytorch_live';

export function isCommandInstalled(
  cmd: string,
  env?: NodeJS.ProcessEnv,
): boolean {
  try {
    execSync(`command -v ${cmd}`, {
      env,
      encoding: 'utf-8',
    });
    return true;
  } catch (err) {
    return false;
  }
}
