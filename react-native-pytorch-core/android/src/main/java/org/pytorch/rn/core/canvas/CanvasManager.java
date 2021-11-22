/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import java.util.Map;

public class CanvasManager extends SimpleViewManager<DrawingCanvasView> {

  public static final String REACT_CLASS = "PyTorchCoreCanvasView";

  private final ReactApplicationContext mReactContext;

  public CanvasManager(ReactApplicationContext reactContext) {
    mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  protected DrawingCanvasView createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new DrawingCanvasView(reactContext);
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    final MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    return builder
        .put(
            "onContext2D",
            MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onContext2D")))
        .build();
  }
}
