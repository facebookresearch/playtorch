/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import androidx.annotation.experimental.UseExperimental;
import androidx.camera.core.ImageProxy;

public class ImageProxyImage extends AbstractImage {

  private final ImageProxy mImageProxy;
  private final Context mContext;
  private Bitmap mBitmap;

  public ImageProxyImage(ImageProxy imageProxy, Context context) {
    mImageProxy = imageProxy;
    mContext = context;
  }

  @Override
  public int getWidth() {
    return mImageProxy.getWidth();
  }

  @Override
  public int getHeight() {
    return mImageProxy.getHeight();
  }

  @Override
  @UseExperimental(markerClass = androidx.camera.core.ExperimentalGetImage.class)
  public Bitmap getBitmap() {
    if (mBitmap != null) {
      return mBitmap;
    }
    android.media.Image image = mImageProxy.getImage();
    assert image != null;
    mBitmap = ImageUtils.toBitmap(image, mContext);

    // Rotate bitmap based on image rotation. The image rotation for ImageProxy is set in the
    // CameraManager whenever the device rotates.
    int rotation = mImageProxy.getImageInfo().getRotationDegrees();
    if (rotation != 0) {
      Matrix matrix = new Matrix();
      matrix.postRotate(rotation);
      mBitmap =
          Bitmap.createBitmap(mBitmap, 0, 0, mBitmap.getWidth(), mBitmap.getHeight(), matrix, true);
    }

    return mBitmap;
  }

  @Override
  public void close() throws Exception {
    if (mBitmap != null) {
      mBitmap.recycle();
    }
    mImageProxy.close();
  }
}
