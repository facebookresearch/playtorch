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

public interface IImage extends AutoCloseable {
  float getPixelDensity();

  int getWidth();

  int getHeight();

  float getNaturalWidth();

  float getNaturalHeight();

  IImage scale(float sx, float sy);

  Bitmap getBitmap();

  @Nullable
  Image getImage();

  int getImageRotationDegrees();
}
