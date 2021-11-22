/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;

public class BitmapImage extends AbstractImage {

  private final Bitmap mBitmap;

  public BitmapImage(Bitmap bitmap) {
    mBitmap = bitmap;
  }

  @Override
  public int getWidth() {
    return mBitmap.getWidth();
  }

  @Override
  public int getHeight() {
    return mBitmap.getHeight();
  }

  @Override
  public Bitmap getBitmap() {
    return mBitmap;
  }

  @Override
  public void close() throws Exception {
    mBitmap.recycle();
  }
}
