#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const execSync = require('child_process').execSync;

switch (process.platform) {
  case 'darwin':
  case 'linux':
    execSync(
      'cd ./models && python3 -m venv ./venv 2> ./error.log \
            && source ./venv/bin/activate 2> ./error.log \
            && pip install --upgrade pip 2> ./error.log \
            && pip install -r requirements.txt 2> ./error.log \
            && python make_models.py 2> ./error.log',
    );
    break;
  case 'win32':
    // TODO: Implement
    break;
}
