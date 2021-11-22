/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.content.Context;
import android.graphics.Bitmap;
import androidx.camera.core.ImageProxy;

public class Image implements IImage {
  private final IImage mImage;

  public Image(Bitmap bitmap) {
    mImage = new BitmapImage(bitmap);
  }

  public Image(ImageProxy imageProxy, Context context) {
    mImage = new ImageProxyImage(imageProxy, context);
  }

  @Override
  public int getWidth() {
    return mImage.getWidth();
  }

  @Override
  public int getHeight() {
    return mImage.getHeight();
  }

  @Override
  public IImage scale(float sx, float sy) {
    return mImage.scale(sx, sy);
  }

  @Override
  public Bitmap getBitmap() {
    return mImage.getBitmap();
  }

  @Override
  public void close() throws Exception {
    mImage.close();
  }
}
