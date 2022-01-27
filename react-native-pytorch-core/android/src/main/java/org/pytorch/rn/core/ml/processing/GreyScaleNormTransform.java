/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.Bitmap;
import android.graphics.Color;
import androidx.annotation.ColorInt;
import java.nio.FloatBuffer;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.MemoryFormat;
import org.pytorch.Tensor;

public class GreyScaleNormTransform implements IImageToTensorTransform {

  private static final String MEAN_KEY = "mean";
  private static final String STD_KEY = "std";

  private final @ColorInt int colorBackground;
  private final @ColorInt int colorForeground;
  private final float mean;
  private final float std;

  public GreyScaleNormTransform(
      final @ColorInt int colorBackground,
      final @ColorInt int colorForeground,
      final float mean,
      final float std) {
    this.colorBackground = colorBackground;
    this.colorForeground = colorForeground;
    this.mean = mean;
    this.std = std;
  }

  private static float colorCartesianDistance(@ColorInt int colorLhs, @ColorInt int colorRhs) {
    final int r0 = Color.red(colorLhs);
    final int g0 = Color.green(colorLhs);
    final int b0 = Color.blue(colorLhs);

    final int r1 = Color.red(colorRhs);
    final int g1 = Color.green(colorRhs);
    final int b1 = Color.blue(colorRhs);

    return (float) Math.sqrt((r0 - r1) * (r0 - r1) + (g0 - g1) * (g0 - g1) + (b0 - b1) * (b0 - b1));
  }

  @Override
  public Tensor transform(final Bitmap bitmap) {
    final int width = bitmap.getWidth();
    final int height = bitmap.getHeight();
    final FloatBuffer floatBuffer = Tensor.allocateFloatBuffer(width * height);

    for (int y = 0; y < height; ++y) {
      for (int x = 0; x < width; ++x) {
        @ColorInt int c = bitmap.getPixel(x, y);
        final float d0 = colorCartesianDistance(c, colorBackground);
        final float d1 = colorCartesianDistance(c, colorForeground);
        final float value = d0 / (d0 + d1);
        floatBuffer.put((value - mean) / std);
      }
    }

    return Tensor.fromBlob(
        floatBuffer, new long[] {1, 1, height, width}, MemoryFormat.CHANNELS_LAST);
  }

  public static GreyScaleNormTransform parse(JSONObject jobject) throws JSONException {
    return new GreyScaleNormTransform(
        Color.parseColor(jobject.getString("colorBackground")),
        Color.parseColor(jobject.getString("colorForeground")),
        (float) jobject.getDouble(MEAN_KEY),
        (float) jobject.getDouble(STD_KEY));
  }
}
