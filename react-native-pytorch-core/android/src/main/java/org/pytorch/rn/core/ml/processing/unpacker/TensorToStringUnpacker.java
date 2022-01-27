/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.GPT2Tokenizer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class TensorToStringUnpacker implements Unpacker {

  private static final String KEY_KEY = "key";
  private static final String DECODER_KEY = "decoder";
  private static final String CONTEXT_GPT2_TOKENIZER_KEY = "gpt2_tokenizer";
  private static final String VOCABULARY_GPT2_KEY = "vocabulary_gpt2";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException, IOException {
    final String decodedString = decodeTensorToString(ivalue, jobject, packerContext);
    final String key = jobject.getString(KEY_KEY);
    result.putString(key, decodedString);
  }

  private String decodeTensorToString(
      final IValue ivalue, final JSONObject jobject, PackerContext packerContext)
      throws JSONException, UnsupportedEncodingException {
    final String decoder = jobject.getString(DECODER_KEY);
    if ("gpt2".equals(decoder)) {
      final long[] tokenIds = ivalue.toTensor().getDataAsLongArray();
      if (!packerContext.specSrcJson.has(VOCABULARY_GPT2_KEY)) {
        throw new IllegalStateException("Spec missing gpt2 vocabulary");
      }
      return getGPT2Tokenizer(packerContext).decode(tokenIds);
    }

    throw new IllegalArgumentException("Unknown decoder \"" + decoder + "\"");
  }

  private GPT2Tokenizer getGPT2Tokenizer(final PackerContext packerContext)
      throws JSONException, UnsupportedEncodingException {
    GPT2Tokenizer gpt2Tokenizer = (GPT2Tokenizer) packerContext.get(CONTEXT_GPT2_TOKENIZER_KEY);
    if (gpt2Tokenizer == null) {
      gpt2Tokenizer =
          new GPT2Tokenizer(packerContext.specSrcJson.getJSONObject(VOCABULARY_GPT2_KEY));
      packerContext.store(CONTEXT_GPT2_TOKENIZER_KEY, gpt2Tokenizer);
    }

    return gpt2Tokenizer;
  }
}
