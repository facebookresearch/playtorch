/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  // This is needed to strip fb/ imports in pure React components
  // during the OSS build.
  // TODO() Evaluate if stripping fb/ imports is still needed
  plugins: process.env.FB_INTERNAL
    ? []
    : [
        [
          'babel-plugin-transform-remove-imports',
          {
            test: '.+/(.*/)?fb/',
          },
        ],
      ],
};
