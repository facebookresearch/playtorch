/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {hasJDKPath} from '../../android/JDK';
import {ICommand} from '../../commands/ICommand';
import javac from '../../commands/Javac';
import {TaskContext} from '../../task/Task';
import {isMacOS} from '../../utils/SystemUtils';
import {executeCommandForTask} from '../../utils/TaskUtils';
import {
  ICommandInstallerTask,
  getInstallerErrorMitigationMessage,
} from '../IInstaller';

export default class OpenJDKInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return javac;
  }

  getDescription(): string {
    return 'OpenJDK';
  }

  isInstalled(): boolean {
    return hasJDKPath();
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(
      this,
      'https://openjdk.java.net/install/',
    );
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, 'brew', ['install', 'openjdk@8']);
  }
}
