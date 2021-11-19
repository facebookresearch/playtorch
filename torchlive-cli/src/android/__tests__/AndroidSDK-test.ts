/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as AndroidSDK from '../AndroidSDK';
import * as SystemUtils from '../../utils/SystemUtils';
import * as fs from 'fs';

jest.mock('../../utils/SystemUtils');
const mockSystemUtilsModule = SystemUtils as jest.Mocked<typeof SystemUtils>;

jest.mock('fs');
const mockFsModule = fs as jest.Mocked<typeof fs>;

describe('test getDefaultSDKPath', () => {
  test('if it is MacOS', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(true);
    const path = AndroidSDK.getDefaultSDKPath();
    expect(path).toContain('Library/Android/sdk/');
  });

  test('if it is Linux', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(false);
    mockSystemUtilsModule.isLinux.mockReturnValueOnce(true);
    const path = AndroidSDK.getDefaultSDKPath();
    expect(path).toContain('Android/Sdk/');
  });

  test('if it is other system', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(false);
    mockSystemUtilsModule.isLinux.mockReturnValueOnce(false);
    expect(() => {
      AndroidSDK.getDefaultSDKPath();
    }).toThrow();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});

describe('test getSDKPath', () => {
  test('if it is other system', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(false);
    mockSystemUtilsModule.isLinux.mockReturnValueOnce(false);
    expect(() => {
      AndroidSDK.getDefaultSDKPath();
    }).toThrow();
  });

  test('if sdk path does not exist', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(true);
    mockFsModule.existsSync.mockReturnValue(false);
    const path = AndroidSDK.getSDKPath();
    expect(path).toBeNull();
  });

  test('if sdk path exists', () => {
    mockSystemUtilsModule.isMacOS.mockReturnValueOnce(false);
    mockSystemUtilsModule.isLinux.mockReturnValueOnce(true);
    mockFsModule.existsSync.mockReturnValueOnce(true);
    const path = AndroidSDK.getSDKPath();
    expect(path).toContain('Android/Sdk/');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
