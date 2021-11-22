/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const execCommandSyncMock = jest.fn();
const execaSyncMock = jest.fn();
const getEnvMock = jest.fn();
const isCommandInstalledMock = jest.fn();

jest.mock('../../utils/SystemUtils', () => ({
  execCommandSync: execCommandSyncMock,
  getEnv: getEnvMock,
}));

jest.mock('../../utils/ToolingUtils', () => ({
  isCommandInstalled: isCommandInstalledMock,
}));

jest.mock('execa', () => ({
  sync: execaSyncMock,
}));

import {getVersion, getVersionFromStderr} from '../Doctor';

describe('Tests for Doctor', () => {
  test('if Android emulator version extracts', () => {
    isCommandInstalledMock.mockResolvedValueOnce(true);
    execCommandSyncMock.mockReturnValueOnce(`emulator: Android emulator version 30.5.3.0 (build_id 7196367) (CL:N/A)
Android emulator version 30.5.3.0 (build_id 7196367) (CL:N/A)
Copyright (C) 2006-2017 The Android Open Source Project and many others.
This program is a derivative of the QEMU CPU emulator (www.qemu.org).

  This software is licensed under the terms of the GNU General Public
  License version 2, as published by the Free Software Foundation, and
  may be copied, distributed, and modified under those terms.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
`);
    const version = getVersion('emulator', '-version', /version\s([\d\.]*)\s/);
    expect(version).toBe('30.5.3.0');
    expect(isCommandInstalledMock).toBeCalledTimes(1);
    expect(execCommandSyncMock).toBeCalledTimes(1);
  });

  test('if Java version extracts', () => {
    isCommandInstalledMock.mockResolvedValueOnce(true);
    execaSyncMock.mockReturnValueOnce({
      stderr: `openjdk version "1.8.0_282"
  OpenJDK Runtime Environment (build 1.8.0_282-bre_2021_01_20_16_37-b00)
  OpenJDK 64-Bit Server VM (build 25.282-b00, mixed mode)`,
    });
    const version = getVersionFromStderr(
      'java2',
      '-version',
      /\sversion\s\"([\d\.\_]*)\"/,
    );
    expect(version).toBe('1.8.0_282');
    expect(isCommandInstalledMock).toBeCalledTimes(1);
    expect(execaSyncMock).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
