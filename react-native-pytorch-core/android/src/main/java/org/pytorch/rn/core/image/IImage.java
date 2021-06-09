/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;

public interface IImage extends AutoCloseable {
  public float getPixelDensity();

  public int getWidth();

  public int getHeight();

  public float getNaturalWidth();

  public float getNaturalHeight();

  public IImage scale(float sx, float sy);

  public Bitmap getBitmap();
}
