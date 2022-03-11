/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class BoundingBoxesUnpacker implements Unpacker {

  private static final String KEY_KEY = "key";
  private static final String PRED_LOGITS_KEY = "pred_logits";
  private static final String PRED_BOXES_KEY = "pred_boxes";
  private static final String CLASSES_KEY = "classes";
  private static final String BOUNDS_KEY = "bounds";
  private static final String OBJECT_CLASS_KEY = "objectClass";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException, IOException {
    final Map<String, IValue> map = ivalue.toDictStringKey();
    IValue predLogits = map.get(PRED_LOGITS_KEY);
    IValue predBoxes = map.get(PRED_BOXES_KEY);

    final String PROBABILITY_THRESHOLD_KEY = "probabilityThreshold";
    if (!jobject.has(PROBABILITY_THRESHOLD_KEY)) {
      throw new IllegalStateException(
          "model param value for " + PROBABILITY_THRESHOLD_KEY + " is missing [0, 1]");
    }
    double probabilityThreshold = jobject.getDouble(PROBABILITY_THRESHOLD_KEY);

    String[] classes;
    if (packerContext.get(CLASSES_KEY) != null) {
      classes = (String[]) packerContext.get(CLASSES_KEY);
    } else {
      if (!jobject.has(CLASSES_KEY)) {
        throw new IllegalStateException(
            CLASSES_KEY
                + "classes property is missing in the unpack definition for bounding_boxes unpack type");
      }
      try {
        JSONArray classesArray = jobject.getJSONArray(CLASSES_KEY);
        classes = toStringArray(classesArray);
        packerContext.store(CLASSES_KEY, classes);
      } catch (JSONException e) {
        throw new IllegalStateException(
            CLASSES_KEY
                + "classes property in the unpack definition for bounding_boxes needs to be an array of strings");
      }
    }

    final Tensor predLogitsTensor = predLogits.toTensor();
    final float[] confidencesTensor = predLogitsTensor.getDataAsFloatArray();
    final long[] confidencesShape = predLogitsTensor.shape();
    final int numClasses = (int) predLogitsTensor.shape()[2];

    final Tensor predBoxesTensor = predBoxes.toTensor();
    final float[] locationsTensor = predBoxesTensor.getDataAsFloatArray();
    final long[] locationsShape = predBoxesTensor.shape();

    WritableArray resultBoxes = Arguments.createArray();

    for (int i = 0; i < confidencesShape[1]; i++) {
      float[] scores = softmax(confidencesTensor, i * numClasses, (i + 1) * numClasses);

      float maxProb = scores[0];
      int maxIndex = 0;
      for (int j = 0; j < scores.length; j++) {
        if (scores[j] > maxProb) {
          maxProb = scores[j];
          maxIndex = j;
        }
      }

      if (maxProb <= probabilityThreshold || maxIndex >= classes.length) {
        continue;
      }

      WritableMap match = Arguments.createMap();
      match.putString(OBJECT_CLASS_KEY, classes[maxIndex]);

      int locationsFrom = (int) (i * locationsShape[2]);
      WritableArray bounds = Arguments.createArray();
      bounds.pushDouble(locationsTensor[locationsFrom]);
      bounds.pushDouble(locationsTensor[locationsFrom + 1]);
      bounds.pushDouble(locationsTensor[locationsFrom + 2]);
      bounds.pushDouble(locationsTensor[locationsFrom + 3]);
      match.putArray(BOUNDS_KEY, bounds);

      resultBoxes.pushMap(match);
    }

    final String key = jobject.getString(KEY_KEY);
    result.putArray(key, resultBoxes);
  }

  private static float[] softmax(float[] data, int from, int to) {
    float[] softmax = new float[to - from];
    float expSum = 0;

    for (int i = from; i < to; i++) {
      softmax[i - from] = (float) Math.exp(data[i]);
      expSum += softmax[i - from];
    }

    for (int i = 0; i < softmax.length; i++) {
      softmax[i] /= expSum;
    }
    return softmax;
  }

  private static String[] toStringArray(JSONArray array) throws JSONException {
    String[] arr = new String[array.length()];
    for (int i = 0; i < arr.length; i++) {
      arr[i] = array.getString(i);
    }
    return arr;
  }
}
