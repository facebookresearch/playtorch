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
import {isMacOS} from '../utils/SystemUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ICommandInstallerTask} from './IInstaller';

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
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    return new Promise((resolve, reject) => {
      context.update(`Installing ${this.getDescription()}`);
      const bash = exec(
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        error => {
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
