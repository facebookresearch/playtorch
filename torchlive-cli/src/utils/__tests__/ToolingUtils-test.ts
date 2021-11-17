/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {isCommandInstalled} from '../ToolingUtils';
import child_process from 'child_process';

jest.mock('child_process');
const mockChildProcess = child_process as jest.Mocked<typeof child_process>;

describe('test isCommandInstalled', () => {
  test('target command is installed', () => {
    mockChildProcess.execSync.mockReturnValueOnce(
      Buffer.from('/usr/Local/test'),
    );
    expect(isCommandInstalled('test')).toBe(true);
  });
  test('target command is not installed', () => {
    mockChildProcess.execSync.mockImplementationOnce(() => {
      throw 'test error';
    });
    expect(isCommandInstalled('test')).toBe(false);
  });
});
