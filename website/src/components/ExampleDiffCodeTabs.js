/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function ExampleDiffCodeTabs({children}) {
  if (children.length !== 2) {
    throw new Error(
      `ExampleDiffCodeTabs requires exactly two children: the diff and the code`,
    );
  }
  return (
    <Tabs
      defaultValue="diff"
      values={[
        {label: 'Changes', value: 'diff'},
        {label: 'Entire File', value: 'code'},
      ]}>
      <TabItem value="diff">{children[0]}</TabItem>
      <TabItem value="code">{children[1]}</TabItem>
    </Tabs>
  );
}
