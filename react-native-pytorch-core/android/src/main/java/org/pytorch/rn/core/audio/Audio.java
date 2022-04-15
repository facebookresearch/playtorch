/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.MediaDataSource;
import android.media.MediaMetadataRetriever;
import android.media.MediaPlayer;
import android.util.Log;
import androidx.annotation.Nullable;
import java.io.File;

public class Audio implements IAudio {

  public static final String TAG = "PTLTypeAudio";

  private static final int DEFAULT_SPEED = 1;

  private final short[] mData;
  @Nullable private MediaPlayer mPlayer;

  public Audio(short[] data) {
    this.mData = data;
  }

  public short[] getData() {
    return mData;
  }

  public void play() {
    if (mPlayer == null) {
      mPlayer = new MediaPlayer();
    }
    MediaDataSource mediaDataSource = AudioUtils.getAudioAsMediaDataSource(mData);
    try {
      mPlayer.setDataSource(mediaDataSource);
      mPlayer.prepare();
      mPlayer.setPlaybackParams(mPlayer.getPlaybackParams().setSpeed(DEFAULT_SPEED));
    } catch (Exception e) {
      Log.e(TAG, "Could not play the audio.", e);
    }
    mPlayer.start();
  }

  public void pause() {
    if (mPlayer != null && mPlayer.isPlaying()) {
      mPlayer.pause();
    }
  }

  public void stop() {
    if (mPlayer != null && mPlayer.isPlaying()) {
      mPlayer.stop();
      try {
        mPlayer.prepare();
      } catch (Exception e) {
        Log.e(TAG, "Could not prepare the audio.", e);
      }
    }
  }

  public int getDuration() {
    final File tempFile = AudioUtils.toTempFile(mData);
    if (tempFile == null) {
      return -1;
    }
    try {
      final MediaMetadataRetriever mediaMetadataRetriever = new MediaMetadataRetriever();
      mediaMetadataRetriever.setDataSource(tempFile.getAbsolutePath());
      final String durationStr =
          mediaMetadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
      return Integer.parseInt(durationStr);
    } catch (final Exception e) {
      Log.e(TAG, "Could not extract the audio clip duration.", e);
      return -1;
    }
  }
}
