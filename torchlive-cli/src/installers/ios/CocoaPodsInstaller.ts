/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {exec} from 'child_process';
import {ICommand} from '../../commands/ICommand';
import {
  ICommandInstallerTask,
  getInstallerErrorMitigationMessage,
} from './../IInstaller';
import {isCommandInstalled} from '../../utils/ToolingUtils';
import {isMacOS} from '../../utils/SystemUtils';
import {TaskContext} from '../../task/Task';
import pod from '../../commands/ios/Pod';
import {sudo} from '../../utils/SudoUtils';
import {executeCommandForTask} from '../../utils/TaskUtils';

export default class CocoaPodsInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return pod;
  }

  getDescription(): string {
    return 'CocoaPods';
  }

  isInstalled(): boolean {
    return isCommandInstalled('pod');
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(
      this,
      'https://guides.cocoapods.org/using/getting-started.html',
    );
  }

  async run(context: TaskContext): Promise<void> {
    let {cocoapodsInstaller} = context.ctx;
    if (cocoapodsInstaller == null) {
      cocoapodsInstaller = await context.task.prompt<string>([
        {
          type: 'Select',
          name: 'source',
          message:
            "CocoaPods (https://cocoapods.org/) is not installed. It's necessary for iOS project to run correctly. Do you want to install it?",
          choices: [
            {
              name: 'gem',
              message: 'Yes, with gem (may require sudo)',
            },
            {
              name: 'homebrew',
              message: 'Yes,‎ with‎ Homebrew',
            },
          ],
        },
      ]);
    }

    if (cocoapodsInstaller === 'gem') {
      return await this.installWithGem(context);
    } else if (cocoapodsInstaller === 'homebrew') {
      return await this.installWithHomebrew(context);
    }
    throw new Error(
      `${cocoapodsInstaller} is not a valid option to install CocoaPods`,
    );
  }

  private async installWithGem(context: TaskContext): Promise<void> {
    context.update('CocoaPods requires sudo priviliges to install');

    // Elevate privileges to have sudo access, which is required to install
    // CocoaPods.
    const s = await sudo(
      context,
      'CocoaPods install requires `sudo` access\n\nPassword:',
    );

    return new Promise<void>(async (resolve, reject) => {
      context.update(`Installing ${this.getDescription()}`);

      const bash = exec('sudo gem install cocoapods', async error => {
        // Exit sudo privileges
        await s.exit();

        if (error != null) {
          reject(error);
          return;
        }

        context.update(`Installed ${this.getDescription()}`);

        resolve();
      });
      bash.stdout?.on('data', data => {
        context.update(String(data).trim());
      });
    });
  }

  private async installWithHomebrew(context: TaskContext): Promise<void> {
    return await executeCommandForTask(context, 'brew', [
      'install',
      'cocoapods',
    ]);
  }
}
