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

public class BaseIValuePacker implements IIValuePacker {

  public static final String JSON_CUSTOM_PACKER_CLASS = "custom_packer_class";

  private static final String CONTEXT_BERT_TOKENIZER = "bert_tokenizer";
  private static final String CONTEXT_GPT2_TOKENIZER = "gpt2_tokenizer";

  private static final String JSON_VOCABULARY_GPT2 = "vocabulary_gpt2";
  private static final String JSON_VOCABULARY_BERT = "vocabulary_bert";
  private static final String JSON_VALUE = "value";
  private static final String JSON_ITEMS = "items";
  private static final String JSON_KEY = "key";
  private static final String JSON_UNPACK = "unpack";
  private static final String JSON_PACK = "pack";
  private static final String JS_OUTPUT = "output";
  private static final String JSON_TYPE = "type";
  private static final String JSON_NAME = "name";
  private static final String JSON_IMAGE = "image";
  private static final String JSON_TRANSFORMS = "transforms";
  private static final String JSON_DTYPE = "dtype";
  private static final String JSON_SIZES = "sizes";
  private static final String JSON_STRING = "string";
  public static final String JSON_DICT_KEY = "dict_key";
  public static final String JSON_FLOAT = "float";
  public static final String JSON_LONG = "long";

  protected final @Nullable String mSpecSrc;
  protected final @Nullable JSONObject mSpecSrcJson;
  protected final PackerRegistry registry = new PackerRegistry();

  public BaseIValuePacker(final @Nullable String specSrc) throws JSONException {
    if (specSrc != null) {
      mSpecSrc = specSrc;
      mSpecSrcJson = new JSONObject(specSrc);
    } else {
      mSpecSrc = null;
      mSpecSrcJson = null;
    }
  }

  @Override
  public final void doRegister() {
    register(registry);
  }

  protected void register(final PackerRegistry registry) {
    // Pack
    registry
        .register(
            "tuple",
            (jobject, params, packerContext) ->
                IValue.tupleFrom(
                    packArray(jobject.getJSONArray(JSON_ITEMS), params, packerContext)))
        .register(
            "scalar_bool",
            (jobject, params, packerContext) -> IValue.from(jobject.getBoolean(JSON_VALUE)))
        .register(
            "scalar_long",
            (jobject, params, packerContext) -> IValue.from(jobject.getLong(JSON_VALUE)))
        .register(
            "scalar_double",
            (jobject, params, packerContext) -> IValue.from(jobject.getDouble(JSON_VALUE)))
        .register("tensor", (jobject, params, packerContext) -> packTensor(jobject))
        .register(
            "tensor_from_image", (jobject, params, packerContext) -> packImage(jobject, params))
        .register(
            "tensor_from_string",
            (jobject, params, packerContext) -> packString(jobject, packerContext));
    // Unpack
    registry
        .register(
            "tuple",
            (ivalue, jobject, map, packerContext) ->
                unpackArray(ivalue.toTuple(), jobject.getJSONArray(JSON_ITEMS), map, packerContext))
        .register(
            "list",
            (ivalue, jobject, map, packerContext) ->
                unpackArray(ivalue.toList(), jobject.getJSONArray(JSON_ITEMS), map, packerContext))
        .register(
            "dict_string_key",
            (ivalue, jobject, map, packerContext) ->
                unpackDictStringKey(
                    ivalue.toDictStringKey(), jobject.getJSONArray(JSON_ITEMS), map, packerContext))
        .register(
            "tensor", (ivalue, jobject, map, packerContext) -> unpackTensor(ivalue, jobject, map))
        .register(
            "scalar_long",
            (ivalue, jobject, map, packerContext) ->
                map.putInt(jobject.getString(JSON_KEY), (int) ivalue.toLong()))
        .register(
            "scalar_float",
            (ivalue, jobject, map, packerContext) ->
                map.putDouble(jobject.getString(JSON_KEY), ivalue.toDouble()))
        .register(
            "scalar_bool",
            (ivalue, jobject, map, packerContext) ->
                map.putBoolean(jobject.getString(JSON_KEY), ivalue.toBool()))
        .register(
            BaseIValuePacker.JSON_STRING,
            (ivalue, jobject, map, packerContext) ->
                map.putString(jobject.getString(JSON_KEY), ivalue.toStr()))
        .register(
            "tensor_to_string",
            (ivalue, jobject, map, packerContext) ->
                map.putString(
                    jobject.getString(JSON_KEY),
                    decodeTensorToString(ivalue, jobject, packerContext)))
        .register(
            "bert_decode_qa_answer",
            (ivalue, jobject, map, packerContext) ->
                map.putString(
                    jobject.getString(JSON_KEY), decodeBertQAAnswer(ivalue, packerContext)));
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
    return registry.pack(
        new JSONObject(applyParams(mSpecSrc, params)).getJSONObject(JSON_PACK),
        params,
        packerContext);
  }

  @Override
  public ReadableMap unpack(final IValue output, final PackerContext packerContext)
      throws Exception {
    WritableMap map = new WritableNativeMap();
    if (mSpecSrcJson == null) {
      map.putArray(JS_OUTPUT, JavaOnlyArray.of(output.toTensor().getDataAsFloatArray()));
      return map;
    }

    registry.unpack(output, mSpecSrcJson.getJSONObject(JSON_UNPACK), map, packerContext);
    return map;
  }

  @Override
  public PackerContext newContext() {
    return new PackerContext(mSpecSrcJson);
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

  private void unpackDictStringKey(
      final Map<String, IValue> dictStringKey,
      JSONArray jarray,
      WritableMap map,
      PackerContext packerContext)
      throws JSONException, IOException {
    final int len = jarray.length();
    for (int i = 0; i < len; ++i) {
      final JSONObject jitem = jarray.getJSONObject(i);
      final String key = jitem.getString(JSON_DICT_KEY);
      final IValue ivalue = dictStringKey.get(key);

      if (ivalue == null) {
        throw new IllegalStateException("Unpack dict missing key '" + key + "'");
      }

      registry.unpack(ivalue, jitem, map, packerContext);
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

  private static void unpackTensor(
      final IValue ivalue, final JSONObject jobject, final WritableMap map) throws JSONException {
    final String key = jobject.getString(JSON_KEY);
    final String dtype = jobject.getString(JSON_DTYPE);
    switch (dtype) {
      case JSON_FLOAT:
        map.putArray(key, unpackTensorFloatData(ivalue.toTensor().getDataAsFloatArray()));
        return;
      case JSON_LONG:
        map.putArray(key, unpackTensorLongData(ivalue.toTensor().getDataAsLongArray()));
        return;
    }

    throw new IllegalArgumentException("Unknown dtype");
  }

  private void unpackArray(
      final IValue[] iarray,
      final JSONArray jarray,
      final WritableMap map,
      final PackerContext packerContext)
      throws JSONException, IOException {
    if (iarray.length != jarray.length()) {
      throw new IllegalArgumentException("IValue and JSONArray sizes do not match");
    }
    int n = iarray.length;
    for (int i = 0; i < n; ++i) {
      registry.unpack(iarray[i], jarray.getJSONObject(i), map, packerContext);
    }
  }

  private String decodeTensorToString(
      final IValue ivalue, final JSONObject jobject, PackerContext packerContext)
      throws JSONException, UnsupportedEncodingException {
    final String decoder = jobject.getString("decoder");
    if ("gpt2".equals(decoder)) {
      final long[] tokenIds = ivalue.toTensor().getDataAsLongArray();
      if (!packerContext.specSrcJson.has(JSON_VOCABULARY_GPT2)) {
        throw new IllegalStateException("Spec missing gpt2 vocabulary");
      }
      return getGPT2Tokenizer(packerContext).decode(tokenIds);
    }

    throw new IllegalArgumentException("Unknown decoder \"" + decoder + "\"");
  }

  private static Tensor doImageTransforms(final JSONArray jarray, final Bitmap bitmap)
      throws JSONException {
    final int n = jarray.length();
    Object x = bitmap;
    for (int i = 0; i < n; ++i) {
      final JSONObject jobject = jarray.getJSONObject(i);
      final String type = jobject.getString(JSON_TYPE);
      if ("image_to_image".equals(type)) {
        final String name = jobject.getString(JSON_NAME);
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
        final String name = jobject.getString(BaseIValuePacker.JSON_NAME);
        IImageToTensorTransform transform = null;
        switch (name) {
          case "rgb_norm":
            transform = RgbNormTransform.parse(jobject);
            break;
          case "greyscale_norm":
            transform = GreyScaleNormTransform.parse(jobject);
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

  private static IValue packImage(final JSONObject jobject, final ReadableMap params)
      throws JSONException {
    final IImage image = JSContext.unwrapObject(params.getMap(jobject.getString(JSON_IMAGE)));
    return IValue.from(doImageTransforms(jobject.getJSONArray(JSON_TRANSFORMS), image.getBitmap()));
  }

  private BertTokenizer getBertTokenizer(PackerContext packerContext)
      throws JSONException, IOException {
    BertTokenizer bertTokenizer = (BertTokenizer) registry.get(CONTEXT_BERT_TOKENIZER);
    if (bertTokenizer == null) {
      bertTokenizer = new BertTokenizer(packerContext.specSrcJson.getString(JSON_VOCABULARY_BERT));
      registry.store(CONTEXT_BERT_TOKENIZER, bertTokenizer);
    }

    return bertTokenizer;
  }

  private GPT2Tokenizer getGPT2Tokenizer(final PackerContext packerContext)
      throws JSONException, UnsupportedEncodingException {
    GPT2Tokenizer gpt2Tokenizer = (GPT2Tokenizer) registry.get(CONTEXT_GPT2_TOKENIZER);
    if (gpt2Tokenizer == null) {
      gpt2Tokenizer =
          new GPT2Tokenizer(packerContext.specSrcJson.getJSONObject(JSON_VOCABULARY_GPT2));
      registry.store(CONTEXT_GPT2_TOKENIZER, gpt2Tokenizer);
    }

    return gpt2Tokenizer;
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
    } else if ("gpt2".equals(tokenizer)) {
      if (!packerContext.specSrcJson.has(JSON_VOCABULARY_GPT2)) {
        throw new IllegalStateException("Spec missing gpt2 vocabulary");
      }

      final long[] tokenIds =
          getGPT2Tokenizer(packerContext).tokenize(jobject.getString(JSON_STRING));
      return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
    }

    throw new IllegalStateException("Unknown tokenizer");
  }

  static float[] readFloatArray(final JSONObject jobject, final String key) throws JSONException {
    final JSONArray jarray = jobject.getJSONArray(key);
    final int len = jarray.length();
    float[] array = new float[jarray.length()];
    for (int i = 0; i < len; ++i) {
      array[i] = (float) jarray.getDouble(i);
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

  private static IValue packTensor(final JSONObject jobject) throws JSONException {
    final String dtype = jobject.getString(JSON_DTYPE);
    final long[] sizes = readLongArray(jobject, JSON_SIZES);

    switch (dtype) {
      case JSON_FLOAT:
        return IValue.from(Tensor.fromBlob(readFloatArray(jobject, JSON_ITEMS), sizes));
      case JSON_LONG:
        return IValue.from(Tensor.fromBlob(readLongArray(jobject, JSON_ITEMS), sizes));
    }

    throw new IllegalStateException("Unknown dtype");
  }

  private IValue[] packArray(
      final JSONArray jarray, final ReadableMap params, final PackerContext packerContext)
      throws JSONException, IOException {
    final int len = jarray.length();
    final IValue[] array = new IValue[len];
    for (int i = 0; i < len; ++i) {
      array[i] = registry.pack(jarray.getJSONObject(i), params, packerContext);
    }
    return array;
  }

  private static String toJsonString(Object o) {
    return o.toString();
  }
}
