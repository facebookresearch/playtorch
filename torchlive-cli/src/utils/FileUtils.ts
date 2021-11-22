/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fs from 'fs';
import https from 'https';

export function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, response => {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
          resolve();
        });
      })
      .on('error', function(err) {
        fs.unlink(dest, err => {
          reject(err);
        });
        reject(err);
      });
  });
}
