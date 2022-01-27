/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import com.facebook.react.bridge.ReadableMap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class TensorPacker implements Packer {

  private static final String SIZES_KEY = "sizes";
  private static final String ITEMS_KEY = "items";
  private static final String DTYPE_KEY = "dtype";
  private static final String FLOAT_KEY = "float";
  private static final String LONG_KEY = "long";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException {
    final String dtype = jobject.getString(DTYPE_KEY);
    final long[] sizes = readLongArray(jobject, SIZES_KEY);

    switch (dtype) {
      case FLOAT_KEY:
        return IValue.from(Tensor.fromBlob(readFloatArray(jobject, ITEMS_KEY), sizes));
      case LONG_KEY:
        return IValue.from(Tensor.fromBlob(readLongArray(jobject, ITEMS_KEY), sizes));
    }

    throw new IllegalStateException("Unknown dtype");
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

  static long[] readLongArray(final JSONObject jsonObject, final String key) throws JSONException {
    final JSONArray jarray = jsonObject.getJSONArray(key);
    final int len = jarray.length();
    long[] array = new long[jarray.length()];
    for (int i = 0; i < len; ++i) {
      array[i] = jarray.getLong(i);
    }
    return array;
  }
}
