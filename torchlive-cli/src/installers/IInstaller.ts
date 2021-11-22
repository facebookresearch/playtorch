/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {ICommand} from '../commands/ICommand';
import {ITask, TaskContext} from '../task/Task';

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
  const msg = `💥 Installation of ${task.getDescription()} failed because of the error reported above.

Please address the reported error. Alternatively, install the package manually from ${externalLink}.

Then run 'npx torchlive-cli setup-dev' again to continue the setup.

If you still run into the issue, \
please visit https://github.com/pytorch/live/issues to search for similar issues or to report yours.`;
  return msg;
}

export async function getUserConsentOnInstallerOrQuit(
  task: IInstallerTask,
  context: TaskContext,
  licenseLink: string,
): Promise<void> {
  const userConsent = await context.task.prompt<boolean>({
    type: 'confirm',
    name: 'userConsent',
    message: `You must accept the following license agreement to continue installing ${task.getDescription()}.

${licenseLink}.

Do you accept the license?`,
  });

  if (!userConsent) {
    throw new Error(
      `Stopping installation of ${task.getDescription()}, it is required to accept Android Software Development Kit License Agreement.`,
    );
  }
  context.update('Accepted licenses agreement');
}
