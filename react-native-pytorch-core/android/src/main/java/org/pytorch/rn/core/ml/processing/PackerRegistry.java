/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import java.util.HashMap;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;

public class PackerRegistry {

  private static final HashMap<String, Packer> mPackerMap = new HashMap<>();
  private static final HashMap<String, Unpacker> mUnpackerMap = new HashMap<>();

  private PackerRegistry() {}

  public static synchronized void register(final String type, final Packer packer) {
    if (mPackerMap.containsKey(type)) {
      throw new IllegalStateException("Packer for type '" + type + "' is already registered");
    }

    mPackerMap.put(type, packer);
  }

  public static synchronized void register(final String type, final Unpacker unpacker) {
    if (mUnpackerMap.containsKey(type)) {
      throw new IllegalStateException("Unpacker for type '" + type + "' is already registered");
    }

    mUnpackerMap.put(type, unpacker);
  }

  public static IValue pack(
      final JSONObject jobject, final ReadableMap params, final PackerContext packerContext)
      throws JSONException, IOException {
    final String type = jobject.getString("type");
    final Packer p = mPackerMap.get(type);
    if (p == null) {
      throw new IllegalStateException("Unknown type for packer: '" + type + "'");
    }
    return p.pack(jobject, params, packerContext);
  }

  public static void unpack(
      final IValue ivalue,
      final JSONObject jobject,
      final WritableMap map,
      final PackerContext packerContext)
      throws JSONException, IOException {
    final String type = jobject.getString("type");
    final Unpacker u = mUnpackerMap.get(type);
    if (u == null) {
      throw new IllegalStateException("Unknown type for unpacker: '" + type + "'");
    }
    u.unpack(ivalue, jobject, map, packerContext);
  }
}
