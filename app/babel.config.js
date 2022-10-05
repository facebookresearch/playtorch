/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove after metro-react-native-babel-preset is updated to 0.66.0+
      // which defaults to using @babel/plugin-transform-async-to-generator
      '@babel/plugin-transform-async-to-generator',
      // Reanimated plugin has to be listed last.
      'react-native-reanimated/plugin',
    ],
  };
};
