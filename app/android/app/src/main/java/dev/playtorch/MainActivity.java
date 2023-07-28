/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package dev.playtorch;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import androidx.annotation.Nullable;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import expo.modules.devlauncher.DevLauncherController;
import expo.modules.devmenu.react.DevMenuAwareReactActivity;
import expo.modules.splashscreen.SplashScreenImageResizeMode;
import expo.modules.splashscreen.singletons.SplashScreen;

public class MainActivity extends DevMenuAwareReactActivity
    implements TwoFingerLongPressDetector.TwoFingerLongPressListener {

  TwoFingerLongPressDetector twoFingerLongPressDetector = new TwoFingerLongPressDetector(this);

  @Override
  public void onTwoFingerLongPress() {
    // Create map for params
    WritableMap payload = Arguments.createMap();
    // Put data to map
    // Get EventEmitter from context and send event thanks to it
    ReactApplicationContext reactContext =
        (ReactApplicationContext)
            getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
    if (reactContext != null) {
      reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit("onTwoFingerLongPress", payload);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    if (DevLauncherController.tryToHandleIntent(this, intent)) {
      return;
    }
    super.onNewIntent(intent);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    Window w = getWindow();
    w.setStatusBarColor(Color.TRANSPARENT);
    w.setNavigationBarColor(Color.TRANSPARENT);
    w.getDecorView()
        .setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    super.onCreate(null);
    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, false);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  @Override
  public boolean dispatchTouchEvent(@Nullable MotionEvent ev) {
    twoFingerLongPressDetector.onTouchEvent(ev);
    return super.dispatchTouchEvent(ev);
  }
}
