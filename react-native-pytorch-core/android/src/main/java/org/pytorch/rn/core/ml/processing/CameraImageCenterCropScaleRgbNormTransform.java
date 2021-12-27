/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.ImageFormat;
import android.media.Image;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.MemoryFormat;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;

public class CameraImageCenterCropScaleRgbNormTransform {

  private final int mWidth;
  private final int mHeight;
  private final float[] mMean;
  private final float[] mStd;

  public CameraImageCenterCropScaleRgbNormTransform(
      int width, int height, float[] mean, float[] std) {
    this.mWidth = width;
    this.mHeight = height;
    this.mMean = mean;
    this.mStd = std;
  }

  public static CameraImageCenterCropScaleRgbNormTransform parse(JSONObject jobject)
      throws JSONException {
    return new CameraImageCenterCropScaleRgbNormTransform(
        jobject.getInt(BaseIValuePacker.JSON_WIDTH),
        jobject.getInt(BaseIValuePacker.JSON_HEIGHT),
        BaseIValuePacker.readFloatArray(jobject, BaseIValuePacker.JSON_MEAN),
        BaseIValuePacker.readFloatArray(jobject, BaseIValuePacker.JSON_STD));
  }

  public Tensor transform(Image image, int rotationDegrees) {
    if (image.getFormat() != ImageFormat.YUV_420_888) {
      throw new UnsupportedOperationException("image format YUV_420_888 required");
    }
    return TensorImageUtils.imageYUV420CenterCropToFloat32Tensor(
        image, rotationDegrees, mWidth, mHeight, mMean, mStd, MemoryFormat.CHANNELS_LAST);
  }
}
