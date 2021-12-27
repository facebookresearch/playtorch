/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const platform = jest.fn();
const getJDKPath = jest.fn();
const getSDKPath = jest.fn();

const TEST_HOMEDIR = '/Users/torchlive';

jest.mock('os', () => {
  const os = jest.requireActual('os');
  os.platform = platform;
  os.homedir = function () {
    return TEST_HOMEDIR;
  };
  return os;
});

jest.mock('../../android/AndroidSDK', () => {
  const androidSDK = jest.requireActual('../../android/AndroidSDK');
  androidSDK.getSDKPath = getSDKPath;
  return androidSDK;
});

jest.mock('../../android/JDK', () => {
  const jdk = jest.requireActual('../../android/JDK');
  jdk.getJDKPath = getJDKPath;
  return jdk;
});

import path from 'path';
import {getEnv, isLinux, isMacOS, isWindows} from '../SystemUtils';

describe('Tests for SystemUtils', () => {
  test('if isMacOS is true for darwin', () => {
    platform.mockReturnValueOnce('darwin');
    expect(isMacOS()).toBe(true);
  });

  test('if isLinux is true for linux', () => {
    platform.mockReturnValueOnce('linux');
    expect(isLinux()).toBe(true);
  });

  test('if isWindows is true for win32', () => {
    platform.mockReturnValueOnce('win32');
    expect(isWindows()).toBe(true);
  });

  test('if process.env contains JAVA_HOME and Android SDK variables', () => {
    const jdkPath = '/opt/openjdk';
    const androidSDKPath = '/opt/android/sdk';

    getJDKPath.mockReturnValue(jdkPath);
    getSDKPath.mockReturnValue(androidSDKPath);

    const env = getEnv();

    expect(env.JAVA_HOME).toBe(jdkPath);
    expect(env.ANDROID_HOME).toBe(androidSDKPath);
    expect(env.ANDROID_SDK_ROOT).toBe(androidSDKPath);

    const paths = env.PATH.split(path.delimiter);

    expect(paths).toContain(path.join(jdkPath, 'bin'));
    expect(paths).toContain(path.join(androidSDKPath, 'platform-tools'));
    expect(paths).toContain(path.join(androidSDKPath, 'emulator'));
    expect(paths).toContain(path.join(androidSDKPath, 'tools'));
    expect(paths).toContain(path.join(androidSDKPath, 'tools/bin'));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
