/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import org.pytorch.rn.core.javascript.JSContext;

@ReactModule(name = "PyTorchCoreImageDataModule")
public class ImageDataModule extends ReactContextBaseJavaModule {

  public static final String NAME = "PyTorchCoreImageDataModule";

  public ImageDataModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void release(ReadableMap imageDataRef, Promise promise) throws Exception {
    JSContext.release(imageDataRef);
    promise.resolve(null);
  }
}
