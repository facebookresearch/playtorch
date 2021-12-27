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

class CenterCropTransform implements IImageTransform {

  private final float outWidth;
  private final float outHeight;

  protected CenterCropTransform(int outWidth, int outHeight) {
    this.outWidth = outWidth;
    this.outHeight = outHeight;
  }

  protected static CenterCropTransform parse(JSONObject jobject) throws JSONException {
    // If no width or height is defined, it will fallback to a default crop
    // ratio, which means it will center crop to the min dimension of the input
    // image.
    if (!jobject.has(BaseIValuePacker.JSON_WIDTH) || !jobject.has(BaseIValuePacker.JSON_HEIGHT)) {
      return new CenterCropTransform(-1, -1);
    }
    int width = jobject.getInt(BaseIValuePacker.JSON_WIDTH);
    int height = jobject.getInt(BaseIValuePacker.JSON_HEIGHT);
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
