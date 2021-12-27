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

class ScaleTransform implements IImageTransform {

  private final int width;
  private final int height;

  public ScaleTransform(int width, int height) {
    this.width = width;
    this.height = height;
  }

  public static ScaleTransform parse(JSONObject jobject) throws JSONException {
    if (!jobject.has(BaseIValuePacker.JSON_WIDTH) || !jobject.has(BaseIValuePacker.JSON_HEIGHT)) {
      throw new JSONException(
          BaseIValuePacker.JSON_WIDTH
              + " and "
              + BaseIValuePacker.JSON_HEIGHT
              + " property are required for scale transform");
    }
    return new ScaleTransform(
        jobject.getInt(BaseIValuePacker.JSON_WIDTH), jobject.getInt(BaseIValuePacker.JSON_HEIGHT));
  }

  @Override
  public Bitmap transform(Bitmap bitmap) {
    return Bitmap.createScaledBitmap(bitmap, width, height, false);
  }
}
