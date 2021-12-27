/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

public class ImageData {

  private final int mWidth;
  private final int mHeight;
  private final byte[] mData;

  public ImageData(int width, int height, byte[] data) {
    mWidth = width;
    mHeight = height;
    mData = data;
  }

  public int getWidth() {
    return mWidth;
  }

  public int getHeight() {
    return mHeight;
  }

  public byte[] getData() {
    return mData;
  }
}
