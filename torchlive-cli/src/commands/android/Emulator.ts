/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import semver, {SemVer} from 'semver';
import {getEmulatorPath} from '../../android/AndroidSDK';
import {createCommand} from '../../utils/CommandUtils';
import {ICommand} from '../ICommand';

const command = createCommand('emulator', {
  getVersion,
  getPath: getEmulatorPath,
});

function getVersion(): SemVer {
  let rawVersion = command.execute(['-version']);
  const matches = rawVersion.match(/version\s([\d.]*)\s/);
  if (matches !== null && matches.length > 1) {
    return semver.coerce(matches[1]);
  }
  return semver.parse(rawVersion);
}

export default command as ICommand;
