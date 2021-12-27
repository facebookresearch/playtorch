/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import chalk from 'chalk';
import figlet from 'figlet';

const packageJSON = require('../../package.json');

export function print(): void {
  // Extract CLI name (package name without '-cli')
  const cliName = packageJSON.name.split('-')[0];

  // ASCII print CLI name
  console.log(chalk.magenta(figlet.textSync(cliName)));

  // Print CLI name and version
  console.log(chalk.white(`${cliName} version ${packageJSON.version}`));
}
