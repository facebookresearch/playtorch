/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';
import {TaskContext} from '../task/Task';

export async function sudo(context: TaskContext, message?: string) {
  const password = await context.task.prompt<string>({
    type: 'invisible',
    name: 'password',
    message: message ?? 'Password:',
  });

  try {
    // The '-v' validates the sudo user (noop but allows to set sudo timestamp)
    // The '-S' param reads password from stdin
    execSync(`echo "${password}" | sudo -S -v`, {stdio: 'inherit'});
  } catch (error) {
    throw new Error('password input failed');
  }

  return {
    async exit() {
      // Resets the sudo timestamp to require sudo password again
      execSync('sudo -k', {stdio: 'inherit'});
    },
  };
}
