/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';
import {existsSync} from 'fs';
import {isMacOS} from '../utils/SystemUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';

export function getJDKPath(): string | null {
  if (isMacOS() && isCommandInstalled('brew')) {
    const jdkPath = execSync('brew --prefix openjdk@8', {
      encoding: 'utf-8',
    }).trim();
    if (existsSync(jdkPath)) {
      return jdkPath;
    }
  }
  return null;
}

export function hasJDKPath(): boolean {
  return getJDKPath() !== null;
}
