/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import semver, {SemVer} from 'semver';
import {createCommand} from '../utils/CommandUtils';
import {ICommand} from './ICommand';

const command = createCommand('python3', {getVersion}) as ICommand;

function getVersion(): SemVer {
  let rawVersion = command.execute(['--version']);
  const matches = rawVersion.match(/Python\s([\d.]+)/);
  if (matches !== null && matches.length > 1) {
    rawVersion = matches[1];
  }
  return semver.parse(rawVersion);
}

export default command;
