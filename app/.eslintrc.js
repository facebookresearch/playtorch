/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: false,
        jsxBracketSameLine: true,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'avoid',
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'lib/'],
};
