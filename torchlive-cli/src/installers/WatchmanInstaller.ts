/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {ICommand} from '../commands/ICommand';
import watchman from '../commands/Watchman';
import {TaskContext} from '../task/Task';
import {isMacOS} from '../utils/SystemUtils';
import {executeCommandForTask} from '../utils/TaskUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ICommandInstallerTask} from './IInstaller';

export default class WatchmanInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return watchman;
  }

  getDescription(): string {
    return 'Watchman';
  }

  isInstalled(): boolean {
    return isCommandInstalled('watchman');
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', ['install', 'watchman']);
  }
}
