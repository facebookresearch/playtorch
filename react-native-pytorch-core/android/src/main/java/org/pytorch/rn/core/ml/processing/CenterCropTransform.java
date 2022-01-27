/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.Bitmap;
import org.json.JSONException;
import org.json.JSONObject;

public class CenterCropTransform implements IImageTransform {

  private static final String WIDTH_KEY = "width";
  private static final String HEIGHT_KEY = "height";

  private final float outWidth;
  private final float outHeight;

  protected CenterCropTransform(int outWidth, int outHeight) {
    this.outWidth = outWidth;
    this.outHeight = outHeight;
  }

  public static CenterCropTransform parse(JSONObject jobject) throws JSONException {
    // If no width or height is defined, it will fallback to a default crop
    // ratio, which means it will center crop to the min dimension of the input
    // image.
    if (!jobject.has(WIDTH_KEY) || !jobject.has(HEIGHT_KEY)) {
      return new CenterCropTransform(-1, -1);
    }
    int width = jobject.getInt(WIDTH_KEY);
    int height = jobject.getInt(HEIGHT_KEY);
    return new CenterCropTransform(width, height);
  }

  @Override
  public Bitmap transform(Bitmap bitmap) {
    final float width = (float) bitmap.getWidth();
    final float height = (float) bitmap.getHeight();

    final float ratio = width / height;
    final float cropRatio = outWidth / outHeight;
    float cropWidth;
    float cropHeight;
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

    final float offsetX = (width - cropWidth) / 2;
    final float offsetY = (height - cropHeight) / 2;

    return Bitmap.createBitmap(
        bitmap, (int) offsetX, (int) offsetY, (int) cropWidth, (int) cropHeight);
  }
}
