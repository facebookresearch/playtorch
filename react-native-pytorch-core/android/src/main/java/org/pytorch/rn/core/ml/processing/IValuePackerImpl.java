/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.Bitmap;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import javax.annotation.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.javascript.JSContext;

public class IValuePackerImpl implements IIValuePacker {

  public static final String SPEC_KEY_VOCABULARY_GPT2 = "vocabulary_gpt2";
  public static final String SPEC_KEY_VOCABULARY_BERT = "vocabulary_bert";

  private final @Nullable JSONObject mSpecSrcJson;
  private final @Nullable String mSpecSrc;
  private @Nullable BertTokenizer mBertTokenizer;
  private @Nullable GPT2Tokenizer mGPT2Tokenizer;

  public IValuePackerImpl(final @Nullable String specSrcJson) throws JSONException {
    if (specSrcJson != null) {
      mSpecSrc = specSrcJson;
      mSpecSrcJson = new JSONObject(specSrcJson);
    } else {
      mSpecSrc = null;
      mSpecSrcJson = null;
    }
  }

  private String applyParams(final String specSrc, final ReadableMap params) {
    String src = specSrc;
    Iterator<Map.Entry<String, Object>> it = params.getEntryIterator();
    while (it.hasNext()) {
      Map.Entry<String, Object> entry = it.next();
      final String key = entry.getKey();
      final Object value = entry.getValue();
      if (value instanceof String) {
        src = src.replaceAll("\"\\$" + key + "\"", "\"" + value + "\"");
      } else {
        src = src.replaceAll("\"\\$" + key + "\"", toJsonString(value));
      }
    }
    return src;
  }

  @Override
  public IValue pack(final ReadableMap params, final PackerContext packerContext) throws Exception {
    return pack(
        new JSONObject(applyParams(mSpecSrc, params)).getJSONObject("pack"), params, packerContext);
  }

  @Override
  public ReadableMap unpack(final IValue output, final PackerContext packerContext)
      throws Exception {
    WritableMap map = new WritableNativeMap();
    if (mSpecSrcJson == null) {
      map.putArray("output", JavaOnlyArray.of(output.toTensor().getDataAsFloatArray()));
      return map;
    }

    unpack(output, mSpecSrcJson.getJSONObject("unpack"), map, packerContext);
    return map;
  }

  private void unpack(
      final IValue ivalue,
      final JSONObject jobject,
      final WritableMap map,
      final PackerContext packerContext)
      throws JSONException, IOException {
    final String type = jobject.getString("type");
    switch (type) {
      case "tuple":
        unpackArray(ivalue.toTuple(), jobject.getJSONArray("items"), map, packerContext);
        return;
      case "list":
        unpackArray(ivalue.toList(), jobject.getJSONArray("items"), map, packerContext);
        return;
      case "dict_string_key":
        unpackDictStringKey(
            ivalue.toDictStringKey(), jobject.getJSONArray("items"), map, packerContext);
        return;
      case "tensor":
        unpackTensor(ivalue, jobject, map);
        return;
      case "scalar_long":
        map.putInt(jobject.getString("key"), (int) ivalue.toLong());
        return;
      case "scalar_float":
        map.putDouble(jobject.getString("key"), ivalue.toDouble());
        return;
      case "scalar_bool":
        map.putBoolean(jobject.getString("key"), ivalue.toBool());
        return;
      case "string":
        map.putString(jobject.getString("key"), ivalue.toStr());
        return;
      case "tensor_to_string":
        map.putString(jobject.getString("key"), decodeTensorToString(ivalue, jobject));
        return;
      case "bert_decode_qa_answer":
        map.putString(jobject.getString("key"), decodeBertQAAnswer(ivalue, packerContext));
        return;
    }

    throw new IllegalArgumentException("Unknown type \"" + type + "\"");
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

  private String decodeBertQAAnswer(IValue ivalue, PackerContext packerContext)
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

    return getBertTokenizer().decode(Arrays.copyOfRange(tokenIds, startIdx, endIdx + 1));
  }

  private void unpackDictStringKey(
      final Map<String, IValue> dictStringKey,
      JSONArray jarray,
      WritableMap map,
      PackerContext packerContext)
      throws JSONException, IOException {
    final int len = jarray.length();
    for (int i = 0; i < len; ++i) {
      final JSONObject jitem = jarray.getJSONObject(i);
      final String key = jitem.getString("dict_key");
      final IValue ivalue = dictStringKey.get(key);

      if (ivalue == null) {
        throw new IllegalStateException("Unpack dict missing key '" + key + "'");
      }

      unpack(ivalue, jitem, map, packerContext);
    }
  }

  private static ReadableArray unpackTensorFloatData(float[] data) {
    final WritableArray array = new WritableNativeArray();
    for (int i = 0; i < data.length; ++i) {
      array.pushDouble(data[i]);
    }
    return array;
  }

  private static ReadableArray unpackTensorLongData(long[] data) {
    final WritableArray array = new WritableNativeArray();
    for (int i = 0; i < data.length; ++i) {
      array.pushInt((int) data[i]);
    }
    return array;
  }

  private static void unpackTensor(IValue ivalue, JSONObject jobject, WritableMap map)
      throws JSONException {
    final String key = jobject.getString("key");
    final String dtype = jobject.getString("dtype");
    switch (dtype) {
      case "float":
        map.putArray(key, unpackTensorFloatData(ivalue.toTensor().getDataAsFloatArray()));
        return;
      case "long":
        map.putArray(key, unpackTensorLongData(ivalue.toTensor().getDataAsLongArray()));
        return;
    }

    throw new IllegalArgumentException("Unknown dtype");
  }

  private void unpackArray(
      IValue[] iarray, JSONArray jarray, WritableMap map, PackerContext packerContext)
      throws JSONException, IOException {
    if (iarray.length != jarray.length()) {
      throw new IllegalArgumentException("IValue and JSONArray sizes do not match");
    }
    int n = iarray.length;
    for (int i = 0; i < n; ++i) {
      unpack(iarray[i], jarray.getJSONObject(i), map, packerContext);
    }
  }

  private IValue pack(
      JSONObject jobject, final ReadableMap params, final PackerContext packerContext)
      throws Exception {
    final String type = jobject.getString("type");
    switch (type) {
      case "tuple":
        return IValue.tupleFrom(packArray(jobject.getJSONArray("items"), params, packerContext));
      case "scalar_bool":
        return IValue.from(jobject.getBoolean("value"));
      case "scalar_long":
        return IValue.from(jobject.getLong("value"));
      case "scalar_double":
        return IValue.from(jobject.getDouble("value"));
      case "tensor":
        return packTensor(jobject);
      case "tensor_from_image":
        return packImage(jobject, params);
      case "tensor_from_string":
        return packString(jobject, packerContext);
    }
    throw new IllegalArgumentException("Unknown type");
  }

  private String decodeTensorToString(IValue ivalue, JSONObject jobject)
      throws JSONException, UnsupportedEncodingException {
    final String decoder = jobject.getString("decoder");
    switch (decoder) {
      case "gpt2":
        final long[] tokenIds = ivalue.toTensor().getDataAsLongArray();
        if (!mSpecSrcJson.has(SPEC_KEY_VOCABULARY_GPT2)) {
          throw new IllegalStateException("Spec missing gpt2 vocabulary");
        }

        final GPT2Tokenizer gpt2Tokenizer =
            new GPT2Tokenizer(mSpecSrcJson.getJSONObject(SPEC_KEY_VOCABULARY_GPT2));
        return gpt2Tokenizer.decode(tokenIds);
    }

    throw new IllegalArgumentException("Unknown decoder \"" + decoder + "\"");
  }

  private static Tensor doImageTransforms(JSONArray jarray, Bitmap bitmap) throws JSONException {
    final int n = jarray.length();
    Object x = bitmap;
    for (int i = 0; i < n; ++i) {
      final JSONObject jobject = jarray.getJSONObject(i);
      final String type = jobject.getString("type");
      if ("image_to_image".equals(type)) {
        final String name = jobject.getString("name");
        IImageTransform transform = null;
        switch (name) {
          case "center_crop":
            transform = CenterCropTransform.parse(jobject);
            break;
          case "scale":
            transform = ScaleTransform.parse(jobject);
            break;
        }
        if (transform == null) {
          throw new IllegalArgumentException("Unknown image_to_image transform");
        }
        x = transform.transform((Bitmap) x);
      } else if ("image_to_tensor".equals(type)) {
        final String name = jobject.getString("name");
        IImageToTensorTransform transform = null;
        switch (name) {
          case "rgb_norm":
            transform = RgbNormTransform.parse(jobject);
            break;
        }
        if (transform == null) {
          throw new IllegalArgumentException("Unknown image_to_tensor transform");
        }
        x = transform.transform((Bitmap) x);
      }
    }
    return (Tensor) x;
  }

  private static IValue packImage(JSONObject jobject, ReadableMap params) throws JSONException {
    final IImage image = JSContext.unwrapObject(params.getMap(jobject.getString("image")));
    return IValue.from(doImageTransforms(jobject.getJSONArray("transforms"), image.getBitmap()));
  }

  private BertTokenizer getBertTokenizer() throws JSONException, IOException {
    if (mBertTokenizer == null) {
      mBertTokenizer = new BertTokenizer(mSpecSrcJson.getString(SPEC_KEY_VOCABULARY_BERT));
    }

    return mBertTokenizer;
  }

  private GPT2Tokenizer getGPT2Tokenizer() throws JSONException, UnsupportedEncodingException {
    if (mGPT2Tokenizer == null) {
      mGPT2Tokenizer = new GPT2Tokenizer(mSpecSrcJson.getJSONObject(SPEC_KEY_VOCABULARY_GPT2));
    }

    return mGPT2Tokenizer;
  }

  private IValue packString(final JSONObject jobject, final PackerContext packerContext)
      throws JSONException, IOException {
    final String tokenizer = jobject.getString("tokenizer");
    if ("bert".equals(tokenizer)) {
      if (!mSpecSrcJson.has(SPEC_KEY_VOCABULARY_BERT)) {
        throw new IllegalStateException("Spec missing bert vocabulary");
      }

      final long[] tokenIds =
          getBertTokenizer()
              .tokenize(jobject.getString("string"), jobject.getInt("model_input_length"));
      packerContext.store("token_ids", tokenIds);
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    } else if ("gpt2".equals(tokenizer)) {
      if (!mSpecSrcJson.has(SPEC_KEY_VOCABULARY_GPT2)) {
        throw new IllegalStateException("Spec missing gpt2 vocabulary");
      }

      final GPT2Tokenizer gpt2Tokenizer = getGPT2Tokenizer();
      final long[] tokenIds = gpt2Tokenizer.tokenize(jobject.getString("string"));
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    }

    throw new IllegalStateException("Unknown tokenizer");
  }

  static float[] readFloatArray(final JSONObject jobject, final String key) throws JSONException {
    final JSONArray jarray = jobject.getJSONArray(key);
    final int len = jarray.length();
    float[] array = new float[jarray.length()];
    for (int i = 0; i < len; ++i) {
      array[i] = jarray.getLong(i);
    }
    return array;
  }

  static long[] readLongArray(final JSONObject jsonObject, final String key) throws JSONException {
    final JSONArray jarray = jsonObject.getJSONArray(key);
    final int len = jarray.length();
    long[] array = new long[jarray.length()];
    for (int i = 0; i < len; ++i) {
      array[i] = jarray.getLong(i);
    }
    return array;
  }

  private static IValue packTensor(JSONObject jobject) throws JSONException {
    final String dtype = jobject.getString("dtype");
    final long[] sizes = readLongArray(jobject, "sizes");

    switch (dtype) {
      case "float":
        return IValue.from(Tensor.fromBlob(readFloatArray(jobject, "items"), sizes));
      case "long":
        return IValue.from(Tensor.fromBlob(readLongArray(jobject, "items"), sizes));
    }

    throw new IllegalStateException("Unknown dtype");
  }

  private IValue[] packArray(
      JSONArray jarray, final ReadableMap params, PackerContext packerContext) throws Exception {
    final int len = jarray.length();
    final IValue[] array = new IValue[len];
    for (int i = 0; i < len; ++i) {
      array[i] = pack(jarray.getJSONObject(i), params, packerContext);
    }
    return array;
  }

  private static String toJsonString(Object o) {
    return o.toString();
  }
}
