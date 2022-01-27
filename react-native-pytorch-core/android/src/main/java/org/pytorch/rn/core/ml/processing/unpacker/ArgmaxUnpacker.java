/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.WritableMap;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class ArgmaxUnpacker implements Unpacker {

  private static final String VALUE_KEY = "valueKey";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException {
    final String key = jobject.getString("key");
    String valueKey = null;
    if (jobject.has(VALUE_KEY)) {
      valueKey = jobject.getString(VALUE_KEY);
    }
    final String dtype = jobject.getString("dtype");

    int maxIdx;
    switch (dtype) {
      case "float":
        float[] floatData = ivalue.toTensor().getDataAsFloatArray();
        maxIdx = unpackArgmaxFloatData(floatData);
        result.putInt(key, maxIdx);
        if (valueKey != null) {
          float[] floatSoftmax = softmax(floatData);
          result.putDouble(valueKey, floatSoftmax[maxIdx]);
        }
        break;
      case "long":
        long[] longData = ivalue.toTensor().getDataAsLongArray();
        maxIdx = unpackArgmaxLongData(longData);
        result.putInt(key, maxIdx);
        if (valueKey != null) {
          float[] floatSoftmax = softmax(longData);
          result.putDouble(valueKey, floatSoftmax[maxIdx]);
        }
        break;
      default:
        throw new IllegalArgumentException("Unknown dtype");
    }
  }

  private static int unpackArgmaxFloatData(float[] data) {
    float maxValue = -Float.MAX_VALUE;
    int maxIdx = -1;
    for (int i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  private static int unpackArgmaxLongData(long[] data) {
    long maxValue = -Long.MAX_VALUE;
    int maxIdx = -1;
    for (int i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  private static float[] softmax(float[] data) {
    final float[] result = new float[data.length];
    float expSum = 0;

    for (int i = 0; i < data.length; i++) {
      result[i] = (float) Math.exp(data[i]);
      expSum += result[i];
    }

    for (int i = 0; i < data.length; i++) {
      result[i] /= expSum;
    }
    return result;
  }

  private static float[] softmax(long[] data) {
    final float[] result = new float[data.length];
    float expSum = 0;

    for (int i = 0; i < data.length; i++) {
      result[i] = (float) Math.exp(data[i]);
      expSum += result[i];
    }

    for (int i = 0; i < result.length; i++) {
      result[i] /= expSum;
    }
    return result;
  }
}
