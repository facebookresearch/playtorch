/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {getAVDManagerPath} from '../../android/AndroidSDK';
import {createCommand} from '../../utils/CommandUtils';
import {ICommand} from '../ICommand';

export default createCommand('avdmanager', {
  versionless: true,
  getPath: getAVDManagerPath,
}) as ICommand;
