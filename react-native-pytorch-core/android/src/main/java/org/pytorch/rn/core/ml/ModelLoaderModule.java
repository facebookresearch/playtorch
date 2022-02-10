/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml;

import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.pytorch.rn.core.utils.ModelUtils;

@ReactModule(name = "PyTorchCoreModelLoaderModule")
public class ModelLoaderModule extends ReactContextBaseJavaModule {

  public static final String TAG = "PTLModelLoaderModule";

  public static final String NAME = "PyTorchCoreModelLoaderModule";

  private final ReactApplicationContext mReactContext;

  private final ExecutorService executorService = Executors.newFixedThreadPool(1);

  public ModelLoaderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void download(final String modelUri, Promise promise) {
    executorService.execute(
        () -> {
          try {
            Log.d(TAG, "Preload model: " + modelUri);
            File targetFile = ModelUtils.downloadModel(mReactContext, modelUri);
            promise.resolve(targetFile.getAbsolutePath());
          } catch (IOException e) {
            promise.reject(e);
          }
        });
  }
}
