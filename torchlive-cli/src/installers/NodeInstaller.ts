/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
import {ICommandInstallerTask} from './IInstaller';

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
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', ['install', 'node']);
  }
}
