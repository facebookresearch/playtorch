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
import com.facebook.react.bridge.RuntimeExecutor;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;
import com.facebook.soloader.SoLoader;

@ReactModule(name = PyTorchCoreJSIModule.NAME)
public class PyTorchCoreJSIModule extends ReactContextBaseJavaModule {

  public static final String TAG = "PTLJSIModule";

  public static final String NAME = "PyTorchCoreJSI";

  static {
    try {
      SoLoader.loadLibrary("torchlive");
    } catch (Exception e) {
      Log.e(TAG, e.getMessage());
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

  private native void nativeInstall(
      long jsi, RuntimeExecutor runtimeExecutor, CallInvokerHolderImpl jsCallInvokerHolder);

  public void installLib(JavaScriptContextHolder reactContext) {

    if (reactContext.get() != 0) {
      RuntimeExecutor runtimeExecutor =
          getReactApplicationContext().getCatalystInstance().getRuntimeExecutor();
      CallInvokerHolderImpl jsCallInvokerHolder =
          (CallInvokerHolderImpl)
              getReactApplicationContext().getCatalystInstance().getJSCallInvokerHolder();
      this.nativeInstall(reactContext.get(), runtimeExecutor, jsCallInvokerHolder);
    } else {
      Log.e(TAG, "JSI Runtime is not available in debug mode");
    }
  }
}
