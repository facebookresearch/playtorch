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
import {getEnv} from '../utils/SystemUtils';
import {executeCommandForTask, runTasks} from '../utils/TaskUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ListrGetRendererTaskOptions, ListrDefaultRenderer} from 'listr2';
import chalk from 'chalk';

const NOBREAKSPACE_INTEDENTATION = '‎ ‎ ‎ ‎ ';

type InitOptions = {
  template: string;
  skipInstall: boolean;
};

class InitTask implements ITask {
  private name: string;
  private options: InitOptions;

  constructor(name: string, options: InitOptions) {
    this.name = name;
    this.options = options;
  }

  isValid(): boolean {
    return isCommandInstalled('yarn', getEnv()) && isCommandInstalled('npx');
  }

  getDescription(): string {
    return `project ${this.name}`;
  }

  getOptions(): ListrGetRendererTaskOptions<ListrDefaultRenderer> {
    return {
      persistentOutput: true,
    }
  }

  mitigateOnError(): string {
    return `💥 Failed to initialize ${this.name} project. \
Please run 'react-native init <project-name> --template react-native-template-pytorch-live'
for more debug info.

If you still run into issue, \
please refer to https://github.com/pytorch/live/issues for more info.`;
  }

  async run(context: TaskContext): Promise<void> {
    await this.initProject(context);
    await this.installProjectDependencies(context);
    context.update(`Initialized ${this.getDescription()}
${NOBREAKSPACE_INTEDENTATION}
${chalk.green('Run instructions for Android')}:
${NOBREAKSPACE_INTEDENTATION}• Have an Android emulator running (quickest way to get started), or a device connected.
${NOBREAKSPACE_INTEDENTATION}• cd ${this.name} && npx torchlive-cli run-android
${NOBREAKSPACE_INTEDENTATION}
${chalk.blue('Run instructions for iOS')}:
${NOBREAKSPACE_INTEDENTATION}• cd ${this.name} && npx torchlive-cli run-ios
${NOBREAKSPACE_INTEDENTATION}${chalk.grey('- or -')}
${NOBREAKSPACE_INTEDENTATION}• Open ${this.name}/ios/${this.name}.xcworkspace in Xcode or run "xed -b ios"
${NOBREAKSPACE_INTEDENTATION}• Hit the Run button`);
  }

  async initProject(context: TaskContext): Promise<void> {
    context.update(`Init template ${this.options.template}`);

    const args = [
      'react-native',
      'init',
      this.name,
      '--template',
      this.options.template,
    ];

    if (this.options.skipInstall) {
      args.push('--skip-install');
    }

    await executeCommandForTask(context, 'npx', args);
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
  const tasks: ITask[] = [new InitTask(name, options)];
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
    .option('--skip-install', 'Skips dependencies installation step')
    .action(init);
}
