/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;
import android.graphics.Matrix;

public abstract class AbstractImage implements IImage {

  @Override
  public float getPixelDensity() {
    return 1.0f;
  }

  @Override
  public int getWidth() {
    int rotation = getImageRotationDegrees();
    if (rotation == 90 || rotation == 270) {
      return Math.round(getNaturalHeight() / getPixelDensity());
    }
    return Math.round(getNaturalWidth() / getPixelDensity());
  }

  @Override
  public int getHeight() {
    int rotation = getImageRotationDegrees();
    if (rotation == 90 || rotation == 270) {
      return Math.round(getNaturalWidth() / getPixelDensity());
    }
    return Math.round(getNaturalHeight() / getPixelDensity());
  }

  @Override
  public IImage scale(float sx, float sy) {
    Bitmap bitmap = getBitmap();
    int width = getWidth();
    int height = getHeight();
    Matrix matrix = new Matrix();
    matrix.postScale(sx, sy);
    Bitmap scaledBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
    return new Image(scaledBitmap);
  }
}
