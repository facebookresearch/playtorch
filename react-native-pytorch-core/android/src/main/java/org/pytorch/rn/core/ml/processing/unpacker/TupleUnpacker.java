/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class TupleUnpacker implements Unpacker {

  private static final String ITEMS_KEY = "items";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException, IOException {
    final IValue[] iarray = ivalue.toTuple();
    final JSONArray jarray = jobject.getJSONArray(ITEMS_KEY);

    if (iarray.length != jarray.length()) {
      throw new IllegalArgumentException("IValue and JSONArray sizes do not match");
    }
    int n = iarray.length;
    for (int i = 0; i < n; ++i) {
      PackerRegistry.unpack(iarray[i], jarray.getJSONObject(i), result, packerContext);
    }
  }
}
