/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.AudioRecord;

public class Audio {
  final AudioRecord audioRecord;

  public Audio(AudioRecord audioRecord) {
    this.audioRecord = audioRecord;
  }
}
