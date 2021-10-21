/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {exec} from 'child_process';
import {ICommand} from '../commands/ICommand';
import {ICommandInstallerTask} from './IInstaller';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {isMacOS} from '../utils/SystemUtils';
import {TaskContext} from '../task/Task';
import yarn from '../commands/Yarn';

export default class YarnInstaller implements ICommandInstallerTask {
  isValid(): boolean {
    return isMacOS();
  }

  getCommand(): ICommand | null {
    return yarn;
  }

  getDescription(): string {
    return 'Yarn';
  }

  isInstalled(): boolean {
    return isCommandInstalled('yarn');
  }

  mitigateOnError(): string {
    // TODO(T90094183) Add mitigation message
    return '';
  }

  async run(context: TaskContext): Promise<void> {
    return new Promise(async (resolve, reject) => {
      context.update(`Installing ${this.getDescription()}`);

      const bash = exec(
        '/bin/bash -c "$(curl -o- -L https://yarnpkg.com/install.sh)"',
        async error => {
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
