/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import com.facebook.react.bridge.ReadableMap;
import java.io.IOException;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;

public interface Packer {
  IValue pack(final JSONObject jobject, final ReadableMap params, final PackerContext packerContext)
      throws JSONException, IOException;
}
