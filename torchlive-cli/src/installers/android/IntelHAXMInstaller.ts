/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';
import {TaskContext} from '../../task/Task';
import {isMacOS} from '../../utils/SystemUtils';
import {executeCommandForTask} from '../../utils/TaskUtils';
import {IInstallerTask} from '../IInstaller';

export default class IntelHAXMInstaller implements IInstallerTask {
  getDescription(): string {
    return 'Intel HAXM';
  }

  isValid(): boolean {
    if (isMacOS()) {
      const result = execSync(
        'kextstat | grep intel &> /dev/null && echo 1 || echo 0',
        {encoding: 'utf8'},
      );
      return result.trim() === '0';
    }
    return false;
  }

  isInstalled(): boolean {
    return false;
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', [
      'install',
      '--cask',
      'intel-haxm',
    ]);
  }
}
