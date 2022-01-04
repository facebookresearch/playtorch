/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.live.example;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Map;
import javax.annotation.Nullable;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.ml.processing.BaseIValuePacker;
import org.pytorch.rn.core.ml.processing.BertTokenizer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;

public class BertQAPacker extends BaseIValuePacker {
  private static final String JSON_VOCABULARY_BERT = "vocabulary_bert";

  private static final String JSON_STRING = "string";

  public BertQAPacker(@Nullable String specSrc) throws JSONException {
    super(specSrc);
  }

  @Override
  protected void register(final PackerRegistry registry) {
    super.register(registry);
    registry.register(
        "tensor_from_string_custom",
        (jobject, params, packerContext) -> packString(jobject, packerContext));
    registry.register(
        "bert_decode_qa_answer_custom",
        (ivalue, jobject, map, packerContext) ->
            map.putString(jobject.getString("key"), decodeBertQAAnswer(ivalue, packerContext)));
  }

  private BertTokenizer getBertTokenizer(PackerContext packerContext)
      throws JSONException, IOException, UnsupportedEncodingException {
    BertTokenizer bertTokenizer = (BertTokenizer) registry.get("bert_tokenizer_custom");
    if (bertTokenizer == null) {
      bertTokenizer = new BertTokenizer(packerContext.specSrcJson.getString("vocabulary_bert"));
      registry.store("bert_tokenizer_custom", bertTokenizer);
    }

    return bertTokenizer;
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

  private IValue packString(final JSONObject jobject, final PackerContext packerContext)
      throws JSONException, IOException {
    final String tokenizer = jobject.getString("tokenizer");
    if ("bert".equals(tokenizer)) {
      if (!packerContext.specSrcJson.has(JSON_VOCABULARY_BERT)) {
        throw new IllegalStateException("Spec missing bert vocabulary");
      }

      final long[] tokenIds =
          getBertTokenizer(packerContext)
              .tokenize(jobject.getString(JSON_STRING), jobject.getInt("model_input_length"));
      packerContext.store("token_ids", tokenIds);
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    }

    throw new IllegalStateException("Unknown tokenizer");
  }

  private String decodeBertQAAnswer(final IValue ivalue, final PackerContext packerContext)
      throws IOException, JSONException {
    final Map<String, IValue> map = ivalue.toDictStringKey();
    float[] startLogits = map.get("start_logits").toTensor().getDataAsFloatArray();
    float[] endLogits = map.get("end_logits").toTensor().getDataAsFloatArray();

    final int startIdx = argmax(startLogits);
    final int endIdx = argmax(endLogits);
    long[] tokenIds = (long[]) packerContext.get("token_ids");
    if (tokenIds == null) {
      throw new IllegalStateException("Expected 'token_ids' in packerContext");
    }

    return getBertTokenizer(packerContext)
        .decode(Arrays.copyOfRange(tokenIds, startIdx, endIdx + 1));
  }
}
