/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import python from '../Python';
import semver from 'semver';

describe('Python command tests', () => {
  test('test python getVersion success', () => {
    jest
      .spyOn(python, 'execute')
      .mockReturnValueOnce('Python 3.7.5');
    expect(python.getVersion()).toStrictEqual(semver.parse('3.7.5'));
  });

  test('test python getVersion Fail', () => {
    jest
      .spyOn(python, 'execute')
      .mockReturnValueOnce('');
    expect(python.getVersion()).toBeNull();
  });
});
