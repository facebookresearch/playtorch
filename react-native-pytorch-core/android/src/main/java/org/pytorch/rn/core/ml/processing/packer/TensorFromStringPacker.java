/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.packer;

import com.facebook.react.bridge.ReadableMap;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.ml.processing.BertTokenizer;
import org.pytorch.rn.core.ml.processing.GPT2Tokenizer;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class TensorFromStringPacker implements Packer {

  private static final String CONTEXT_BERT_TOKENIZER_KEY = "bert_tokenizer";
  private static final String CONTEXT_GPT2_TOKENIZER_KEY = "gpt2_tokenizer";

  private static final String JSON_VOCABULARY_GPT2_KEY = "vocabulary_gpt2";
  private static final String JSON_VOCABULARY_BERT_KEY = "vocabulary_bert";

  private static final String JSON_STRING = "string";

  @Override
  public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
      throws JSONException, IOException {
    final String tokenizer = jobject.getString("tokenizer");
    if ("bert".equals(tokenizer)) {
      if (!packerContext.specSrcJson.has(JSON_VOCABULARY_BERT_KEY)) {
        throw new IllegalStateException("Spec missing bert vocabulary");
      }

      final long[] tokenIds =
          getBertTokenizer(packerContext)
              .tokenize(jobject.getString(JSON_STRING), jobject.getInt("model_input_length"));
      packerContext.store("token_ids", tokenIds);
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    } else if ("gpt2".equals(tokenizer)) {
      if (!packerContext.specSrcJson.has(JSON_VOCABULARY_GPT2_KEY)) {
        throw new IllegalStateException("Spec missing gpt2 vocabulary");
      }

      final long[] tokenIds =
          getGPT2Tokenizer(packerContext).tokenize(jobject.getString(JSON_STRING));
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    }

    throw new IllegalStateException("Unknown tokenizer");
  }

  private BertTokenizer getBertTokenizer(PackerContext packerContext)
      throws JSONException, IOException {
    BertTokenizer bertTokenizer = (BertTokenizer) packerContext.get(CONTEXT_BERT_TOKENIZER_KEY);
    if (bertTokenizer == null) {
      bertTokenizer =
          new BertTokenizer(packerContext.specSrcJson.getString(JSON_VOCABULARY_BERT_KEY));
      packerContext.store(CONTEXT_BERT_TOKENIZER_KEY, bertTokenizer);
    }

    return bertTokenizer;
  }

  private GPT2Tokenizer getGPT2Tokenizer(final PackerContext packerContext)
      throws JSONException, UnsupportedEncodingException {
    GPT2Tokenizer gpt2Tokenizer = (GPT2Tokenizer) packerContext.get(CONTEXT_GPT2_TOKENIZER_KEY);
    if (gpt2Tokenizer == null) {
      gpt2Tokenizer =
          new GPT2Tokenizer(packerContext.specSrcJson.getJSONObject(JSON_VOCABULARY_GPT2_KEY));
      packerContext.store(CONTEXT_GPT2_TOKENIZER_KEY, gpt2Tokenizer);
    }

    return gpt2Tokenizer;
  }
}
