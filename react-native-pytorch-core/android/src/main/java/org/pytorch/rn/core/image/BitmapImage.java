/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;
import android.media.Image;
import androidx.annotation.Nullable;

public class BitmapImage extends AbstractImage {

  private final Bitmap mBitmap;

  public BitmapImage(Bitmap bitmap) {
    mBitmap = bitmap;
  }

  @Override
  public float getNaturalWidth() {
    return mBitmap.getWidth();
  }

  @Override
  public float getNaturalHeight() {
    return mBitmap.getHeight();
  }

  @Override
  public Bitmap getBitmap() {
    return mBitmap;
  }

  @Nullable
  @Override
  public Image getImage() {
    return null;
  }

  @Override
  public int getImageRotationDegrees() {
    return 0;
  }

  @Override
  public void close() throws Exception {
    mBitmap.recycle();
  }
}
