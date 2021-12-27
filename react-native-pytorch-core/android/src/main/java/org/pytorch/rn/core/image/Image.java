/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.content.Context;
import android.graphics.Bitmap;
import androidx.annotation.Nullable;
import androidx.camera.core.ImageProxy;
import org.pytorch.rn.core.canvas.ImageData;

public class Image implements IImage {
  private final IImage mImage;

  public Image(Bitmap bitmap) {
    mImage = new BitmapImage(bitmap);
  }

  public Image(ImageProxy imageProxy, Context context) {
    mImage = new ImageProxyImage(imageProxy, context);
  }

  public Image(ImageData imageData, float pixelDensity) {
    mImage = new ImageDataImage(imageData, pixelDensity);
  }

  @Override
  public float getPixelDensity() {
    return mImage.getPixelDensity();
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
  public float getNaturalWidth() {
    return mImage.getNaturalWidth();
  }

  @Override
  public float getNaturalHeight() {
    return mImage.getNaturalHeight();
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
  public @Nullable android.media.Image getImage() {
    return mImage.getImage();
  }

  @Override
  public int getImageRotationDegrees() {
    return mImage.getImageRotationDegrees();
  }

  @Override
  public void close() throws Exception {
    mImage.close();
  }
}
