/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class TensorUnpacker implements Unpacker {

  private static final String KEY_KEY = "key";
  private static final String DTYPE_KEY = "dtype";
  private static final String FLOAT_KEY = "float";
  private static final String LONG_KEY = "long";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException {
    final String key = jobject.getString(KEY_KEY);
    final String dtype = jobject.getString(DTYPE_KEY);
    Tensor tensor = ivalue.toTensor();
    switch (dtype) {
      case FLOAT_KEY:
        result.putArray(key, unpackTensorFloatData(tensor));
        return;
      case LONG_KEY:
        result.putArray(key, unpackTensorLongData(tensor));
        return;
    }

    throw new IllegalArgumentException("Unknown dtype");
  }

  private static ReadableArray unpackTensorFloatData(Tensor tensor) {
    final float[] data = tensor.getDataAsFloatArray();
    final WritableArray array = new WritableNativeArray();
    for (float datum : data) {
      array.pushDouble(datum);
    }
    return array;
  }

  private static ReadableArray unpackTensorLongData(Tensor tensor) {
    final long[] data = tensor.getDataAsLongArray();
    final WritableArray array = new WritableNativeArray();
    for (long datum : data) {
      array.pushInt((int) datum);
    }
    return array;
  }
}
