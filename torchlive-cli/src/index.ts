#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { program } from 'commander';
import { makeCleanCommand } from './cli-commands/Clean';
import { makeDoctorCommand } from './cli-commands/Doctor';
import { makeEmulatorCommand } from './cli-commands/Emulator';
import { makeInitCommand } from './cli-commands/Init';
import { makePrintLogCommand } from './cli-commands/Log';
import { makeRunAndroidCommand } from './cli-commands/RunAndroid';
import { makeSetUpDevCommand } from './cli-commands/SetUpDev';

const packageJSON = require('../package.json');

program
    .version(packageJSON.version, '-v, --version', 'output the version number')
    .addCommand(makeSetUpDevCommand())
    .addCommand(makeInitCommand())
    .addCommand(makeCleanCommand())
    .addCommand(makeRunAndroidCommand())
    .addCommand(makeEmulatorCommand())
    .addCommand(makeDoctorCommand())
    .addCommand(makePrintLogCommand())
    .parse(process.argv);
