/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import com.facebook.react.bridge.ReadableMap;
import java.nio.FloatBuffer;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.audio.IAudio;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class TensorFromAudioPacker implements Packer {

  private static final String AUDIO_KEY = "audio";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException {
    final String key = jobject.getString(AUDIO_KEY);
    final ReadableMap jsRef = params.getMap(key);
    final IAudio audio = JSContext.unwrapObject(jsRef);

    final short[] audioData = audio.getData();
    final FloatBuffer floatBuffer = Tensor.allocateFloatBuffer(audioData.length);
    for (short audioDatum : audioData) {
      floatBuffer.put(audioDatum / (float) Short.MAX_VALUE);
    }

    final Tensor tensor = Tensor.fromBlob(floatBuffer, new long[] {1, audioData.length});
    return IValue.from(tensor);
  }
}
