/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {exec} from 'child_process';
import brew from '../commands/Homebrew';
import {ICommand} from '../commands/ICommand';
import {TaskContext} from '../task/Task';
import {sudo} from '../utils/SudoUtils';
import {isMacOS} from '../utils/SystemUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ICommandInstallerTask, getInstallerErrorMitigationMessage} from './IInstaller';

export default class HomebrewInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return brew;
  }

  getDescription(): string {
    return 'Homebrew';
  }

  isInstalled(): boolean {
    return isCommandInstalled('brew');
  }

  mitigateOnError(): string {
    return getInstallerErrorMitigationMessage(
      this,
      'https://brew.sh/',
    );
  }

  async run(context: TaskContext): Promise<void> {
    context.update('Homebrew requires sudo priviliges to install');

    // Elevate privileges to have sudo access, which is required to install
    // Homebrew.
    const s = await sudo(
      context,
      'Homebrew install requires `sudo` access\n\nPassword:',
    );

    return new Promise(async (resolve, reject) => {
      context.update(`Installing ${this.getDescription()}`);

      const bash = exec(
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        async error => {
          // Exit sudo privileges
          await s.exit();

          if (error != null) {
            reject(error);
            return;
          }
          context.update(`Installed ${this.getDescription()}`);

          resolve();
        },
      );
      bash.stdout?.on('data', data => {
        context.update(String(data).trim());
      });
    });
  }
}
