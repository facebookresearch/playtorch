/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

public class Audio implements IAudio {
  private final short[] mData;

  public Audio(short[] data) {
    this.mData = data;
  }

  public short[] getData() {
    return mData;
  }
}
