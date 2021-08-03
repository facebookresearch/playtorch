/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.AudioRecord;
import androidx.annotation.NonNull;

public class AudioRecordImpl implements IAudioRecord {
  private AudioRecord mAudioRecord;

  public AudioRecordImpl(AudioRecord audioRecord) {
    this.mAudioRecord = audioRecord;
  }

  @Override
  public int read(@NonNull short[] audioData, int offsetInShorts, int sizeInShorts) {
    return mAudioRecord.read(audioData, offsetInShorts, sizeInShorts);
  }
}
