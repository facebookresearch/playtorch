/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.pytorch.rn.core.audio.AudioModule;
import org.pytorch.rn.core.camera.CameraViewManager;
import org.pytorch.rn.core.canvas.CanvasRenderingContext2DModule;
import org.pytorch.rn.core.canvas.CanvasViewManager;
import org.pytorch.rn.core.canvas.ImageDataModule;
import org.pytorch.rn.core.image.ImageModule;
import org.pytorch.rn.core.jsi.PyTorchCoreJSIModule;
import org.pytorch.rn.core.ml.MobileModelModule;
import org.pytorch.rn.core.ml.ModelLoaderModule;

public class PyTorchCorePackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules(@NotNull ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(
        new MobileModelModule(reactContext),
        new ModelLoaderModule(reactContext),
        new ImageModule(reactContext),
        new ImageDataModule(reactContext),
        new CanvasRenderingContext2DModule(reactContext),
        new AudioModule(reactContext),
        new PyTorchCoreJSIModule(reactContext));
  }

  @Override
  public List<ViewManager> createViewManagers(@NotNull ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(
        new CameraViewManager(reactContext), new CanvasViewManager(reactContext));
  }
}
