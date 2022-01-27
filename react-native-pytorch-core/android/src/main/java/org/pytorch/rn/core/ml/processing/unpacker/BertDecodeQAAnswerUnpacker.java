/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing.unpacker;

import com.facebook.react.bridge.WritableMap;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.rn.core.ml.processing.BertTokenizer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class BertDecodeQAAnswerUnpacker implements Unpacker {

  private static final String CONTEXT_BERT_TOKENIZER_KEY = "bert_tokenizer";
  private static final String VOCABULARY_BERT_KEY = "vocabulary_bert";

  @Override
  public void unpack(
      IValue ivalue, JSONObject jobject, WritableMap result, PackerContext packerContext)
      throws JSONException, IOException {
    final Map<String, IValue> map = ivalue.toDictStringKey();
    float[] startLogits = map.get("start_logits").toTensor().getDataAsFloatArray();
    float[] endLogits = map.get("end_logits").toTensor().getDataAsFloatArray();

    final int startIdx = argmax(startLogits);
    final int endIdx = argmax(endLogits);
    // Return null (i.e., no answer found) if start index is outside the lower bounds of the tokens
    // or if start index is the same as the end index.
    if (startIdx < 0 || startIdx == endIdx) {
      return;
    }
    long[] tokenIds = (long[]) packerContext.get("token_ids");
    if (tokenIds == null) {
      throw new IllegalStateException("Expected 'token_ids' in packerContext");
    }

    final String answer =
        getBertTokenizer(packerContext).decode(Arrays.copyOfRange(tokenIds, startIdx, endIdx + 1));

    final String key = jobject.getString("key");
    result.putString(key, answer);
  }

  private int argmax(float[] array) {
    float max = -Float.MAX_VALUE;
    int ret = -1;
    for (int i = 0; i < array.length; ++i) {
      if (array[i] > max) {
        ret = i;
        max = array[i];
      }
    }
    return ret;
  }

  private BertTokenizer getBertTokenizer(PackerContext packerContext)
      throws JSONException, IOException {
    BertTokenizer bertTokenizer = (BertTokenizer) packerContext.get(CONTEXT_BERT_TOKENIZER_KEY);
    if (bertTokenizer == null) {
      bertTokenizer = new BertTokenizer(packerContext.specSrcJson.getString(VOCABULARY_BERT_KEY));
      packerContext.store(CONTEXT_BERT_TOKENIZER_KEY, bertTokenizer);
    }

    return bertTokenizer;
  }
}
