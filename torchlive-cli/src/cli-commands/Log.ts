/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Command} from 'commander';
import fs from 'fs';
import {getLogFilePath} from '../utils/Logger';

const runPrintLog = async (): Promise<void> => {
  const logFilePath = getLogFilePath();
  let log = 'log file is empty';
  if (fs.existsSync(logFilePath)) {
    log = fs.readFileSync(logFilePath, {encoding: 'utf-8'});
  }
  console.log(log);
};

export function makePrintLogCommand() {
  return new Command('log').description('print log').action(runPrintLog);
}
