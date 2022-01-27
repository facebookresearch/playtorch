/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import java.util.Iterator;
import java.util.Map;
import javax.annotation.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;

public class BaseIValuePacker implements IIValuePacker {

  private static final String PACK_KEY = "pack";
  private static final String UNPACK_KEY = "unpack";
  private static final String JS_OUTPUT_KEY = "output";

  protected final @Nullable String mSpecSrc;
  protected final @Nullable JSONObject mSpecSrcJson;

  public BaseIValuePacker(final @Nullable String specSrc) throws JSONException {
    if (specSrc != null) {
      mSpecSrc = specSrc;
      mSpecSrcJson = new JSONObject(specSrc);
    } else {
      mSpecSrc = null;
      mSpecSrcJson = null;
    }
  }

  private String applyParams(final String specSrc, final ReadableMap params) {
    String src = specSrc;
    Iterator<Map.Entry<String, Object>> it = params.getEntryIterator();
    while (it.hasNext()) {
      Map.Entry<String, Object> entry = it.next();
      final String key = entry.getKey();
      final Object value = entry.getValue();
      if (value instanceof String) {
        src = src.replaceAll("\"\\$" + key + "\"", "\"" + value + "\"");
      } else {
        src = src.replaceAll("\"\\$" + key + "\"", toJsonString(value));
      }
    }
    return src;
  }

  @Override
  public IValue pack(final ReadableMap params, final PackerContext packerContext) throws Exception {
    return PackerRegistry.pack(
        new JSONObject(applyParams(mSpecSrc, params)).getJSONObject(PACK_KEY),
        params,
        packerContext);
  }

  @Override
  public ReadableMap unpack(
      final IValue output, final ReadableMap params, final PackerContext packerContext)
      throws Exception {
    WritableMap map = new WritableNativeMap();
    if (mSpecSrcJson == null) {
      map.putArray(JS_OUTPUT_KEY, JavaOnlyArray.of(output.toTensor().getDataAsFloatArray()));
      return map;
    }

    PackerRegistry.unpack(
        output,
        new JSONObject(applyParams(mSpecSrc, params)).getJSONObject(UNPACK_KEY),
        map,
        packerContext);
    return map;
  }

  @Override
  public PackerContext newContext() {
    return new PackerContext(mSpecSrcJson);
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

  private static String toJsonString(Object o) {
    return o.toString();
  }
}
