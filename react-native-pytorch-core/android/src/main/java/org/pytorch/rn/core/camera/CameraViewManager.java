/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.camera;

import android.util.Size;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.CameraSelector;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.util.Map;

public class CameraViewManager extends SimpleViewManager<CameraView> {

  public static final String REACT_CLASS = "PyTorchCoreCameraView";

  public final int COMMAND_TAKE_PICTURE = 1;
  public final int COMMAND_FLIP = 2;

  private final ReactApplicationContext mReactContext;

  public CameraViewManager(ReactApplicationContext reactContext) {
    this.mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  protected CameraView createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new CameraView(mReactContext);
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    return MapBuilder.of(
        "takePicture", COMMAND_TAKE_PICTURE,
        "flip", COMMAND_FLIP);
  }

  @Override
  public void receiveCommand(
      @NonNull CameraView cameraView, int commandId, @Nullable ReadableArray args) {
    switch (commandId) {
      case COMMAND_TAKE_PICTURE:
        cameraView.takePicture();
        break;
      case COMMAND_FLIP:
        cameraView.flipCamera();
        break;
    }
  }

  @Override
  public void receiveCommand(
      @NonNull CameraView cameraView, String commandId, @Nullable ReadableArray args) {
    int commandIdInt = Integer.parseInt(commandId);
    switch (commandIdInt) {
      case COMMAND_TAKE_PICTURE:
        cameraView.takePicture();
        break;
      case COMMAND_FLIP:
        cameraView.flipCamera();
        break;
    }
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    final MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    return builder
        .put(
            "onFrame",
            MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onFrame")))
        .put(
            "onCapture",
            MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCapture")))
        .build();
  }

  @ReactProp(name = "hideCaptureButton")
  public void setCaptureButtonVisibility(CameraView view, boolean hideCaptureButton) {
    view.setHideCaptureButton(hideCaptureButton);
  }

  @ReactProp(name = "hideFlipButton")
  public void setFlipButtonVisibility(CameraView view, boolean hideFlipButton) {
    view.setHideFlipButton(hideFlipButton);
  }

  @ReactProp(name = "targetResolution")
  public void setTargetResolution(CameraView view, @Nullable ReadableMap targetResolution) {
    if (targetResolution != null) {
      int width = targetResolution.getInt("width");
      int height = targetResolution.getInt("height");
      view.setTargetResolution(new Size(width, height));
    }
  }

  @ReactProp(name = "facing")
  public void setFacing(CameraView view, String facing) {
    if (facing.equals("back")) {
      view.setCameraSelector(CameraSelector.DEFAULT_BACK_CAMERA);
    } else if (facing.equals("front")) {
      view.setCameraSelector(CameraSelector.DEFAULT_FRONT_CAMERA);
    }
  }

  @Override
  protected void onAfterUpdateTransaction(CameraView view) {
    super.onAfterUpdateTransaction(view);
    view.maybeUpdateView();
  }
}
