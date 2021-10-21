/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Command} from 'commander';
import {TaskContext} from '../task/Task';
import {executeCommandForTask} from '../utils/TaskUtils';

async function runYarnIOS(context: TaskContext): Promise<void> {
  executeCommandForTask(context, 'yarn', ['ios']);
}

const runIOS = async (): Promise<void> => {
  const context: TaskContext = {
    ctx: undefined,
    task: undefined,
    update: (message: string) => {
      console.log(message);
    },
  };

  await runYarnIOS(context);
};

export function makeRunIOSCommand() {
  return new Command('run-ios')
    .description('run project on ios')
    .action(runIOS);
}
