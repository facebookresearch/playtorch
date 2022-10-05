/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall playtorch
 */

import {EXAMPLES_BY_SLUG} from '../../examples/examples-config';
import {ViewExampleScreenProps} from '../../types/navigation';
import ModelProvider from '../../examples/utils/ModelProvider';
import React from 'react';

export default function ViewExampleScreen({
  route: {params},
}: ViewExampleScreenProps) {
  const {exampleSlug} = params;
  const {component: Component} = EXAMPLES_BY_SLUG[exampleSlug];
  return (
    <ModelProvider>
      <Component />
    </ModelProvider>
  );
}
