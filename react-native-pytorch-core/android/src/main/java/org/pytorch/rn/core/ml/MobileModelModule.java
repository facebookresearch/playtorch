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
import java.net.URL;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import org.json.JSONException;
import org.pytorch.Device;
import org.pytorch.IValue;
import org.pytorch.LiteModuleLoader;
import org.pytorch.Module;
import org.pytorch.rn.core.ml.processing.IIValuePacker;
import org.pytorch.rn.core.ml.processing.IValuePackerImpl;
import org.pytorch.rn.core.ml.processing.PackerContext;

public class MobileModelModule extends ReactContextBaseJavaModule {

  public static final String REACT_MODULE = "PyTorchCoreMobileModelModule";

  private ReactApplicationContext mReactContext;

  ExecutorService executorService = Executors.newFixedThreadPool(4);
  private final HashMap<String, ModuleAndSpec> mModulesAndSpecs = new HashMap<>();

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
          } catch (IOException | JSONException e) {
            promise.reject(e);
          }
        });
  }

  @ReactMethod
  @UseExperimental(markerClass = androidx.camera.core.ExperimentalGetImage.class)
  public void execute(final String modelUri, final ReadableMap params, final Promise promise)
      throws IOException {
    executorService.execute(
        () -> {
          try {
            ModuleAndSpec moduleAndSpec = mModulesAndSpecs.get(modelUri);
            if (moduleAndSpec == null) {
              moduleAndSpec = fetchCacheAndLoadModel(modelUri);
            }
            final long startTime = SystemClock.elapsedRealtime();
            PackerContext packerContext = new PackerContext();
            IValue packedValue = moduleAndSpec.packer.pack(params, packerContext);
            IValue forwardResult = moduleAndSpec.module.forward(packedValue);
            ReadableMap result = moduleAndSpec.packer.unpack(forwardResult, packerContext);
            final long inferenceTime = SystemClock.elapsedRealtime() - startTime;

            WritableMap inferenceResult = Arguments.createMap();
            inferenceResult.putMap("result", result);
            inferenceResult.putDouble("inferenceTime", inferenceTime);
            promise.resolve(inferenceResult);
          } catch (Exception e) {
            Log.e(REACT_MODULE, e.toString());
            promise.reject(e);
          }
        });
  }

  private ModuleAndSpec fetchCacheAndLoadModel(final String modelUri)
      throws IOException, JSONException {
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

    ModuleAndSpec moduleAndSpec = new ModuleAndSpec(module, spec);
    mModulesAndSpecs.put(modelUri, moduleAndSpec);
    return moduleAndSpec;
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

  /**
   * Struct to hold the mobile model and the spec to pack/unpack high-level data-types from PyTorch
   * Live React Native.
   */
  private static class ModuleAndSpec {
    Module module;
    String spec;
    IIValuePacker packer;

    protected ModuleAndSpec(Module module, String spec) throws JSONException {
      this.module = module;
      this.spec = spec;
      this.packer = new IValuePackerImpl(spec);
    }
  }
}
