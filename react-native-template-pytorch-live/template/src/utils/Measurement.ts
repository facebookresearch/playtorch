/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type {ModelResultMetrics} from 'react-native-pytorch-core';

declare var performance: any;

const marks = ['inference', 'pack', 'unpack'] as const;

type Mark = typeof marks[number];

type Measures = {[key in Mark]: number};

const measures: Measures = {
  inference: 0,
  pack: 0,
  unpack: 0,
};

export default {
  mark(mark: Mark) {
    measures[mark] = performance.now();
  },
  measure(mark: Mark) {
    measures[mark] = performance.now() - measures[mark];
  },
  getMetrics(): ModelResultMetrics {
    const packTime = Math.floor(measures.pack);
    const inferenceTime = Math.floor(measures.inference);
    const unpackTime = Math.floor(measures.unpack);

    // Clear previous marks
    for (const mark of marks) {
      measures[mark] = 0;
    }

    return {
      inferenceTime: inferenceTime,
      packTime: packTime,
      totalTime: packTime + inferenceTime + unpackTime,
      unpackTime: unpackTime,
    };
  },
};
