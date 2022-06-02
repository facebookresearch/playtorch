/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import android.graphics.Bitmap;

public class ImageData {

  private final int mScaledWidth;
  private final int mScaledHeight;
  private final Bitmap mBitmap;

  public ImageData(Bitmap bitmap, int scaledWidth, int scaledHeight) {
    mBitmap = bitmap;
    mScaledWidth = scaledWidth;
    mScaledHeight = scaledHeight;
  }

  public int getWidth() {
    return mBitmap.getWidth();
  }

  public int getHeight() {
    return mBitmap.getHeight();
  }

  public Bitmap getBitmap() {
    return mBitmap;
  }

  public Bitmap getScaledBitmap() {
    return Bitmap.createScaledBitmap(mBitmap, mScaledWidth, mScaledHeight, false);
  }
}
