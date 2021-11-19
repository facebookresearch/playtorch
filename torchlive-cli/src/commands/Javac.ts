/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import execa from 'execa';
import {existsSync} from 'fs';
import semver, {SemVer} from 'semver';
import {createCommand, getCommand, ICommands} from '../utils/CommandUtils';
import {execaCommandSync, getEnv, isMacOS} from '../utils/SystemUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import {ICommand} from './ICommand';

const cmd: string = 'javac';

const commands: ICommands = {
  macOS: {
    execute(args: readonly string[]): string | null {
      if (args.length > 0 && args[0] === '-version') {
        return execa.sync(cmd, args, {
          encoding: 'utf8',
          env: getEnv(),
          all: true,
        }).stderr;
      }
      return execaCommandSync(cmd, args);
    },
  },
  linux: {
    execute(_args: readonly string[]): string | null {
      throw new Error('not yet implemented');
    },
  },
  windows: {
    execute(_args: readonly string[]): string | null {
      throw new Error('not yet implemented');
    },
  },
};

function parseVersion(rawVersion: string): SemVer {
  // Convert '_' to '-' because semver cannot handle '_'. This is needed for
  // `java -version`.
  const escapedRawVersion = rawVersion.replace(/\_/g, '-');
  return semver.parse(escapedRawVersion) || semver.coerce(escapedRawVersion);
}

function getPath(): string | null {
  if (isMacOS() && isCommandInstalled('brew')) {
    const path = execaCommandSync('brew', ['--prefix', 'openjdk@8']);
    if (existsSync(path)) {
      return path;
    }
  }
  return null;
}

function getVersion(): SemVer {
  let rawVersion = command.execute(['-version']);
  const matches = rawVersion.match(/\sversion\s\"([\d\.\_]*)\"/);
  if (matches !== null && matches.length > 1) {
    rawVersion = matches[1];
  }
  return parseVersion(rawVersion);
}

const command = createCommand('java', {
  commands,
  getVersion,
  parseVersion,
  getPath,
});

export default command as ICommand;
