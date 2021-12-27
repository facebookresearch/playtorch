/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import reactNative from '../ReactNative';
import * as SystemUtils from '../../utils/SystemUtils';

jest.mock('../../utils/SystemUtils');
const mockSystemUtilsModule = SystemUtils as jest.Mocked<typeof SystemUtils>;

describe('test isInstalled', () => {
  test('neither npm nor yarn is installed', () => {
    mockSystemUtilsModule.execaCommandSync.mockImplementation(
      (_command: string, _options: string[]) => {
        throw 'command not installed';
      },
    );
    const res = reactNative.isInstalled();
    expect(mockSystemUtilsModule.execaCommandSync).toHaveBeenCalledTimes(2);
    expect(res).toBe(false);
  });

  test('both npm and yarn are installed, but neither installed react-native', () => {
    mockSystemUtilsModule.execaCommandSync.mockReturnValueOnce(
      '/usr/local/lib\n' +
        '├── npm@8.1.3\n' +
        '└── react-native-template-pytorch-live@0.0.1 -> ./pytorch/live/react-native-template-pytorch-live',
    );
    mockSystemUtilsModule.execaCommandSync.mockReturnValueOnce(
      'yarn global v1.22.15\n' + 'Done in 0.44s.',
    );
    const res = reactNative.isInstalled();
    expect(mockSystemUtilsModule.execaCommandSync).toHaveBeenCalledTimes(2);
    expect(res).toBe(false);
  });

  test('npm installed react-native', () => {
    mockSystemUtilsModule.execaCommandSync.mockReturnValueOnce(
      '/usr/local/lib\n' +
        '├── npm@8.1.3\n' +
        '├── react-native-template-pytorch-live@0.0.1 -> ./pytorch/live/react-native-template-pytorch-live\n' +
        '└── react-native@0.66.3',
    );
    const res = reactNative.isInstalled();
    expect(mockSystemUtilsModule.execaCommandSync).toHaveBeenCalledTimes(1);
    expect(res).toBe(true);
  });

  test('npm not installed, and yarn installed react-native', () => {
    mockSystemUtilsModule.execaCommandSync.mockImplementationOnce(
      (_command: string, _options: string[]) => {
        throw 'command not installed';
      },
    );
    mockSystemUtilsModule.execaCommandSync.mockReturnValueOnce(
      'yarn global v1.22.15\n' +
        'info "react-native@0.66.3" has binaries:\n' +
        '   - react-native\n' +
        'Done in 0.44s.',
    );
    const res = reactNative.isInstalled();
    expect(mockSystemUtilsModule.execaCommandSync).toHaveBeenCalledTimes(2);
    expect(res).toBe(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
