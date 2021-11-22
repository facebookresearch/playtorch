/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch;

import android.content.Context;
import android.graphics.Bitmap;
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
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.ml.processing.IIValuePacker;
import org.pytorch.rn.core.ml.processing.IValuePackerImpl;
import org.pytorch.rn.core.ml.processing.PackerContext;

@RunWith(AndroidJUnit4.class)
@SmallTest
public class IValuePackerInstrumentedTest {

  public static final float DOUBLE_EQUALS_DELTA = 1e-6f;

  static {
    Context ctx = InstrumentationRegistry.getTargetContext();
    SoLoader.init(ctx, false);
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
    final IIValuePacker packer = new IValuePackerImpl(readAsset("body_tracking_spec.json"));
    final PackerContext packerContext = new PackerContext();
    final IValue result = packer.pack(params, packerContext);
    final ReadableMap map = packer.unpack(result, packerContext);
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
    final IIValuePacker packer = new IValuePackerImpl(readAsset("body_tracking_spec2.json"));
    final PackerContext packerContext = new PackerContext();
    final ReadableMap map = packer.unpack(ivalue, packerContext);
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
    String specSrcJson = readAsset("bert_qa_spec.json");
    final IIValuePacker packer = new IValuePackerImpl(specSrcJson);

    final JavaOnlyMap params = new JavaOnlyMap();
    final String testText = "[CLS] Who was Jim Henson ? [SEP] Jim Henson was a puppeteer [SEP]";
    params.putString("string", testText);
    params.putInt("model_input_length", 50);

    final PackerContext packerContext = new PackerContext();
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
    final ReadableMap output = packer.unpack(IValue.dictStringKeyFrom(map), packerContext);
    final String answer = output.getString("bert_answer");
    Assert.assertEquals(
        "[CLS] who was jim henson ? [SEP] jim henson was a puppeteer [SEP]", answer);
  }

  @Test
  public void gpt2PackTest() throws Exception {
    final IIValuePacker packer = new IValuePackerImpl(readAsset("gpt2_spec.json"));

    final JavaOnlyMap params = new JavaOnlyMap();
    params.putString("string", "Umka is a white fluffy pillow.");

    PackerContext packerContext = new PackerContext();
    IValue ivalue = packer.pack(params, packerContext);
    long[] data = ivalue.toTensor().getDataAsLongArray();
    final long[] expected = new long[] {37280, 4914, 318, 257, 2330, 39145, 28774, 13};
    Assert.assertTrue(Arrays.equals(expected, data));
  }

  @Test
  public void gpt2UnpackTest() throws Exception {
    final IIValuePacker packer = new IValuePackerImpl(readAsset("gpt2_spec.json"));
    final long[] data = new long[] {37280, 4914, 318, 257, 2330, 39145, 28774, 13};

    PackerContext packerContext = new PackerContext();
    final ReadableMap map =
        packer.unpack(IValue.from(Tensor.fromBlob(data, new long[] {1, 8})), packerContext);

    String text = map.getString("text");
    String expected = "Umka is a white fluffy pillow.";
    Assert.assertEquals(expected, text);
  }
}
