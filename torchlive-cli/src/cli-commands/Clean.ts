/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Command} from 'commander';
import {ITask, TaskContext} from '../task/Task';
import {print as printHeader} from '../utils/header';
import {executeCommandForTask, runTasks} from '../utils/TaskUtils';

class CleanTask implements ITask {
  getDescription(): string {
    return 'clean Android build';
  }

  isValid(): boolean {
    return true;
  }

  mitigateOnError(): string {
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await executeCommandForTask(context, './gradlew', ['clean'], {
      cwd: './android',
    });
  }
}

const runClean = async (): Promise<void> => {
  printHeader();
  const tasks: ITask[] = [new CleanTask()];
  await runTasks(tasks);
};

export function makeCleanCommand() {
  return new Command('clean').description('clean build').action(runClean);
}
