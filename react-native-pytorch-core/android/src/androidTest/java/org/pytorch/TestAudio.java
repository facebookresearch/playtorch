/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch;

import org.pytorch.rn.core.audio.IAudio;
import org.pytorch.rn.core.audio.IAudioRecord;

public class TestAudio implements IAudio {

  private IAudioRecord mAudioRecord;

  public TestAudio(IAudioRecord mAudioRecord) {
    this.mAudioRecord = mAudioRecord;
  }

  @Override
  public IAudioRecord getAudioRecord() {
    return mAudioRecord;
  }
}
