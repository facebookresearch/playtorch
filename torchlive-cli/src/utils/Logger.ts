/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment';

type Logger = {
  info(message: string): void;
  error(message: string, error?: Error): void;
};

type Transport = {
  log(name: string, type: string, message: string): Promise<void>;
};

const LOG_FILE_PREFIX = `torchlive`;
const LOG_FILE_EXTENSION = `log`;
const LOG_FILE_REGEX = new RegExp(`${LOG_FILE_PREFIX}\\.log\\.\\d`);

// 10 MB
const LOG_FILE_SIZE_LIMIT = 1024 * 1024 * 10;
const LOG_FILES_LIMIT = 5;

function getLogPath(): string {
  return path.join(os.homedir(), '.torchlive', 'logs');
}

export function getLogFilePath(): string {
  return path.join(getLogPath(), `${LOG_FILE_PREFIX}.${LOG_FILE_EXTENSION}`);
}

function getRolloverLogFilePath(num: number): string {
  return path.join(
    getLogPath(),
    `${LOG_FILE_PREFIX}.${LOG_FILE_EXTENSION}.${num}`,
  );
}

function createLogFile(): number {
  const logPath = getLogPath();

  const logFilePath = getLogFilePath();
  if (fs.existsSync(logFilePath)) {
    const stat = fs.statSync(logFilePath);
    if (stat.size > LOG_FILE_SIZE_LIMIT) {
      const files = fs.readdirSync(logPath);

      // Filter for log files and sorting them in reverse alphabetical order. This
      // will start from the log with the highest suffix. An example order could
      // be `pytorch_live_3.log`, `pytorch_live_2.log`, and `pytorch_live_1.log`.
      const logFiles = files
        .filter(file => file.match(LOG_FILE_REGEX))
        .sort((file1, file2) => -file1.localeCompare(file2));

      // The LOG_FILES_LIMIT includes the current log file (i.e., without number).
      // We also don't want to rollover the file
      for (let i = Math.min(logFiles.length, LOG_FILES_LIMIT - 2); i > 0; --i) {
        const oldPath = getRolloverLogFilePath(i);
        const newPath = getRolloverLogFilePath(i + 1);
        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
        }
      }

      const newPath = getRolloverLogFilePath(1);
      fs.renameSync(logFilePath, newPath);
    }
  }

  return fs.openSync(logFilePath, 'a');
}

function createLogger(): Transport {
  let logFileFd: number | null = null;

  function checkLogFile(): void {
    if (logFileFd === null) {
      const logPath = getLogPath();
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, {recursive: true});
      }
      logFileFd = createLogFile();
    } else {
      const logFilePath = getLogFilePath();
      const stat = fs.statSync(logFilePath);
      if (stat.size > LOG_FILE_SIZE_LIMIT) {
        logFileFd = createLogFile();
      }
    }
  }

  function log(name: string, type: string, message: string): Promise<void> {
    checkLogFile();

    return new Promise((resolve, reject) => {
      let data: string;
      if (name != null) {
        data = `[${moment().toISOString()}][${type}][${name}] ${message}\n`;
      } else {
        data = `[${moment().toISOString()}][${type}] ${message}\n`;
      }
      fs.appendFile(logFileFd, data, error => {
        if (error != null) {
          reject(error);
          return;
        }
        fs.fdatasync(logFileFd, () => resolve());
      });
    });
  }

  return {log};
}

let defaultTransport: Transport | null = null;

export function getLogger(name: string, transport?: Transport): Logger {
  if (defaultTransport === null) {
    defaultTransport = createLogger();
  }

  if (transport == null) {
    transport = defaultTransport;
  }

  async function info(message: string | any): Promise<void> {
    await transport.log(name, 'INFO', message);
  }

  async function error(message: string, error?: Error): Promise<void> {
    let logMessage = message;
    if (error != null) {
      logMessage += `\n${error}`;
    }
    await transport.log(name, 'ERROR', logMessage);
  }

  return {
    info,
    error,
  };
}
