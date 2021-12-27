/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import org.pytorch.Tensor;
import org.pytorch.rn.core.audio.IAudio;

interface IAudioToTensorTransform {
  Tensor transform(IAudio audio);
}
