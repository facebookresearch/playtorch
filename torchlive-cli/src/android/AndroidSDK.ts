/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fs, {existsSync} from 'fs';
import os from 'os';
import path from 'path';
import {
  execaCommandSync,
  isLinux,
  isMacOS,
  platform,
} from '../utils/SystemUtils';

export type Package = {
  path: string;
  version: string;
  description: string;
  location: string;
};

const getMacOSPaths = (): string[] => [
  path.join(os.homedir(), 'Library/Android/sdk/'),
  '/Library/Android/sdk/',
  '/opt/android/sdk/',
];

const getLinuxPaths = (): string[] => [path.join(os.homedir(), 'Android/Sdk/')];

export function getDefaultSDKPath(): string {
  if (isMacOS()) {
    return getMacOSPaths()[0];
  } else if (isLinux()) {
    return getLinuxPaths()[0];
  } else {
    throw new Error(`platform ${platform} unsupported`);
  }
}

export function getSDKPath(): string | null {
  let sdkPaths: string[];
  if (isMacOS()) {
    sdkPaths = getMacOSPaths();
  } else if (isLinux()) {
    sdkPaths = getLinuxPaths();
  } else {
    throw new Error(`platform ${platform} unsupported`);
  }

  for (const sdkPath of sdkPaths) {
    if (fs.existsSync(sdkPath)) {
      return sdkPath;
    }
  }
  return null;
}

export function getSDKManagerPath(): string | null {
  const sdkPath = getSDKPath();
  if (sdkPath !== null) {
    const sdkManagerPath = path.join(sdkPath, 'tools/bin/sdkmanager');
    if (existsSync(sdkManagerPath)) {
      return sdkManagerPath;
    }
  }
  return null;
}

export function getAVDManagerPath(): string | null {
  const sdkPath = getSDKPath();
  if (sdkPath !== null) {
    const avdManagerPath = path.join(sdkPath, 'tools/bin/avdmanager');
    if (existsSync(avdManagerPath)) {
      return avdManagerPath;
    }
  }
  return null;
}

export function getEmulatorPath(): string | null {
  const sdkPath = getSDKPath();
  if (sdkPath !== null) {
    const emulatorPath = path.join(sdkPath, 'emulator/emulator');
    if (existsSync(emulatorPath)) {
      return emulatorPath;
    }
  }
  return null;
}

export function getSkinsPath(): string | null {
  const sdkPath = getSDKPath();
  return path.join(sdkPath, 'skins');
}

export function hasSDKPath(): boolean {
  return getSDKPath() !== null;
}

export function getInstalledPackages(): Package[] {
  // An option on unix would be to use:
  //
  // `sdkmanager --list | sed -e '/Available Packages/q'`
  //
  // However, this would most likely not work for all potentially supported
  // platform. Therefore, we are going to substring the output from `--list`.
  const listOutput = execaCommandSync(getSDKManagerPath(), ['--list']);
  const splitListOutput = listOutput.substring(
    0,
    listOutput.indexOf('Available Packages'),
  );

  const packages: Package[] = [];

  const regex = /^\s\s(\S+)\s*\|\s([\d.]+)\s+\|\s(.*)\s+\|\s(.+)\s*$/gm;

  let m: RegExpExecArray;
  while ((m = regex.exec(splitListOutput)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    let packagePath: string;
    let packageVersion: string;
    let packageDescription: string;
    let packageLocation: string;

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      switch (groupIndex) {
        case 1:
          packagePath = match;
          break;
        case 2:
          packageVersion = match;
          break;
        case 3:
          packageDescription = match;
          break;
        case 4:
          packageLocation = match;
          break;
      }
    });

    packages.push({
      path: packagePath,
      version: packageVersion,
      description: packageDescription,
      location: packageLocation,
    });
  }

  return packages;
}

export function isPackageInstalled(filePath: string): boolean {
  const packages = getInstalledPackages();
  return packages.findIndex(pkg => pkg.path === filePath) > -1;
}

export function getAndroidEmulatorABI(): string {
  return os.cpus()[0].model.startsWith('Apple M') ? 'arm64-v8a' : 'x86_64';
}
