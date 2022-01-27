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
import org.pytorch.MemoryFormat;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;

public class RgbNormTransform implements IImageToTensorTransform {

  private static final String MEAN_KEY = "mean";
  private static final String STD_KEY = "std";

  private final float[] mean;
  private final float[] std;

  public RgbNormTransform(final float[] mean, final float[] std) {
    this.mean = mean;
    this.std = std;
  }

  public static RgbNormTransform parse(JSONObject jobject) throws JSONException {
    return new RgbNormTransform(
        BaseIValuePacker.readFloatArray(jobject, MEAN_KEY),
        BaseIValuePacker.readFloatArray(jobject, STD_KEY));
  }

  @Override
  public Tensor transform(Bitmap bitmap) {
    return TensorImageUtils.bitmapToFloat32Tensor(bitmap, mean, std, MemoryFormat.CHANNELS_LAST);
  }
}
