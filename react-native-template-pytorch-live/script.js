#!/usr/bin/env node
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const {spawnSync} = require('child_process');
const fs = require('fs');

try {
  let makeModelsScript;
  switch (process.platform) {
    case 'darwin':
    case 'linux':
      makeModelsScript =
        'python3 -m venv ./venv 2> ./error.log \
            && source ./venv/bin/activate 2> ./error.log \
            && pip install --upgrade pip 2> ./error.log \
            && pip install -r requirements.txt 2> ./error.log \
            && python -W ignore make_models.py 2> ./error.log';
      break;
    case 'win32':
      makeModelsScript =
        'python3 -m venv venv 2> error.log \
            && .\\venv\\Scripts\\activate 2> error.log \
            && pip install -r requirements.txt 2> error.log \
            && python -W ignore make_models.py 2> error.log';
      break;
  }

  const result = spawnSync(makeModelsScript, {
    shell: true,
    cwd: './models/',
  });

  // Delete error log file if process returned with exit code 0, which
  // means the models were created successfully.
  if (result.status === 0) {
    fs.unlinkSync('./models/error.log');
  }
} catch (error) {
  fs.writeFileSync('./models/error.log', error.toString());
}
