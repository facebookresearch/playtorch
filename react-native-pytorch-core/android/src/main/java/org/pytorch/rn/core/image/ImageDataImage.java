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
import org.pytorch.rn.core.canvas.ImageData;

public class ImageDataImage extends AbstractImage {

  private final ImageData mImageData;
  private final float mPixelDensity;

  public ImageDataImage(ImageData imageData, float pixelDensity) {
    mImageData = imageData;
    mPixelDensity = pixelDensity;
  }

  @Override
  public float getPixelDensity() {
    return mPixelDensity;
  }

  @Override
  public float getNaturalWidth() {
    return mImageData.getWidth();
  }

  @Override
  public float getNaturalHeight() {
    return mImageData.getHeight();
  }

  @Override
  public Bitmap getBitmap() {
    return mImageData.getBitmap();
  }

  @Override
  public void close() throws Exception {
    mImageData.getBitmap().recycle();
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
}
