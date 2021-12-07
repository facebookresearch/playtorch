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
const process = require('process');

const makeModels = () => {
  execSync('source ./venv/bin/activate && \
              python3 -m pip install --upgrade pip && \
              python3 -m pip install -r requirements.txt --no-cache-dir && \
              python3 -W ignore make_models.py');
}

process.chdir('./models');

switch (process.platform) {
  case 'darwin':
    execSync('brew install python@3.9');
    execSync('/usr/local/opt/python@3.9/bin/python3 -m venv ./venv');
    makeModels();
    break;
  case 'linux':
    execSync('pip install virtualenv');
    // TODO: Test with Linux
    execSync('sudo apt-get install python3.9')
    execSync('virtualenv --python=/usr/bin/python3.9 venv');
    makeModels();
    break;
  case 'win32':
    // TODO: Implement
    break;
}
