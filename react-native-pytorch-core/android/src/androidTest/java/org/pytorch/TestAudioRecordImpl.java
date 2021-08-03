/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch;

import androidx.annotation.NonNull;
import org.pytorch.rn.core.audio.IAudioRecord;

public class TestAudioRecordImpl implements IAudioRecord {

  private short[] mData;
  private int mPosition = 0;

  public TestAudioRecordImpl(short[] data) {
    this.mData = data;
  }

  @Override
  public int read(@NonNull short[] audioData, int offsetInShorts, int sizeInShorts) {
    final int sizeToRead = Math.min(mData.length - mPosition, sizeInShorts);

    for (int i = 0; i < sizeToRead; ++i) {
      audioData[offsetInShorts + i] = mData[i];
    }
    mPosition += sizeToRead;

    return sizeToRead;
  }
}
