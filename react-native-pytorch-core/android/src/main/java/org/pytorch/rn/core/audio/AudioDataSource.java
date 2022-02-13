/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.MediaDataSource;
import java.io.IOException;

public class AudioDataSource extends MediaDataSource {

  private byte[] dataBuffer;

  public AudioDataSource(final byte[] buffer) {
    this.dataBuffer = buffer;
  }

  @Override
  public synchronized int readAt(long position, byte[] buffer, int offset, int size)
      throws IOException {
    synchronized (dataBuffer) {
      int length = dataBuffer.length;
      if (position >= length) {
        return -1; // -1 indicates EOF
      }
      if (position + size > length) {
        size -= (position + size) - length;
      }
      System.arraycopy(dataBuffer, (int) position, buffer, offset, size);
      return size;
    }
  }

  @Override
  public synchronized long getSize() throws IOException {
    synchronized (dataBuffer) {
      return dataBuffer.length;
    }
  }

  @Override
  public synchronized void close() throws IOException {}
}
