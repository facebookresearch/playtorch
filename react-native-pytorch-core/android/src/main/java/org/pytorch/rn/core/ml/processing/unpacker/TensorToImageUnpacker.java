/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import android.graphics.Bitmap;
import android.graphics.Color;
import com.facebook.react.bridge.WritableMap;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class TensorToImageUnpacker implements Unpacker {

  private static final String KEY_KEY = "key";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException {
    Tensor tensor = ivalue.toTensor();
    Bitmap bitmap = tensorToBitmap(tensor);
    IImage image = new Image(bitmap);
    JSContext.NativeJSRef ref = JSContext.wrapObject(image);

    final String key = jobject.getString(KEY_KEY);
    result.putMap(key, ref.getJSRef());
  }

  private Bitmap tensorToBitmap(Tensor tensor) {
    float[] data = tensor.getDataAsFloatArray();
    long[] shape = tensor.shape();
    int width = (int) shape[3];
    int height = (int) shape[2];

    Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    // Determine the min/max value of data
    float max = 0;
    float min = Float.MAX_VALUE;
    for (float f : data) {
      if (f > max) {
        max = f;
      }
      if (f < min) {
        min = f;
      }
    }

    int delta = (int) (max - min);
    for (int i = 0; i < width * height; i++) {
      int r = (int) ((data[i] - min) / delta * 255.0f);
      int g = (int) ((data[i + width * height] - min) / delta * 255.0f);
      int b = (int) ((data[i + width * height * 2] - min) / delta * 255.0f);

      int x = i / height;
      int y = i % width;

      int color = Color.rgb(r, g, b);
      bitmap.setPixel(x, y, color);
    }
    return bitmap;
  }
}
