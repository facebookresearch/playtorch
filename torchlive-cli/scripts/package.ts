/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {execSync} from 'child_process';
import fs from 'fs';
import {exit} from 'process';
import packageJSON from '../package.json';

const packageJSONPath = './package.json';
const packageJSONTmpPath = `${packageJSONPath}.tmp`;

function execCommand(cmd: string) {
  return execSync(cmd, {encoding: 'utf8'}).trim();
}

if (execCommand('hg st') !== '') {
  console.error('commit or discard changes before creating a dist');
  exit(-1);
}

const revision = execCommand('hg id -i');

fs.renameSync(packageJSONPath, packageJSONTmpPath);

try {
  packageJSON.version += `-${revision.substr(0, 9)}`;
  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON), {
    encoding: 'utf-8',
  });

  const result = execSync('yarn dist:pkg', {encoding: 'utf-8'});
  console.log(result);
} catch (error) {
  console.error(error);
} finally {
  fs.unlinkSync(packageJSONPath);
  fs.renameSync(packageJSONTmpPath, packageJSONPath);
}
