/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import android.graphics.Bitmap;
import android.graphics.ImageFormat;
import android.media.Image;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import javax.annotation.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.audio.IAudio;
import org.pytorch.rn.core.audio.IAudioRecord;
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
  private static final String JSON_AUDIO = "audio";
  private static final String JSON_IMAGE = "image";
  private static final String JSON_TRANSFORMS = "transforms";
  private static final String JSON_DTYPE = "dtype";
  private static final String JSON_SIZES = "sizes";
  private static final String JSON_STRING = "string";
  public static final String JSON_DICT_KEY = "dict_key";
  public static final String JSON_FLOAT = "float";
  public static final String JSON_LONG = "long";

  public static final String IMAGE_TRANSFORM_TYPE_TENSOR = "image_to_tensor";
  public static final String IMAGE_TRANSFORM_TYPE_IMAGE = "image_to_image";

  public static final String IMAGE_TRANSFORM_TENSOR_RGB_NORM = "rgb_norm";
  public static final String IMAGE_TRANSFORM_TENSOR_GREYSCALE_NORM = "greyscale_norm";
  public static final String IMAGE_TRANSFORM_IMAGE_SCALE = "scale";
  public static final String IMAGE_TRANSFORM_IMAGE_CENTER_CROP = "center_crop";
  public static final String IMAGE_TRANSFORM_IMAGE_CENTER_CROP_SCALE_RGB_NORM =
      "center_crop_scale_rgb_norm";
  public static final String JSON_WIDTH = "width";
  public static final String JSON_HEIGHT = "height";
  public static final String JSON_MEAN = "mean";
  public static final String JSON_STD = "std";

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
            (jobject, params, packerContext) -> packString(jobject, packerContext))
        .register(
            "tensor_from_audio", (jobject, params, packerContext) -> packAudio(jobject, params));
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
            "argmax", (ivalue, jobject, map, packerContext) -> unpackArgmax(ivalue, jobject, map))
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

  private static int unpackArgmaxFloatData(float[] data) {
    float maxValue = -Float.MAX_VALUE;
    int maxIdx = -1;
    for (int i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  private static int unpackArgmaxLongData(long[] data) {
    long maxValue = -Long.MAX_VALUE;
    int maxIdx = -1;
    for (int i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  private static void unpackArgmax(
      final IValue ivalue, final JSONObject jobject, final WritableMap map) throws JSONException {
    final String key = jobject.getString(JSON_KEY);
    final String dtype = jobject.getString(JSON_DTYPE);
    switch (dtype) {
      case JSON_FLOAT:
        map.putInt(key, unpackArgmaxFloatData(ivalue.toTensor().getDataAsFloatArray()));
        return;
      case JSON_LONG:
        map.putInt(key, unpackArgmaxLongData(ivalue.toTensor().getDataAsLongArray()));
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

  private static class ImageTransformObject {
    public final String type;
    public final String name;
    public final JSONObject jobject;

    public ImageTransformObject(String type, String name, JSONObject jobject) {
      this.type = type;
      this.name = name;
      this.jobject = jobject;
    }
  }

  private static boolean isImageTransformTensorRGBNorm(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_TENSOR.equals(type) && IMAGE_TRANSFORM_TENSOR_RGB_NORM.equals(name);
  }

  private static boolean isImageTransformTensorCenterCropScaleRGBNorm(
      final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_TENSOR.equals(type)
        && IMAGE_TRANSFORM_IMAGE_CENTER_CROP_SCALE_RGB_NORM.equals(name);
  }

  private static boolean isImageTransformImageCenterCrop(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_IMAGE.equals(type)
        && IMAGE_TRANSFORM_IMAGE_CENTER_CROP.equals(name);
  }

  private static boolean isImageTransformImageScale(final String type, final String name) {
    return IMAGE_TRANSFORM_TYPE_IMAGE.equals(type) && IMAGE_TRANSFORM_IMAGE_SCALE.equals(name);
  }

  private static Tensor doImageTransforms(final JSONArray jarray, final IImage image)
      throws JSONException {
    final int n = jarray.length();

    final ArrayList<ImageTransformObject> imageTransforms = new ArrayList<>();
    for (int i = 0; i < n; ++i) {
      final JSONObject jobject = jarray.getJSONObject(i);
      imageTransforms.add(
          new ImageTransformObject(
              jobject.getString(JSON_TYPE), jobject.getString(JSON_NAME), jobject));
    }

    final Image cameraImage = image.getImage();
    final int cameraImageRotationDegrees = image.getImageRotationDegrees();

    if (cameraImage != null && cameraImage.getFormat() == ImageFormat.YUV_420_888) {
      final @Nullable Tensor tensor =
          doCameraImageTransforms(imageTransforms, cameraImage, cameraImageRotationDegrees);
      if (tensor != null) {
        return tensor;
      }
    }

    Object x = image.getBitmap();
    for (int i = 0; i < n; ++i) {
      final ImageTransformObject ito = imageTransforms.get(i);

      if (IMAGE_TRANSFORM_TYPE_IMAGE.equals(ito.type)) {
        IImageTransform transform = null;
        switch (ito.name) {
          case IMAGE_TRANSFORM_IMAGE_CENTER_CROP:
            transform = CenterCropTransform.parse(ito.jobject);
            break;
          case IMAGE_TRANSFORM_IMAGE_SCALE:
            transform = ScaleTransform.parse(ito.jobject);
            break;
        }
        if (transform == null) {
          throw new IllegalArgumentException("Unknown image_to_image transform");
        }
        x = transform.transform((Bitmap) x);
      } else if (IMAGE_TRANSFORM_TYPE_TENSOR.equals(ito.type)) {
        IImageToTensorTransform transform = null;
        switch (ito.name) {
          case IMAGE_TRANSFORM_TENSOR_RGB_NORM:
            transform = RgbNormTransform.parse(ito.jobject);
            break;
          case IMAGE_TRANSFORM_TENSOR_GREYSCALE_NORM:
            transform = GreyScaleNormTransform.parse(ito.jobject);
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

  private static @Nullable Tensor doCameraImageTransforms(
      final ArrayList<ImageTransformObject> imageTransforms,
      final Image image,
      final int rotationDegrees)
      throws JSONException {
    // Supporting
    // 1. image_to_tensor/center_crop_scale_rgb_norm
    // 2. image_to_image/center_crop -> image_to_image/scale -> image_to_tensor/rgb_norm
    final int size = imageTransforms.size();
    if (size == 0) {
      final ImageTransformObject t0 = imageTransforms.get(0);
      if (isImageTransformTensorCenterCropScaleRGBNorm(t0.type, t0.name)) {
        CameraImageCenterCropScaleRgbNormTransform transform =
            CameraImageCenterCropScaleRgbNormTransform.parse(t0.jobject);
        return transform.transform(image, rotationDegrees);
      }
    } else if (size == 3) {
      final ImageTransformObject t0 = imageTransforms.get(0);
      final ImageTransformObject t1 = imageTransforms.get(1);
      final ImageTransformObject t2 = imageTransforms.get(2);

      if (isImageTransformImageCenterCrop(t0.type, t0.name)
          && isImageTransformImageScale(t1.type, t1.name)
          && isImageTransformTensorRGBNorm(t2.type, t2.name)) {

        CameraImageCenterCropScaleRgbNormTransform transform =
            new CameraImageCenterCropScaleRgbNormTransform(
                t1.jobject.getInt(JSON_WIDTH),
                t1.jobject.getInt(JSON_HEIGHT),
                BaseIValuePacker.readFloatArray(t2.jobject, JSON_MEAN),
                BaseIValuePacker.readFloatArray(t2.jobject, JSON_STD));
        return transform.transform(image, rotationDegrees);
      }
    }
    return null;
  }

  private static <T> T unwrapObject(
      final JSONObject jobject, final ReadableMap params, final String key) throws JSONException {
    return JSContext.unwrapObject(params.getMap(jobject.getString(key)));
  }

  private static IValue packImage(final JSONObject jobject, final ReadableMap params)
      throws JSONException {
    final IImage image = unwrapObject(jobject, params, JSON_IMAGE);
    return IValue.from(doImageTransforms(jobject.getJSONArray(JSON_TRANSFORMS), image));
  }

  private static IValue packAudio(final JSONObject jobject, final ReadableMap params)
      throws JSONException {
    final IAudio audio = unwrapObject(jobject, params, JSON_AUDIO);
    final IAudioRecord audioRecord = audio.getAudioRecord();
    final int sampleRate = params.getInt("sample_rate");

    // Guess for unknown duration of audio records
    int durationSeconds = 10;
    if (params.hasKey("duration_seconds")) {
      durationSeconds = params.getInt("duration_seconds");
    }
    int floatBufferSize = sampleRate * durationSeconds;
    FloatBuffer floatBuffer = Tensor.allocateFloatBuffer(floatBufferSize);

    final int bufferSizeInShorts = 2048;
    final short[] buffer = new short[bufferSizeInShorts];

    int read = 0;
    int readTotal = 0;
    while ((read = audioRecord.read(buffer, 0, bufferSizeInShorts)) > 0) {
      if (readTotal + read > floatBufferSize) {
        final int newFloatBufferSize = floatBufferSize * 2;
        final FloatBuffer newFloatBuffer = Tensor.allocateFloatBuffer(newFloatBufferSize);
        newFloatBuffer.put(floatBuffer);
        floatBufferSize = newFloatBufferSize;
        floatBuffer = newFloatBuffer;
      }

      for (int i = 0; i < read; i++) {
        floatBuffer.put(buffer[i] / (float) Short.MAX_VALUE);
      }

      readTotal += read;
    }

    if (floatBuffer.capacity() > readTotal) {
      final FloatBuffer newFloatBuffer = Tensor.allocateFloatBuffer(readTotal);
      for (int i = 0; i < readTotal; ++i) {
        newFloatBuffer.put(floatBuffer.get());
      }
      floatBuffer = newFloatBuffer;
    }

    return IValue.from(Tensor.fromBlob(floatBuffer, new long[] {1, readTotal}));
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
