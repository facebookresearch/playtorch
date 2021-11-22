/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const isCommandInstalledMock = jest.fn();
const execaCommandSyncMock = jest.fn();
const isMacOSMock = jest.fn();
const TEST_HOMEDIR = '/Users/torchlive';

jest.mock('fs');

jest.mock('os', () => {
  const os = jest.requireActual('os');
  os.homedir = function() {
    return TEST_HOMEDIR;
  };
  return os;
});

jest.mock('../../utils/ToolingUtils', () => {
  const ToolingUtils = jest.requireActual('../../utils/ToolingUtils');
  ToolingUtils.isCommandInstalled = isCommandInstalledMock;
  return ToolingUtils;
});

jest.mock('../../utils/SystemUtils', () => {
  const SystemUtils = jest.requireActual('../../utils/SystemUtils');
  SystemUtils.execaCommandSync = execaCommandSyncMock;
  SystemUtils.isMacOS = isMacOSMock;
  return SystemUtils;
});

import semver from 'semver';
import {createCommand} from '../../utils/CommandUtils';
import HealthCheck from '../HealthCheck';
import {ICommand} from '../ICommand';

describe('Health check tests', () => {
  test('if no mininum version passes', () => {
    isMacOSMock.mockReturnValueOnce(true);
    isCommandInstalledMock.mockReturnValueOnce(true);
    execaCommandSyncMock.mockReturnValueOnce('1.2.1');

    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: null,
    });

    expect(healthCheck.satisfies()).toBe(true);
    expect(execaCommandSyncMock.mock.calls.length).toBe(0);
  });

  test('if mininum version passes', () => {
    isMacOSMock.mockReturnValueOnce(true);
    isCommandInstalledMock.mockReturnValueOnce(true);
    execaCommandSyncMock.mockReturnValueOnce('1.2.2');

    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: semver.parse('1.2.2'),
    });

    expect(healthCheck.satisfies()).toBe(true);
    expect(execaCommandSyncMock.mock.calls.length).toBe(1);
  });

  test('if smaller mininum version passes', () => {
    isMacOSMock.mockReturnValueOnce(true);
    isCommandInstalledMock.mockReturnValueOnce(true);
    execaCommandSyncMock.mockReturnValueOnce('1.2.3');

    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: semver.parse('1.2.2'),
    });

    expect(healthCheck.satisfies()).toBe(true);
    expect(execaCommandSyncMock.mock.calls.length).toBe(1);
  });

  test('if greater minumum version fails', () => {
    isMacOSMock.mockReturnValueOnce(true);
    isCommandInstalledMock.mockReturnValueOnce(true);
    execaCommandSyncMock.mockReturnValueOnce('1.2.4');

    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: semver.parse('1.2.5'),
    });

    expect(healthCheck.satisfies()).toBe(false);
    expect(execaCommandSyncMock.mock.calls.length).toBe(1);
  });

  test('if min version is correct', () => {
    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: semver.parse('1.2.3'),
    });

    expect(healthCheck.getMinVersion()).toEqual(semver.parse('1.2.3'));
  });

  test('if title is correct', () => {
    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: null,
    });

    expect(healthCheck.getTitle()).toBe('Test');
  });

  test('if command.getVersion equals input semver', () => {
    isMacOSMock.mockReturnValueOnce(true);
    isCommandInstalledMock.mockReturnValueOnce(true);
    execaCommandSyncMock.mockReturnValueOnce('1.2.4');

    const command: ICommand = createCommand('test');
    const healthCheck = new HealthCheck('Test', command, {
      minVersion: null,
    });

    expect(healthCheck.getCommand().getVersion()).toEqual(
      semver.parse('1.2.4'),
    );
    expect(execaCommandSyncMock.mock.calls.length).toBe(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
