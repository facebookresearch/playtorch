/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import chalk from 'chalk';
import {Command} from 'commander';
import execa from 'execa';
import semver from 'semver';
import {getInstalledPackages, Package} from '../android/AndroidSDK';
import avdManager from '../commands/android/AVDManager';
import emulator from '../commands/android/Emulator';
import sdkManager from '../commands/android/SDKManager';
import HealthCheck, {IHealthCheck} from '../commands/HealthCheck';
import homebrew from '../commands/Homebrew';
import javac from '../commands/Javac';
import node from '../commands/Node';
import watchman from '../commands/Watchman';
import yarn from '../commands/Yarn';
import python from '../commands/Python';
import reactNative from '../commands/ReactNative';
import {print as printHeader} from '../utils/header';
import {execCommandSync, getEnv} from '../utils/SystemUtils';
import {isCommandInstalled} from '../utils/ToolingUtils';
import pod from '../commands/ios/Pod';

export function extractVersion(
  cmd: string,
  getVersionOutput: () => string,
  regex?: RegExp,
): string {
  if (isCommandInstalled(cmd)) {
    try {
      const version = getVersionOutput();
      if (regex != null) {
        const matches = version.match(regex);
        if (matches !== null && matches.length > 1) {
          return matches[1];
        }
      } else {
        return version;
      }
    } catch (err) {
      // this happens when the command doesn't exist
      return 'n/a';
    }
  }
  return 'not installed';
}

export function getVersion(
  cmd: string,
  versionCmd: string = '--version',
  regex?: RegExp,
): string {
  return extractVersion(
    cmd,
    () => execCommandSync(`${cmd} ${versionCmd}`),
    regex,
  );
}

export function getVersionFromStderr(
  cmd: string,
  versionCmd: string = '--version',
  regex?: RegExp,
): string {
  return extractVersion(
    cmd,
    () =>
      execa.sync(cmd, [versionCmd], {
        encoding: 'utf-8',
        env: getEnv(),
      }).stderr,
    regex,
  );
}

function indent(spaces: number): string {
  let ind = '';
  for (let i = 0; i < spaces; i++) {
    ind += ' ';
  }
  return ind;
}

function runHealthCheck(healthCheck: IHealthCheck, ind: number = 2): void {
  const command = healthCheck.getCommand();
  console.log(`${indent(ind - 2)}${chalk.green(healthCheck.getTitle())}`);
  if (healthCheck.getShouldRemove()) {
    if (!command.isInstalled()) {
      console.log(`${indent(ind)}✅ package does not exist.`);
    } else {
      console.log(`${indent(ind)}📍 path: ${command.getPath()}`);
      console.log(`${indent(ind)}🚫 package should not exist, please remove.`);
    }
    console.log();
    return;
  }
  if (command.isInstalled()) {
    console.log(`${indent(ind)}📍 path: ${command.getPath()}`);
    if (!command.isVersionless()) {
      if (healthCheck.getMinVersion() !== null) {
        console.log(
          `${indent(ind)}🏁 min version: ${healthCheck.getMinVersion()}`,
        );
      }
      console.log(
        `${indent(ind)}${
          healthCheck.satisfies() ? '✅' : '🚫'
        } version: ${command.getVersion()}`,
      );
    }

    if (healthCheck.hasPackages()) {
      console.log();
      console.log(`${indent(ind)}${chalk.green('Required Android Packages')}`);
      healthCheck.checkPackages().forEach(pkgInfo => {
        console.log(
          `${indent(ind + 2)}📦 ${pkgInfo.satisfies ? '✅' : '❌'} ${
            pkgInfo.package.path
          } ${
            pkgInfo.package.version != null
              ? `(${pkgInfo.package.version})`
              : ''
          }`,
        );
      });
      console.log();
      console.log(`${indent(ind)}${chalk.green('Installed Android Packages')}`);
      healthCheck.getInstalledPackages().forEach(pkg => {
        console.log(`${indent(ind + 2)}📦 ${pkg.path} (${pkg.version})`);
      });
    }
  } else {
    console.log(`${indent(ind)}🚫 not installed`);
  }
  console.log();
}

const runDoctor = async (): Promise<void> => {
  printHeader();

  const healthChecks: IHealthCheck[] = [
    new HealthCheck('Homebrew', homebrew, {
      minVersion: null,
    }),
    new HealthCheck('Python', python, {
      minVersion: semver.parse('3.7.5'),
    }),
    new HealthCheck('Watchman', watchman, {
      minVersion: null,
    }),
    new HealthCheck('Node.js', node, {
      minVersion: semver.parse('12.15.0'),
    }),
    new HealthCheck(
      'React Native should not be installed locally',
      reactNative,
      {
        minVersion: null,
        shouldRemove: true,
      },
    ),
    new HealthCheck('Yarn', yarn, {
      minVersion: semver.parse('1.17.0-20190429.1820'),
    }),
    new HealthCheck('Java Development Kit', javac, {
      minVersion: semver.parse('1.8.0_282'),
    }),
    new HealthCheck('Android SDK Manager', sdkManager, {
      minVersion: semver.parse('26.1.1'),
      packages: [
        {
          path: 'emulator',
        },
        {
          path: 'platform-tools',
        },
        {
          path: 'platforms;android-29',
        },
        {
          path: 'system-images;android-29;google_apis;x86_64',
        },
      ],
      parseInstalledPackages(): Package[] {
        return getInstalledPackages();
      },
    }),
    new HealthCheck('Android AVD Manager', avdManager, {
      minVersion: null,
    }),
    new HealthCheck('Android Emulator', emulator, {
      minVersion: semver.coerce('30.5.6.0'),
    }),
    new HealthCheck('CocoaPods', pod, {
      minVersion: semver.parse('1.10.2'),
    }),
  ];

  console.log();
  healthChecks.forEach(healthCheck => {
    runHealthCheck(healthCheck);
  });
};

export function makeDoctorCommand() {
  return new Command('doctor')
    .description('torchlive doctor')
    .action(runDoctor);
}
