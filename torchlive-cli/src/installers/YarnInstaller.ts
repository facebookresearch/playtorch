/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {ICommand} from '../commands/ICommand';
import yarn from '../commands/Yarn';
import {TaskContext} from '../task/Task';
import {isMacOS} from '../utils/SystemUtils';
import {executeCommandForTask} from '../utils/TaskUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ICommandInstallerTask} from './IInstaller';

export default class YarnInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return yarn;
  }

  getDescription(): string {
    return 'Yarn';
  }

  isInstalled(): boolean {
    return isCommandInstalled('yarn');
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', ['install', 'yarn']);
  }
}
