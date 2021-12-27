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

class RgbNormTransform implements IImageToTensorTransform {

  private final float[] mean;
  private final float[] std;

  public RgbNormTransform(final float[] mean, final float[] std) {
    this.mean = mean;
    this.std = std;
  }

  public static RgbNormTransform parse(JSONObject jobject) throws JSONException {
    return new RgbNormTransform(
        BaseIValuePacker.readFloatArray(jobject, "mean"),
        BaseIValuePacker.readFloatArray(jobject, "std"));
  }

  @Override
  public Tensor transform(Bitmap bitmap) {
    return TensorImageUtils.bitmapToFloat32Tensor(bitmap, mean, std, MemoryFormat.CHANNELS_LAST);
  }
}
