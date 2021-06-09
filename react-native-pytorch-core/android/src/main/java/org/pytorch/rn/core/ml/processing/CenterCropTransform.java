/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.Bitmap;
import org.json.JSONException;
import org.json.JSONObject;

class CenterCropTransform implements IImageTransform {

  private final int outWidth;
  private final int outHeight;

  protected CenterCropTransform(int outWidth, int outHeight) {
    this.outWidth = outWidth;
    this.outHeight = outHeight;
  }

  protected static CenterCropTransform parse(JSONObject jobject) throws JSONException {
    int width = jobject.getInt("width");
    int height = jobject.getInt("height");
    return new CenterCropTransform(width, height);
  }

  @Override
  public Bitmap transform(Bitmap bitmap) {
    final int width = bitmap.getWidth();
    final int height = bitmap.getHeight();

    final float ratio = width / height;
    final float cropRatio = outWidth / outHeight;
    int cropWidth;
    int cropHeight;
    if (cropRatio > ratio) {
      // landscape
      cropWidth = width;
      cropHeight = (int) Math.floor(cropWidth / cropRatio);
    } else {
      // portrait
      cropHeight = height;
      cropWidth = (int) Math.floor(cropHeight * cropRatio);
    }

    if (cropWidth > width || cropHeight > height) {
      throw new IllegalStateException();
    }

    final int offsetX = (width - cropWidth) / 2;
    final int offsetY = (height - cropHeight) / 2;

    return Bitmap.createBitmap(bitmap, offsetX, offsetY, cropWidth, cropHeight);
  }
}
