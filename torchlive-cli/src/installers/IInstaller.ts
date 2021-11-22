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
