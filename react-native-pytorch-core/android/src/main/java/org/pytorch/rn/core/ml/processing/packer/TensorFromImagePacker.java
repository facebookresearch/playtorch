/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import android.graphics.Bitmap;
import android.graphics.ImageFormat;
import android.media.Image;
import com.facebook.react.bridge.ReadableMap;
import java.util.ArrayList;
import javax.annotation.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.ml.processing.CameraImageCenterCropScaleRgbNormTransform;
import org.pytorch.rn.core.ml.processing.CenterCropTransform;
import org.pytorch.rn.core.ml.processing.GreyScaleNormTransform;
import org.pytorch.rn.core.ml.processing.IImageToTensorTransform;
import org.pytorch.rn.core.ml.processing.IImageTransform;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.RgbNormTransform;
import org.pytorch.rn.core.ml.processing.ScaleTransform;

public class TensorFromImagePacker implements Packer {

  private static final String TYPE_KEY = "type";
  private static final String NAME_KEY = "name";
  private static final String TRANSFORMS_KEY = "transforms";

  private static final String IMAGE_TRANSFORM_TYPE_TENSOR_KEY = "image_to_tensor";
  private static final String IMAGE_TRANSFORM_TYPE_IMAGE_KEY = "image_to_image";

  private static final String IMAGE_TRANSFORM_TENSOR_RGB_NORM_KEY = "rgb_norm";
  private static final String IMAGE_TRANSFORM_TENSOR_GREYSCALE_NORM_KEY = "greyscale_norm";
  private static final String IMAGE_TRANSFORM_IMAGE_SCALE_KEY = "scale";
  private static final String IMAGE_TRANSFORM_IMAGE_CENTER_CROP_KEY = "center_crop";
  private static final String IMAGE_TRANSFORM_IMAGE_CENTER_CROP_SCALE_RGB_NORM_KEY =
      "center_crop_scale_rgb_norm";
  private static final String WIDTH_KEY = "width";
  private static final String HEIGHT_KEY = "height";
  private static final String MEAN_KEY = "mean";
  private static final String STD_KEY = "std";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException {
    final String key = jobject.getString("image");
    final ReadableMap jsRef = params.getMap(key);
    final IImage image = JSContext.unwrapObject(jsRef);

    return IValue.from(doImageTransforms(jobject.getJSONArray(TRANSFORMS_KEY), image));
  }

  private static Tensor doImageTransforms(final JSONArray jarray, final IImage image)
      throws JSONException {
    final int n = jarray.length();

    final ArrayList<ImageTransformObject> imageTransforms = new ArrayList<>();
    for (int i = 0; i < n; ++i) {
      final JSONObject jobject = jarray.getJSONObject(i);
      imageTransforms.add(
          new ImageTransformObject(
              jobject.getString(TYPE_KEY), jobject.getString(NAME_KEY), jobject));
    }

    final Image cameraImage = image.getImage();
    final int cameraImageRotationDegrees = image.getImageRotationDegrees();

    if (cameraImage != null && cameraImage.getFormat() == ImageFormat.YUV_420_888) {
      final @Nullable Tensor tensor =
          doCameraImageTransforms(imageTransforms, cameraImage, cameraImageRotationDegrees);
      if (tensor != null) {
        return tensor;
      }
    }

    Object x = image.getBitmap();
    for (int i = 0; i < n; ++i) {
      final ImageTransformObject ito = imageTransforms.get(i);

      if (IMAGE_TRANSFORM_TYPE_IMAGE_KEY.equals(ito.type)) {
        IImageTransform transform = null;
        switch (ito.name) {
          case IMAGE_TRANSFORM_IMAGE_CENTER_CROP_KEY:
            transform = CenterCropTransform.parse(ito.jobject);
            break;
          case IMAGE_TRANSFORM_IMAGE_SCALE_KEY:
            transform = ScaleTransform.parse(ito.jobject);
            break;
        }
        if (transform == null) {
          throw new IllegalArgumentException("Unknown image_to_image transform");
        }
        x = transform.transform((Bitmap) x);
      } else if (IMAGE_TRANSFORM_TYPE_TENSOR_KEY.equals(ito.type)) {
        IImageToTensorTransform transform = null;
        switch (ito.name) {
          case IMAGE_TRANSFORM_TENSOR_RGB_NORM_KEY:
            transform = RgbNormTransform.parse(ito.jobject);
            break;
          case IMAGE_TRANSFORM_TENSOR_GREYSCALE_NORM_KEY:
            transform = GreyScaleNormTransform.parse(ito.jobject);
            break;
        }
        if (transform == null) {
          throw new IllegalArgumentException("Unknown image_to_tensor transform");
        }
        x = transform.transform((Bitmap) x);
      }
    }
    return (Tensor) x;
  }

  private static @Nullable Tensor doCameraImageTransforms(
      final ArrayList<ImageTransformObject> imageTransforms,
      final Image image,
      final int rotationDegrees)
      throws JSONException {
    // Supporting
    // 1. image_to_tensor/center_crop_scale_rgb_norm
    // 2. image_to_image/center_crop -> image_to_image/scale -> image_to_tensor/rgb_norm
    final int size = imageTransforms.size();
    if (size == 0) {
      final ImageTransformObject t0 = imageTransforms.get(0);
      if (isImageTransformTensorCenterCropScaleRGBNorm(t0.type, t0.name)) {
        CameraImageCenterCropScaleRgbNormTransform transform =
            CameraImageCenterCropScaleRgbNormTransform.parse(t0.jobject);
        return transform.transform(image, rotationDegrees);
      }
    } else if (size == 3) {
      final ImageTransformObject t0 = imageTransforms.get(0);
      final ImageTransformObject t1 = imageTransforms.get(1);
      final ImageTransformObject t2 = imageTransforms.get(2);

      if (isImageTransformImageCenterCrop(t0.type, t0.name)
          && isImageTransformImageScale(t1.type, t1.name)
          && isImageTransformTensorRGBNorm(t2.type, t2.name)) {

        CameraImageCenterCropScaleRgbNormTransform transform =
            new CameraImageCenterCropScaleRgbNormTransform(
                t1.jobject.getInt(WIDTH_KEY),
                t1.jobject.getInt(HEIGHT_KEY),
                TensorFromImagePacker.readFloatArray(t2.jobject, MEAN_KEY),
                TensorFromImagePacker.readFloatArray(t2.jobject, STD_KEY));
        return transform.transform(image, rotationDegrees);
      }
    }
    return null;
  }

  static float[] readFloatArray(final JSONObject jobject, final String key) throws JSONException {
    final JSONArray jarray = jobject.getJSONArray(key);
    final int len = jarray.length();
    float[] array = new float[jarray.length()];
    for (int i = 0; i < len; ++i) {
      array[i] = (float) jarray.getDouble(i);
    }
    return array;
  }

  private static boolean isImageTransformTensorRGBNorm(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_TENSOR_KEY.equals(type)
        && IMAGE_TRANSFORM_TENSOR_RGB_NORM_KEY.equals(name);
  }

  private static boolean isImageTransformTensorCenterCropScaleRGBNorm(
      final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_TENSOR_KEY.equals(type)
        && IMAGE_TRANSFORM_IMAGE_CENTER_CROP_SCALE_RGB_NORM_KEY.equals(name);
  }

  private static boolean isImageTransformImageCenterCrop(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_IMAGE_KEY.equals(type)
        && IMAGE_TRANSFORM_IMAGE_CENTER_CROP_KEY.equals(name);
  }

  private static boolean isImageTransformImageScale(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_IMAGE_KEY.equals(type)
        && IMAGE_TRANSFORM_IMAGE_SCALE_KEY.equals(name);
  }

  private static class ImageTransformObject {
    public final String type;
    public final String name;
    public final JSONObject jobject;

    public ImageTransformObject(String type, String name, JSONObject jobject) {
      this.type = type;
      this.name = name;
      this.jobject = jobject;
    }
  }
}
