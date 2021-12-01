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
import fs from 'fs';
import chalk from 'chalk';

const NOBREAKSPACE_INTEDENTATION = '‎ ‎ ‎ ‎ ';

type InitOptions = {
  template: string;
  skipInstall: boolean;
};

class InitTask implements ITask {
  private name: string;
  private initOptions: InitOptions;

  constructor(name: string, initOptions: InitOptions) {
    this.name = name;
    this.initOptions = initOptions;
  }

  taskRendererOptions: ListrGetRendererTaskOptions<ListrDefaultRenderer> = {
    persistentOutput: true,
  };

  isValid(): boolean {
    return isCommandInstalled('yarn', getEnv()) && isCommandInstalled('npx');
  }

  getDescription(): string {
    return `project ${this.name}`;
  }

  mitigateOnError(): string {
    return `💥 Failed to initialize ${this.name} project. \
Please run 'npx react-native init <project-name> --template react-native-template-pytorch-live'
for more debug info.

${
  isCommandInstalled('react-native') &&
  chalk.blue(`The following package installed locally might cause unexpected behavior, please uninstall them and rerun the commands.

• react-native

ref: https://reactnative.dev/docs/environment-setup)`)
}

If you still run into issues, \
please refer to https://github.com/pytorch/live/issues for more info.`;
  }

  async run(context: TaskContext): Promise<void> {
    context.task.title = `${this.getDescription()} (initializing, this can take a few minutes.)`;
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
${NOBREAKSPACE_INTEDENTATION}• Open ${this.name}/ios/${
      this.name
    }.xcworkspace in Xcode or run "xed -b ios"
${NOBREAKSPACE_INTEDENTATION}• Hit the Run button
${NOBREAKSPACE_INTEDENTATION}`);
    context.update(this.getPostInitMessage());
    context.task.title = this.getDescription();
    // report any error reported by post-init script
  }

  async initProject(context: TaskContext): Promise<void> {
    context.update(`Init template ${this.initOptions.template}`);

    const args = [
      'react-native',
      'init',
      this.name,
      '--template',
      this.initOptions.template,
    ];

    if (this.initOptions.skipInstall) {
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

  getPostInitMessage(): string {
    return `Initialized ${this.getDescription()}
    ${NOBREAKSPACE_INTEDENTATION}
    ${chalk.green('Run instructions for Android')}:
    ${NOBREAKSPACE_INTEDENTATION}• Have an Android emulator running (quickest way to get started), or a device connected.
    ${NOBREAKSPACE_INTEDENTATION}• cd ${
      this.name
    } && npx torchlive-cli run-android
    ${NOBREAKSPACE_INTEDENTATION}
    ${chalk.blue('Run instructions for iOS')}:
    ${NOBREAKSPACE_INTEDENTATION}• cd ${this.name} && npx torchlive-cli run-ios
    ${NOBREAKSPACE_INTEDENTATION}${chalk.grey('- or -')}
    ${NOBREAKSPACE_INTEDENTATION}• Open ${this.name}/ios/${
      this.name
    }.xcworkspace in Xcode or run "xed -b ios"
    ${NOBREAKSPACE_INTEDENTATION}• Hit the Run button
    ${NOBREAKSPACE_INTEDENTATION}`;
  }

  getPostInitScriptError(): string | null {
    // check if the error.log exists
    const errorLogPath = `${this.name}/models/error.log`;
    const issuePageUrl = 'https://github.com/pytorch/live/issues';
    try {
      if (fs.existsSync(`${this.name}/models/error.log`)) {
        const errorMessage = fs.readFileSync(errorLogPath).toString();
        const prefix = `${chalk.yellowBright('Warning')} project "${
          this.name
        }" is created but we ran into the following issues at generating example models: \n${NOBREAKSPACE_INTEDENTATION}\n`;
        const suffix = `\n${NOBREAKSPACE_INTEDENTATION}\nplease rerun
${NOBREAKSPACE_INTEDENTATION}• "python make_models.py" in the ${this.name}/models/ directory, and\n
${NOBREAKSPACE_INTEDENTATION}• "pod install" in the ${this.name}/ios/ directory \n
if the issue persists, please report at ${issuePageUrl}.`;
        return errorMessage ? prefix + errorMessage + suffix : null;
      }
    } catch (err) {
      return `${chalk.redBright(
        'Error',
      )} The torchlive-cli init command ran into unexpected error at validating the models generated under ${
        this.name
      }/models/, please report the issue at ${issuePageUrl}.`;
    }
    return null;
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
