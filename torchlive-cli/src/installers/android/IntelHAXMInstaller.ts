/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
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
import {
  IInstallerTask,
  getInstallerErrorMitigationMessage,
} from '../IInstaller';

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
    return getInstallerErrorMitigationMessage(
      this,
      'https://github.com/intel/haxm',
    );
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', [
      'install',
      '--cask',
      'intel-haxm',
    ]);
  }
}
