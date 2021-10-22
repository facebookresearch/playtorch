/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {ICommand} from '../commands/ICommand';
import {ITask} from '../task/Task';

export interface IInstallerTask extends ITask {
  isInstalled(): boolean;
}

export interface ICommandInstallerTask extends IInstallerTask {
  getCommand(): ICommand | null;
}

// Type predicate
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isInstallerTask(task: ITask): task is IInstallerTask {
  return (task as IInstallerTask).isInstalled !== undefined;
}

// Type predicate
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isCommandInstallerTask(
  task: ITask,
): task is ICommandInstallerTask {
  return (task as ICommandInstallerTask).getCommand !== undefined;
}

export function getInstallerErrorMitigationMessage(
  task: ITask,
  externalLink: string,
): string {
  const msg =
    `💥 Installation of ${task.getDescription()} failed.

Please go to ${externalLink} and manually install the package.

Once you complete the installation, \
you can run the 'npx torchlive-cli setup-dev' again to continue the setup.

If you still run into issue, \
please refer to https://github.com/pytorch/live/issues for more info.`;
  return msg;
}
