/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {SemVer} from 'semver';
import {IExecutable} from './IExecutable';

export interface ICommand extends IExecutable {
  command: string;
  isInstalled(): boolean;
  isVersionless(): boolean;
  getVersion(): SemVer;
  getPath(): string;
}
