/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.camera;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = "PyTorchCoreCameraModule")
public class CameraModule extends ReactContextBaseJavaModule {

  private static final String TAG = CameraModule.class.getSimpleName();

  private static final String NAME = "PyTorchCoreCameraModule";

  public CameraModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void takePicture(int reactTag, boolean isPreviewView, Promise promise) {
    Activity activity = getCurrentActivity();
    View view = activity.findViewById(reactTag);

    try {
      CameraView cameraView = (CameraView) view;
      cameraView.takePicture(activity, isPreviewView, promise);
    } catch (Exception e) {
      // Sometimes(when RELOAD js of react-native) cause
      // `java.lang.ClassCastException: com.facebook.react.views.view.ReactViewGroup cannot be cast to org.pytorch.rn.core.camera.CameraView`
      // and crash the APP, then found catch Exception
      // and just return here is OK.

      // System.out.println(e);
      Log.e(TAG, Log.getStackTraceString(e));
      return;
    }
  }
}
