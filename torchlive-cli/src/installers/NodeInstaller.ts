/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {ICommand} from '../commands/ICommand';
import node from '../commands/Node';
import {TaskContext} from '../task/Task';
import {isMacOS} from '../utils/SystemUtils';
import {executeCommandForTask} from '../utils/TaskUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {
  ICommandInstallerTask,
  getInstallerErrorMitigationMessage,
} from './IInstaller';

export default class NodeInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return node;
  }

  getDescription(): string {
    return 'Node';
  }

  isInstalled(): boolean {
    return isCommandInstalled('node') && isCommandInstalled('npm');
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(this, 'https://nodejs.org/');
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', ['install', 'node']);
  }
}
