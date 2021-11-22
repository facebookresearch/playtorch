/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {exec} from 'child_process';
import {Command} from 'commander';
import {ITask, TaskContext} from '../task/Task';
import {print as printHeader} from '../utils/header';
import {executeCommandForTask, runTasks} from '../utils/TaskUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';

type InitOptions = {
  template: string;
};

class InitTask implements ITask {
  private name: string;
  private template: string;

  constructor(name: string, template: string) {
    this.name = name;
    this.template = template;
  }

  isValid(): boolean {
    return isCommandInstalled('yarn') && isCommandInstalled('npx');
  }

  getDescription(): string {
    return `project ${this.name}`;
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    await this.initProject(context);
    await this.installProjectDependencies(context);
    context.update(`Initialized ${this.getDescription()}}`);
  }

  async initProject(context: TaskContext): Promise<void> {
    context.update(`Init template ${this.template}`);
    await executeCommandForTask(context, 'npx', [
      'react-native',
      'init',
      this.name,
      '--skip-install',
      '--template',
      this.template,
    ]);
  }

  installProjectDependencies(context: TaskContext): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const yarnProcess = exec(`(cd ${this.name} && yarn install)`);

      yarnProcess.stdout.on('data', data => {
        context.update(String(data).trim());
      });

      yarnProcess.on('error', error => {
        reject(error);
      });

      yarnProcess.on('close', () => {
        resolve();
      });
    });
  }
}

const init = async (name: string, options: InitOptions): Promise<void> => {
  printHeader();
  const tasks: ITask[] = [new InitTask(name, options.template)];
  await runTasks(tasks);
};

export function makeInitCommand() {
  return new Command('init')
    .description('initialize torchlive project')
    .arguments('[name]')
    .option(
      '-t, --template [template]',
      'React Native template',
      'react-native-template-pytorch-live',
    )
    .action(init);
}
