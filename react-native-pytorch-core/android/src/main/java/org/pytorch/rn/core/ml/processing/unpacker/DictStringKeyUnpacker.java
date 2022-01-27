/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class DictStringKeyUnpacker implements Unpacker {

  private static final String DICT_KEY_KEY = "dict_key";
  private static final String ITEMS_KEY = "items";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException, IOException {
    final Map<String, IValue> dictStringKey = ivalue.toDictStringKey();
    final JSONArray jarray = jobject.getJSONArray(ITEMS_KEY);

    final int len = jarray.length();
    for (int i = 0; i < len; ++i) {
      final JSONObject childJObject = jarray.getJSONObject(i);
      final String key = childJObject.getString(DICT_KEY_KEY);
      final IValue childIValue = dictStringKey.get(key);

      if (childIValue == null) {
        throw new IllegalStateException("Unpack dict missing key '" + key + "'");
      }

      PackerRegistry.unpack(childIValue, childJObject, result, packerContext);
    }
  }
}
