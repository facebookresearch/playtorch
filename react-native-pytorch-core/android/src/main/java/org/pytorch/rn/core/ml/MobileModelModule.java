/*
 * Copyright (c) Facebook, Inc. and its affiliates.
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
import androidx.annotation.experimental.UseExperimental;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.Device;
import org.pytorch.IValue;
import org.pytorch.LiteModuleLoader;
import org.pytorch.Module;
import org.pytorch.rn.core.ml.processing.BaseIValuePacker;
import org.pytorch.rn.core.ml.processing.IIValuePacker;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class MobileModelModule extends ReactContextBaseJavaModule {

  public static final String REACT_MODULE = "PyTorchCoreMobileModelModule";

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
    return REACT_MODULE;
  }

  @ReactMethod
  public void preload(final String modelUri, Promise promise) throws IOException {
    executorService.execute(
        () -> {
          try {
            Log.d(REACT_MODULE, "Preload model: " + modelUri);
            fetchCacheAndLoadModel(modelUri);
            promise.resolve(null);
          } catch (JSONException
              | InstantiationException
              | InvocationTargetException
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
  @UseExperimental(markerClass = androidx.camera.core.ExperimentalGetImage.class)
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
            Log.e(REACT_MODULE, "Error on model fetch and forward:", e);
            promise.reject(e);
          }
        });
  }

  private ModuleHolder fetchCacheAndLoadModel(final String modelUri)
      throws JSONException, ClassNotFoundException, NoSuchMethodException, InstantiationException,
          IllegalAccessException, InvocationTargetException {
    Log.d(REACT_MODULE, "Load model: " + modelUri);

    Uri uri = Uri.parse(modelUri);

    // Get file path to cache model or load model from cache if loading from Uri fails
    File targetFile = new File(mReactContext.getCacheDir(), uri.getPath());

    // Always try to load model from uri to make sure it's always the latest version. Only if
    // fetching the model from the uri fails, it will load the cached version (if exists).
    try {
      downloadFile(uri, targetFile);
    } catch (IOException e) {
      // ignore, load model from cache instead
    }

    Log.d(REACT_MODULE, "Absolute local model path: " + targetFile.getAbsolutePath());

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
      try {
        downloadFile(specUri, specFile);
        InputStream inputStream = new FileInputStream(specFile);
        spec =
            new BufferedReader(new InputStreamReader(inputStream))
                .lines()
                .collect(Collectors.joining("\n"));

      } catch (IOException e2) {
        // ignore
      }
    }

    ModuleHolder moduleHolder = new ModuleHolder(module, spec);
    mModulesAndSpecs.put(modelUri, moduleHolder);
    return moduleHolder;
  }

  private void downloadFile(Uri uri, File targetFile) throws IOException {
    InputStream inputStream = new URL(uri.toString()).openStream();

    // Create directory for model if they don't exist
    targetFile.mkdirs();

    // Save content from stream to cache file
    java.nio.file.Files.copy(inputStream, targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

    // Close stream properly
    inputStream.close();
  }

  static IIValuePacker newPacker(final String customPackerClass, final String spec)
      throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException,
          InvocationTargetException, InstantiationException {
    final Class clazz = Class.forName(customPackerClass);
    final Constructor<?> ctor = clazz.getConstructor(String.class);
    return (IIValuePacker) ctor.newInstance(spec);
  }

  public static IIValuePacker getPacker(@Nullable String spec)
      throws JSONException, ClassNotFoundException, NoSuchMethodException,
          InvocationTargetException, InstantiationException, IllegalAccessException {
    if (spec == null) {
      return null;
    }

    final JSONObject specJson = new JSONObject(spec);
    final IIValuePacker packer =
        specJson.has(BaseIValuePacker.JSON_CUSTOM_PACKER_CLASS)
            ? newPacker(specJson.getString(BaseIValuePacker.JSON_CUSTOM_PACKER_CLASS), spec)
            : new BaseIValuePacker(spec);
    packer.doRegister();
    return packer;
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

    protected ModuleHolder(Module module, @Nullable String spec)
        throws JSONException, ClassNotFoundException, NoSuchMethodException,
            InvocationTargetException, InstantiationException, IllegalAccessException {
      this.module = module;
      this.packer = getPacker(spec);
    }
  }
}
