/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {ReactElement} from 'react';
import {ImageRequireSource} from 'react-native';

export type Example = {
  title: string;
  slug: string;
  description: string;
  component: () => ReactElement | null;
  img: ImageRequireSource;
  needsCameraPermissions?: boolean;
};

export const ExampleCategories = [
  'Vision',
  'NLP',
  'Visualization',
  'Game',
] as const;

export type ExampleCategory = typeof ExampleCategories[number];
