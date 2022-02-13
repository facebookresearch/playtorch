/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.MediaDataSource;
import android.media.MediaPlayer;
import android.util.Log;

public class Audio implements IAudio {

  public static final String TAG = "PTLTypeAudio";

  private static final int DEFAULT_SPEED = 1;

  private final short[] mData;

  public Audio(short[] data) {
    this.mData = data;
  }

  public short[] getData() {
    return mData;
  }

  public void play() {
    MediaPlayer mediaPlayer = new MediaPlayer();
    MediaDataSource mediaDataSource = AudioUtils.getAudioAsMediaDataSource(mData);
    try {
      mediaPlayer.setDataSource(mediaDataSource);
      mediaPlayer.prepare();
      mediaPlayer.setPlaybackParams(mediaPlayer.getPlaybackParams().setSpeed(DEFAULT_SPEED));
    } catch (Exception e) {
      Log.e(TAG, "Could not play the audio.", e);
    }
    mediaPlayer.start();
  }
}
