/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {createCommand} from '../utils/CommandUtils';
import {execaCommandSync} from '../utils/SystemUtils';
import {ICommand} from './ICommand';

const command = createCommand('react-native', {isInstalled}) as ICommand;
const commands = new Map<string, string[]>();

function isInstalled(): boolean {
  const regex = /(react-native@[0-9\.]+)/;
  commands.set('npm', ['list', '-g', '--depth', '0']);
  commands.set('yarn', ['global', 'list']);
  for (let command of ['npm', 'yarn']) {
    try {
      let options = commands.get(command);
      let output = execaCommandSync(command, options);
      let regexMatches = output.match(regex);
      if (regexMatches != null && regexMatches[0] != null) {
        return true;
      }
    } catch {
      // if the command is not installed, we move on checking the next one.
      continue;
    }
  }
  return false;
}

export default command;
