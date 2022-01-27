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

public class ScaleTransform implements IImageTransform {

  private static final String WIDTH_KEY = "width";
  private static final String HEIGHT_KEY = "height";

  private final int width;
  private final int height;

  public ScaleTransform(int width, int height) {
    this.width = width;
    this.height = height;
  }

  public static ScaleTransform parse(JSONObject jobject) throws JSONException {
    if (!jobject.has(WIDTH_KEY) || !jobject.has(HEIGHT_KEY)) {
      throw new JSONException(
          WIDTH_KEY + " and " + HEIGHT_KEY + " property are required for scale transform");
    }
    return new ScaleTransform(jobject.getInt(WIDTH_KEY), jobject.getInt(HEIGHT_KEY));
  }

  @Override
  public Bitmap transform(Bitmap bitmap) {
    return Bitmap.createScaledBitmap(bitmap, width, height, false);
  }
}
