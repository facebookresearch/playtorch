/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml;

import android.net.Uri;
import android.os.SystemClock;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONException;
import org.pytorch.Device;
import org.pytorch.IValue;
import org.pytorch.LiteModuleLoader;
import org.pytorch.Module;
import org.pytorch.rn.core.ml.processing.BaseIValuePacker;
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
import org.pytorch.rn.core.utils.FileUtils;

@ReactModule(name = "PyTorchCoreMobileModelModule")
public class MobileModelModule extends ReactContextBaseJavaModule {

  static {
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

  public static final String TAG = "PTLMobileModelModule";

  public static final String NAME = "PyTorchCoreMobileModelModule";

  private ReactApplicationContext mReactContext;

  ExecutorService executorService = Executors.newFixedThreadPool(4);
  private final HashMap<String, ModuleHolder> mModulesAndSpecs = new HashMap<>();

  public MobileModelModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void preload(final String modelUri, Promise promise) throws IOException {
    executorService.execute(
        () -> {
          try {
            Log.d(TAG, "Preload model: " + modelUri);
            fetchCacheAndLoadModel(modelUri);
            promise.resolve(null);
          } catch (JSONException
              | InstantiationException
              | InvocationTargetException
              | IOException
              | NoSuchMethodException
              | IllegalAccessException
              | ClassNotFoundException e) {
            promise.reject(e);
          }
        });
  }

  @ReactMethod
  public void unload(Promise promise) {
    executorService.execute(
        () -> {
          mModulesAndSpecs.clear();
          promise.resolve(null);
        });
  }

  @ReactMethod
  public void execute(final String modelUri, final ReadableMap params, final Promise promise) {
    executorService.execute(
        () -> {
          try {
            ModuleHolder moduleHolder = mModulesAndSpecs.get(modelUri);
            if (moduleHolder == null) {
              moduleHolder = fetchCacheAndLoadModel(modelUri);
            }
            final PackerContext packerContext = moduleHolder.packer.newContext();

            final long packStartTime = SystemClock.elapsedRealtime();
            final IValue packedValue = moduleHolder.packer.pack(params, packerContext);
            final long packTime = SystemClock.elapsedRealtime() - packStartTime;

            final long inferenceStartTime = SystemClock.elapsedRealtime();
            final IValue forwardResult = moduleHolder.module.forward(packedValue);
            final long inferenceTime = SystemClock.elapsedRealtime() - inferenceStartTime;

            final long unpackStartTime = SystemClock.elapsedRealtime();
            final ReadableMap result =
                moduleHolder.packer.unpack(forwardResult, params, packerContext);
            final long unpackTime = SystemClock.elapsedRealtime() - unpackStartTime;

            WritableMap inferenceResult = Arguments.createMap();
            inferenceResult.putMap("result", result);

            WritableMap metrics = Arguments.createMap();
            metrics.putDouble("totalTime", packTime + inferenceTime + unpackTime);
            metrics.putDouble("packTime", packTime);
            metrics.putDouble("inferenceTime", inferenceTime);
            metrics.putDouble("unpackTime", unpackTime);
            inferenceResult.putMap("metrics", metrics);

            promise.resolve(inferenceResult);
          } catch (Exception e) {
            Log.e(TAG, "Error on model fetch and forward:", e);
            promise.reject(e);
          }
        });
  }

  /**
   * Copy specified raw resource to the cache directory and return its absolute path.
   *
   * <p>This is a workaround because org.pytorch.LiteModuleLoader as of 1.10.0 does not have an API
   * to load a model from an asset with extra_files, although the API exists in C++.
   *
   * @return absolute file path
   */
  private String rawResourceFilePath(String resourceName, int resourceId) throws IOException {
    File file = new File(mReactContext.getCacheDir(), resourceName);
    try (InputStream is = mReactContext.getResources().openRawResource(resourceId)) {
      try (OutputStream os = new FileOutputStream(file)) {
        byte[] buffer = new byte[4 * 1024];
        int read;
        while ((read = is.read(buffer)) != -1) {
          os.write(buffer, 0, read);
        }
        os.flush();
      }
    }
    return file.getAbsolutePath();
  }

  private ModuleHolder fetchCacheAndLoadModel(final String modelUri)
      throws JSONException, ClassNotFoundException, NoSuchMethodException, InstantiationException,
          IllegalAccessException, InvocationTargetException, IOException {
    Log.d(TAG, "Load model: " + modelUri);

    Uri uri = Uri.parse(modelUri);

    File targetFile;
    if (uri.getScheme() == null) {
      // A uri with no scheme (i.e., `null`) is likely to be a resource or local file. Release mode
      // builds bundle the model file in the APK as a raw resource.
      int resourceId =
          mReactContext
              .getResources()
              .getIdentifier(modelUri, "raw", mReactContext.getPackageName());
      if (resourceId != 0) {
        targetFile = new File(rawResourceFilePath(modelUri, resourceId));
      } else {
        // Fall back to the local file system
        targetFile = new File(uri.getPath());
      }
    } else if ("file".equals(uri.getScheme())) {
      // Load model from local file system if the scheme is file
      targetFile = new File(uri.getPath());
    } else {
      // Get file path to cache model or load model from cache if loading from URI fails
      targetFile = new File(mReactContext.getCacheDir(), uri.getPath());

      // Always try to load model from uri to make sure it's always the latest version. Only if
      // fetching the model from the uri fails, it will load the cached version (if exists).
      FileUtils.downloadUriToFile(modelUri, targetFile);
    }

    Log.d(TAG, "Absolute local model path: " + targetFile.getAbsolutePath());

    // Try to fetch live.spec.json from model file
    Map<String, String> extraFiles = new HashMap<>();
    // Note: regardless what initial value is set for the key "model/live.spec.json", the
    // Module.load method will set an empty string if the model file is not bundled inside the model
    // file.
    extraFiles.put("model/live.spec.json", "");
    Module module = LiteModuleLoader.load(targetFile.getAbsolutePath(), extraFiles, Device.CPU);

    // The string will neither be null nor empty if the model did contain a live.spec.json. As a
    // fallback, try to load the live.spec.json from the RN bundle.
    String spec = extraFiles.get("model/live.spec.json");
    if (spec == null || spec.isEmpty()) {
      // ignore
      Uri specUri =
          new Uri.Builder()
              .scheme(uri.getScheme())
              .encodedAuthority(uri.getEncodedAuthority())
              .encodedPath(uri.getEncodedPath() + ".live.spec.json")
              .encodedQuery(uri.getEncodedQuery())
              .build();

      // Get file path to cache model or load model from cache if loading from Uri fails
      File specFile = new File(mReactContext.getCacheDir(), specUri.getPath());
      FileUtils.downloadUriToFile(specUri.getPath(), specFile);
      spec = FileUtils.readFileToString(specFile);
    }

    ModuleHolder moduleHolder = new ModuleHolder(module, spec);
    mModulesAndSpecs.put(modelUri, moduleHolder);
    return moduleHolder;
  }

  /**
   * Struct to hold the mobile model and the spec to pack/unpack high-level data-types from PyTorch
   * Live React Native.
   *
   * <p>Class is public only for testing.
   */
  public static class ModuleHolder {
    Module module;
    IIValuePacker packer;

    protected ModuleHolder(Module module, @Nullable String spec) throws JSONException {
      this.module = module;
      this.packer = new BaseIValuePacker(spec);
    }
  }
}
