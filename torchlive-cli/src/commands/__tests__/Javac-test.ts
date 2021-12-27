/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as SystemUtils from '../../utils/SystemUtils';
import * as CommandUtils from '../../utils/ToolingUtils';
import * as fs from 'fs';
import java from '../Javac';
import semver from 'semver';

jest.mock('fs');
const mockFsModule = fs as jest.Mocked<typeof fs>;

describe('test for Javac getPath', () => {
  test('if not MacOS', () => {
    jest.spyOn(SystemUtils, 'isMacOS').mockReturnValueOnce(false);
    expect(java.getPath()).toBeNull();
  });

  test('if brew not installed', () => {
    jest.spyOn(SystemUtils, 'isMacOS').mockReturnValueOnce(true);
    jest.spyOn(CommandUtils, 'isCommandInstalled').mockReturnValueOnce(false);
    expect(java.getPath()).toBeNull();
  });

  test('if path not exists', () => {
    jest.spyOn(SystemUtils, 'isMacOS').mockReturnValueOnce(true);
    jest.spyOn(CommandUtils, 'isCommandInstalled').mockReturnValueOnce(true);
    jest
      .spyOn(SystemUtils, 'execaCommandSync')
      .mockReturnValueOnce('test-path');
    mockFsModule.existsSync.mockReturnValueOnce(false);
    expect(java.getPath()).toBeNull();
  });

  test('if path exists', () => {
    jest.spyOn(SystemUtils, 'isMacOS').mockReturnValueOnce(true);
    jest.spyOn(CommandUtils, 'isCommandInstalled').mockReturnValueOnce(true);
    jest
      .spyOn(SystemUtils, 'execaCommandSync')
      .mockReturnValueOnce('test-path');
    mockFsModule.existsSync.mockReturnValueOnce(true);
    expect(java.getPath()).toStrictEqual('test-path');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});

describe('test getVersion', () => {
  test('rawVersion does not match', () => {
    jest.spyOn(java, 'execute').mockReturnValueOnce('');
    expect(java.getVersion()).toBeNull();
  });

  test('if rawVersion does match', () => {
    jest
      .spyOn(java, 'execute')
      .mockReturnValueOnce('openjdk version "1.8.0_312"');
    expect(java.getVersion()).toStrictEqual(semver.parse('1.8.0-312'));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
