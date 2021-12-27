/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ImageRequireSource} from 'react-native';

/**
 * An ML model can be loaded from three different sources, and must be one of
 * the following options:
 *
 * * url to a model file (e.g., https://example.com/my_model.ptl)
 * * path to a local model file (e.g., /data/0/some/path/my_model.ptl)
 * * a path in the JavaScript bundle (e.g., `require('./my_model.ptl')`)
 */
export type ModelPath = string | ImageRequireSource;

export type ModelInfo = {
  name: string;
  model: ModelPath;
};
