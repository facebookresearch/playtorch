/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import com.facebook.react.bridge.ReadableMap;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;

public class TuplePacker implements Packer {

  private static final String ITEMS_KEY = "items";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException, IOException {
    final JSONArray jarray = jobject.getJSONArray(ITEMS_KEY);
    final int len = jarray.length();
    final IValue[] array = new IValue[len];
    for (int i = 0; i < len; ++i) {
      array[i] = PackerRegistry.pack(jarray.getJSONObject(i), params, packerContext);
    }
    return IValue.tupleFrom(array);
  }
}
