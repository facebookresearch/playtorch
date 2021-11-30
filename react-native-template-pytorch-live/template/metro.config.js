/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// get defaults assetExts array
const defaultAssetExts =
  require('metro-config/src/defaults/defaults').assetExts;

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // We will will continue to support 'pt' file extensions for until the beta
    // release of PyTorch Live and then deprecate the support.
    assetExts: [...defaultAssetExts, 'ptl', 'pt', 'json'],
  },
};
