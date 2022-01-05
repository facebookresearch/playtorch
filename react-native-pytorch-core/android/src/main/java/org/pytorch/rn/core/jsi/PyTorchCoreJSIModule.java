/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.jsi;

import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = PyTorchCoreJSIModule.NAME)
public class PyTorchCoreJSIModule extends ReactContextBaseJavaModule {

  public static final String NAME = "PyTorchCoreJSI";

  static {
    try {
      // Used to load the 'native-lib' library on application startup.
      System.loadLibrary("torchlive");
    } catch (Exception e) {
      Log.e(NAME, e.getMessage());
    }
  }

  public PyTorchCoreJSIModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private native void nativeInstall(long jsi);

  public void installLib(JavaScriptContextHolder reactContext) {

    if (reactContext.get() != 0) {
      this.nativeInstall(reactContext.get());
    } else {
      Log.e(NAME, "JSI Runtime is not available in debug mode");
    }
  }
}
