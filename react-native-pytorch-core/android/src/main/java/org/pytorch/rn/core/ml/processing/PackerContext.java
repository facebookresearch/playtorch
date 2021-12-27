/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import java.util.HashMap;
import org.json.JSONObject;

public class PackerContext {
  private final HashMap<String, Object> mMap = new HashMap<>();
  public final JSONObject specSrcJson;

  PackerContext(JSONObject specSrcJson) {
    this.specSrcJson = specSrcJson;
  }

  public void store(String key, Object value) {
    this.mMap.put(key, value);
  }

  public Object get(String key) {
    return this.mMap.get(key);
  }
}
