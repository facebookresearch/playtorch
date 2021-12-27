/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const prettierConfig = require('./.prettierrc');

module.exports = {
  extends: ['@react-native-community', 'plugin:import/errors'],
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': [2],
  },
  // @todo: remove once we cover whole codebase with types
  plugins: ['import'],
  globals: {
    NodeJS: true,
  },
  settings: {
    react: {
      version: 'latest',
    },
    'import/resolver': {
      alias: {
        map: [['types', './types/index.js']],
      },
      // Use <rootDir>/tsconfig.json for typescript resolution
      typescript: {},
    },
  },
  overrides: [
    {
      files: [
        '**/__mocks__/**',
        '**/__fixtures__/**',
        '**/__e2e__/**',
        'jest/**',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.ts', '**/*.ts'],
      rules: {
        'prettier/prettier': [2, {prettierConfig, parser: 'typescript'}],
      },
    },
  ],
};
