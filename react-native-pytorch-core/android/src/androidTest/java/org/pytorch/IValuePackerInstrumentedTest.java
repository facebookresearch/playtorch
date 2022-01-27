/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import androidx.annotation.ColorInt;
import androidx.test.InstrumentationRegistry;
import androidx.test.filters.SmallTest;
import androidx.test.runner.AndroidJUnit4;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.soloader.SoLoader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.Nullable;
import org.json.JSONException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.pytorch.rn.core.audio.Audio;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.ml.processing.BaseIValuePacker;
import org.pytorch.rn.core.ml.processing.GPT2Tokenizer;
import org.pytorch.rn.core.ml.processing.IIValuePacker;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;
import org.pytorch.rn.core.ml.processing.packer.ScalarBoolPacker;
import org.pytorch.rn.core.ml.processing.packer.ScalarDoublePacker;
import org.pytorch.rn.core.ml.processing.packer.ScalarLongPacker;
import org.pytorch.rn.core.ml.processing.packer.TensorFromAudioPacker;
import org.pytorch.rn.core.ml.processing.packer.TensorFromImagePacker;
import org.pytorch.rn.core.ml.processing.packer.TensorFromStringPacker;
import org.pytorch.rn.core.ml.processing.packer.TensorPacker;
import org.pytorch.rn.core.ml.processing.packer.TuplePacker;
import org.pytorch.rn.core.ml.processing.unpacker.ArgmaxUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.BertDecodeQAAnswerUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.BoundingBoxesUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.DictStringKeyUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.ListUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.ScalarBoolUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.ScalarFloatUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.ScalarLongUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.StringUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.TensorToImageUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.TensorToStringUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.TensorUnpacker;
import org.pytorch.rn.core.ml.processing.unpacker.TupleUnpacker;

@RunWith(AndroidJUnit4.class)
@SmallTest
public class IValuePackerInstrumentedTest {

  public static final float DOUBLE_EQUALS_DELTA = 1e-6f;

  static {
    Context ctx = InstrumentationRegistry.getTargetContext();
    SoLoader.init(ctx, false);

    // Pack
    PackerRegistry.register("tuple", new TuplePacker());
    PackerRegistry.register("scalar_bool", new ScalarBoolPacker());
    PackerRegistry.register("scalar_long", new ScalarLongPacker());
    PackerRegistry.register("scalar_double", new ScalarDoublePacker());
    PackerRegistry.register("tensor", new TensorPacker());
    PackerRegistry.register("tensor_from_image", new TensorFromImagePacker());
    PackerRegistry.register("tensor_from_string", new TensorFromStringPacker());
    PackerRegistry.register("tensor_from_audio", new TensorFromAudioPacker());

    // Unpack
    PackerRegistry.register("tuple", new TupleUnpacker());
    PackerRegistry.register("list", new ListUnpacker());
    PackerRegistry.register("dict_string_key", new DictStringKeyUnpacker());
    PackerRegistry.register("tensor", new TensorUnpacker());
    PackerRegistry.register("scalar_long", new ScalarLongUnpacker());
    PackerRegistry.register("scalar_float", new ScalarFloatUnpacker());
    PackerRegistry.register("scalar_bool", new ScalarBoolUnpacker());
    PackerRegistry.register("argmax", new ArgmaxUnpacker());
    PackerRegistry.register("string", new StringUnpacker());
    PackerRegistry.register("tensor_to_image", new TensorToImageUnpacker());
    PackerRegistry.register("bounding_boxes", new BoundingBoxesUnpacker());
    PackerRegistry.register("tensor_to_string", new TensorToStringUnpacker());
    PackerRegistry.register("bert_decode_qa_answer", new BertDecodeQAAnswerUnpacker());
  }

  public String readAsset(String name) throws IOException {
    final Context testContext = InstrumentationRegistry.getInstrumentation().getContext();
    int bufferSize = 1024;
    char[] buffer = new char[bufferSize];
    StringBuilder out = new StringBuilder();
    Reader in = new InputStreamReader(testContext.getAssets().open(name), StandardCharsets.UTF_8);
    for (int len; (len = in.read(buffer, 0, buffer.length)) > 0; ) {
      out.append(buffer, 0, len);
    }
    return out.toString();
  }

  private static double[] doubleArrayFromReadableArray(ReadableArray array) {
    final int n = array.size();
    final double[] ret = new double[n];
    for (int i = 0; i < n; ++i) {
      ret[i] = array.getDouble(i);
    }
    return ret;
  }

  private static int[] intArrayFromReadableArray(ReadableArray array) {
    final int n = array.size();
    final int[] ret = new int[n];
    for (int i = 0; i < n; ++i) {
      ret[i] = array.getInt(i);
    }
    return ret;
  }

  @Test
  public void bodyTrackingTest() throws Exception {
    final JavaOnlyMap params = new JavaOnlyMap();
    params.putInt("width", 224);
    params.putInt("height", 224);
    params.putDouble("scale", 1.0f);
    params.putInt("rois_n", 3);
    params.putArray("rois", JavaOnlyArray.of(0, 0, 20, 20, 10, 10, 50, 50, 30, 30, 60, 60));
    params.putDouble("should_run_track", 0.0f);
    Bitmap bitmap = Bitmap.createBitmap(224, 224, Bitmap.Config.ARGB_8888);
    JSContext.NativeJSRef ref = JSContext.wrapObject(new Image(bitmap));
    params.putMap("image1", ref.getJSRef());

    final String spec = readAsset("body_tracking_spec.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);
    final PackerContext packerContext = packer.newContext();

    final IValue result = packer.pack(params, packerContext);
    final ReadableMap map = packer.unpack(result, new JavaOnlyMap(), packerContext);
    final ReadableArray image1Array = map.getArray("image1");
    final ReadableArray imageInfoArray = map.getArray("image_info");
    final ReadableArray shouldRunTrackArray = map.getArray("should_run_track");
    final ReadableArray roisArray = map.getArray("previous_rois");

    Assert.assertTrue(image1Array.size() == 3 * 224 * 224);
    Assert.assertTrue(imageInfoArray.size() == 3);
    Assert.assertTrue(shouldRunTrackArray.size() == 1);
    Assert.assertTrue(shouldRunTrackArray.getDouble(0) == 0.0f);

    Assert.assertTrue(roisArray.size() == 12);
    double[] expectedRois =
        new double[] {0.f, 0.f, 20.f, 20.f, 10.f, 10.f, 50.f, 50.f, 30.f, 30.f, 60.f, 60.f};
    double[] rois = doubleArrayFromReadableArray(roisArray);
    for (int i = 0; i < 12; ++i) {
      Assert.assertEquals(expectedRois[i], rois[i], DOUBLE_EQUALS_DELTA);
    }
  }

  @Test
  public void bodyTrackingTest2() throws Exception {
    final long n = 3;

    final float[] bboxesData = {
      0.f, 0.f, 20.f, 20.f,
      10.f, 10.f, 30.f, 30.f,
      15.f, 15.f, 45.f, 45.f
    };
    final Tensor bboxes = Tensor.fromBlob(bboxesData, new long[] {n, 4});
    final float[] scoresData = {0.9f, 0.8f, 0.7f};
    final Tensor scores = Tensor.fromBlob(scoresData, new long[] {n});
    final long[] indicesData = {0, 1, 2};
    final Tensor indices = Tensor.fromBlob(indicesData, new long[] {n});
    final IValue ivalue =
        IValue.tupleFrom(
            IValue.from(n), IValue.from(bboxes), IValue.from(scores), IValue.from(indices));

    final String spec = readAsset("body_tracking_spec2.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);
    final PackerContext packerContext = packer.newContext();

    final ReadableMap map = packer.unpack(ivalue, new JavaOnlyMap(), packerContext);
    final int unpack_n = map.getInt("n");
    final double[] unpack_bboxes = doubleArrayFromReadableArray(map.getArray("bboxes"));
    final double[] unpack_scores = doubleArrayFromReadableArray(map.getArray("scores"));
    final int[] unpack_indices = intArrayFromReadableArray(map.getArray("indices"));

    Assert.assertTrue(n == unpack_n);
    Assert.assertTrue(unpack_bboxes.length == 4 * n);
    Assert.assertTrue(unpack_scores.length == n);
    Assert.assertTrue(unpack_indices.length == n);

    for (int i = 0; i < 4 * n; ++i) {
      Assert.assertEquals(unpack_bboxes[i], bboxesData[i], DOUBLE_EQUALS_DELTA);
    }
    for (int i = 0; i < n; ++i) {
      Assert.assertEquals(unpack_scores[i], scoresData[i], DOUBLE_EQUALS_DELTA);
    }
    for (int i = 0; i < n; ++i) {
      Assert.assertEquals(unpack_indices[i], indicesData[i], DOUBLE_EQUALS_DELTA);
    }
  }

  @Test
  public void bertTest() throws Exception {
    final String spec = readAsset("bert_qa_spec.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);

    final JavaOnlyMap params = new JavaOnlyMap();
    final String testText = "[CLS] Who was Jim Henson ? [SEP] Jim Henson was a puppeteer [SEP]";
    params.putString("string", testText);
    params.putInt("model_input_length", 50);

    final PackerContext packerContext = packer.newContext();
    IValue ivalue = packer.pack(params, packerContext);

    long[] data = ivalue.toTensor().getDataAsLongArray();
    final long[] tokenIds =
        new long[] {
          101, 2040, 2001, 3958, 27227, 1029, 102, 3958, 27227, 2001, 1037, 13997, 11510, 102
        };

    final long[] expected = new long[50];
    Arrays.fill(expected, 0);
    for (int i = 0; i < tokenIds.length; ++i) {
      expected[i] = tokenIds[i];
    }
    Assert.assertTrue(Arrays.equals(expected, data));

    final int n = tokenIds.length;
    final float[] startLogits = new float[n];
    Arrays.fill(startLogits, 0.f);
    startLogits[0] = 1.0f;

    final float[] endLogits = new float[n];
    Arrays.fill(endLogits, 0.f);
    endLogits[n - 1] = 1.0f;

    final Map<String, IValue> map = new HashMap<>();
    map.put("start_logits", IValue.from(Tensor.fromBlob(startLogits, new long[] {1, n})));
    map.put("end_logits", IValue.from(Tensor.fromBlob(endLogits, new long[] {1, n})));
    packerContext.store("token_ids", tokenIds);
    final ReadableMap output =
        packer.unpack(IValue.dictStringKeyFrom(map), new JavaOnlyMap(), packerContext);
    final String answer = output.getString("bert_answer");
    Assert.assertEquals(
        "[CLS] who was jim henson ? [SEP] jim henson was a puppeteer [SEP]", answer);
  }

  @Test
  public void gpt2PackTest() throws Exception {
    final String spec = readAsset("gpt2_spec.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);

    final JavaOnlyMap params = new JavaOnlyMap();
    params.putString("string", "Umka is a white fluffy pillow.");

    PackerContext packerContext = packer.newContext();
    IValue ivalue = packer.pack(params, packerContext);
    long[] data = ivalue.toTensor().getDataAsLongArray();
    final long[] expected = new long[] {37280, 4914, 318, 257, 2330, 39145, 28774, 13};
    Assert.assertTrue(Arrays.equals(expected, data));
  }

  @Test
  public void gpt2UnpackTest() throws Exception {
    final String spec = readAsset("gpt2_spec.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);
    final long[] data = new long[] {37280, 4914, 318, 257, 2330, 39145, 28774, 13};

    PackerContext packerContext = packer.newContext();
    final ReadableMap map =
        packer.unpack(
            IValue.from(Tensor.fromBlob(data, new long[] {1, 8})),
            new JavaOnlyMap(),
            packerContext);

    Assert.assertEquals("Umka is a white fluffy pillow.", map.getString("text"));
  }

  public static class TestCustomPacker extends BaseIValuePacker {

    public TestCustomPacker(@Nullable String specSrc) throws JSONException {
      super(specSrc);

      // Register additional packers/unpackers
      PackerRegistry.register(
          "tensor_from_string_custom",
          (jobject, params, packerContext) -> {
            final long[] tokenIds =
                getGPT2Tokenizer(packerContext).tokenize(jobject.getString("string"));
            return IValue.from(Tensor.fromBlob(tokenIds, new long[] {1, tokenIds.length}));
          });
      PackerRegistry.register(
          "tensor_to_string_custom",
          (ivalue, jobject, map, packerContext) -> {
            final long[] tokenIds = ivalue.toTensor().getDataAsLongArray();
            map.putString(
                jobject.getString("key"), getGPT2Tokenizer(packerContext).decode(tokenIds));
          });
    }

    private GPT2Tokenizer getGPT2Tokenizer(PackerContext packerContext)
        throws JSONException, UnsupportedEncodingException {
      GPT2Tokenizer gpt2Tokenizer = (GPT2Tokenizer) packerContext.get("gpt2_tokenizer_custom");
      if (gpt2Tokenizer == null) {
        gpt2Tokenizer =
            new GPT2Tokenizer(packerContext.specSrcJson.getJSONObject("vocabulary_gpt2_custom"));
        packerContext.store("gpt2_tokenizer_custom", gpt2Tokenizer);
      }
      return gpt2Tokenizer;
    }
  }

  private static String colorHexString(@ColorInt int color) {
    return String.format("#%06X", (0xFFFFFF & color));
  }

  @Test
  public void testAudio() throws Exception {
    final String spec = readAsset("speech_recognition.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);
    final JavaOnlyMap params = new JavaOnlyMap();
    final int sec = 3;
    final short[] sdata = new short[16000 * sec];
    JSContext.NativeJSRef ref = JSContext.wrapObject(new Audio(sdata));
    params.putMap("audio", ref.getJSRef());
    params.putInt("sample_rate", 16000);

    PackerContext packerContext = packer.newContext();
    IValue packRes = packer.pack(params, packerContext);
    final float[] fdata = packRes.toTensor().getDataAsFloatArray();

    Assert.assertEquals(sdata.length, fdata.length);
    for (int i = 0; i < sdata.length; ++i) {
      Assert.assertTrue(
          Math.abs(sdata[i] / (float) Short.MAX_VALUE - fdata[i]) < DOUBLE_EQUALS_DELTA);
    }
  }

  @Test
  public void mnist() throws Exception {
    final String spec = readAsset("mnist.json");
    final IIValuePacker packer = new BaseIValuePacker(spec);
    final JavaOnlyMap params = new JavaOnlyMap();
    Bitmap bitmap = Bitmap.createBitmap(224, 224, Bitmap.Config.ARGB_8888);

    Canvas canvas = new Canvas(bitmap);
    Paint paintBg = new Paint();
    final @ColorInt int colorBg = Color.BLUE;
    final @ColorInt int colorFg = Color.YELLOW;
    paintBg.setColor(colorBg);
    canvas.drawRect(new Rect(0, 0, 228, 228), paintBg);
    Paint paintFg = new Paint();
    paintFg.setColor(colorFg);
    paintFg.setStrokeWidth(40.f);
    canvas.drawLine(112, 40, 112, 228 - 40, paintFg);

    JSContext.NativeJSRef ref = JSContext.wrapObject(new Image(bitmap));
    params.putMap("image", ref.getJSRef());
    params.putString("colorBackground", colorHexString(colorBg));
    params.putString("colorForeground", colorHexString(colorFg));
    params.putInt("crop_width", 28);
    params.putInt("crop_height", 28);
    params.putInt("scale_width", 28);
    params.putInt("scale_height", 28);

    PackerContext packerContext = packer.newContext();
    IValue packRes = packer.pack(params, packerContext);
    final float[] data = packRes.toTensor().getDataAsFloatArray();

    Assert.assertEquals(28 * 28, data.length);
    final Set<Float> set = new HashSet<>();
    for (float f : data) {
      set.add(f);
    }
    Assert.assertEquals(2, set.size());
    for (float f : set) {
      float v = 0.3081f * f + 0.1307f;
      Assert.assertTrue(
          Math.abs(v - 1.f) < DOUBLE_EQUALS_DELTA || Math.abs(v) < DOUBLE_EQUALS_DELTA);
    }
  }
}
