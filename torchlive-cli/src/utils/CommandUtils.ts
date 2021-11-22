/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {existsSync} from 'fs';
import semver, {SemVer} from 'semver';
import {ICommand} from '../commands/ICommand';
import {IExecutable} from '../commands/IExecutable';
import {getLogger} from '../utils/Logger';
import {
  execaCommandSync,
  isLinux,
  isMacOS,
  isWindows,
  platform,
} from './SystemUtils';
import {isCommandInstalled} from './ToolingUtils';

const Logger = getLogger('CommandUtils');

type CreateCommandOptions = {
  versionless?: boolean;
  getVersion?(): SemVer;
  parseVersion?(version: string | SemVer | null): SemVer;
  getPath?(): string | null;
  commands?: ICommands;
};

export interface ICommands {
  macOS: IExecutable;
  linux: IExecutable;
  windows: IExecutable;
}

export function getCommand(commands: ICommands): IExecutable {
  if (isMacOS()) {
    return commands.macOS;
  } else if (isLinux()) {
    return commands.linux;
  } else if (isWindows()) {
    return commands.windows;
  }
  throw new Error(`${platform} is not supported`);
}

export function parseVersion(rawVersion: string | SemVer | null): SemVer {
  if (rawVersion == null) {
    return null;
  }

  const version: SemVer | null = semver.parse(rawVersion);
  if (version === null) {
    throw new Error(`couldn't parse semver ${rawVersion}`);
  }

  return version;
}

export function createCommand(
  command: string,
  options?: CreateCommandOptions,
): ICommand {
  let version: SemVer | null = null;

  const commands: ICommands = options?.commands || {
    macOS: {
      execute(args: readonly string[]): string | null {
        try {
          return execaCommandSync(command, args);
        } catch (error) {
          // ignore
        }
        try {
          return execaCommandSync(getPath(), args);
        } catch (error) {
          Logger.error(
            `Could neither execute ${command} nor ${getPath()}`,
            error,
          );
        }
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

  function getPath(): string | null {
    if (options?.getPath != null) {
      return options.getPath();
    }
    if (isMacOS() && isCommandInstalled(command)) {
      const path = execaCommandSync('command', ['-v', command]);
      if (existsSync(path)) {
        return path;
      }
    }
    return null;
  }

  function isInstalled(): boolean {
    return getPath() !== null;
  }

  function isVersionless(): boolean {
    return options?.versionless;
  }

  function execute(args: readonly string[]): string {
    return getCommand(commands).execute(args);
  }

  function getVersion(): SemVer {
    if (options?.versionless) {
      return null;
    }
    if (version !== null) {
      return version;
    }
    if (options?.getVersion != null) {
      version = options.getVersion();
    } else {
      const rawVersion = execute(['--version']);
      version = semver.parse(rawVersion);
    }
    return version;
  }

  return {
    command,
    execute,
    getPath,
    isVersionless,
    getVersion,
    isInstalled,
  } as ICommand;
}
