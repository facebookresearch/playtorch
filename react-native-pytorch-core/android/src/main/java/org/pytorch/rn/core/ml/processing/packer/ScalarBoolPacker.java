/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import com.facebook.react.bridge.ReadableMap;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class ScalarBoolPacker implements Packer {

  private static final String VALUE_KEY = "value";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException {
    final boolean value = jobject.getBoolean(VALUE_KEY);
    return IValue.from(value);
  }
}
