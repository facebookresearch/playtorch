/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import java.util.HashMap;

public class PackerContext {
  private final HashMap<String, Object> mMap;

  public PackerContext() {
    this.mMap = new HashMap<String, Object>();
  }

  public void store(String key, Object value) {
    this.mMap.put(key, value);
  }

  public Object get(String key) {
    return this.mMap.get(key);
  }
}
