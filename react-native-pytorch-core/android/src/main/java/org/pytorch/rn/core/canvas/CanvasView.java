/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import android.content.Context;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import org.pytorch.rn.core.javascript.JSContext;

public class CanvasView extends View {
  private CanvasRenderingContext2D mRenderingContext;

  public CanvasView(Context context) {
    super(context);
    initialize();
  }

  public CanvasView(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
    initialize();
  }

  public CanvasView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    initialize();
  }

  public CanvasView(
      Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
    super(context, attrs, defStyleAttr, defStyleRes);
    initialize();
  }

  private void initialize() {
    ReactContext reactContext = (ReactContext) getContext();
    reactContext.addLifecycleEventListener(
        new LifecycleEventListener() {
          @Override
          public void onHostResume() {
            JSContext.NativeJSRef ref = JSContext.wrapObject(mRenderingContext);
            reactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), "onContext2D", ref.getJSRef());
          }

          @Override
          public void onHostPause() {
            // empty
          }

          @Override
          public void onHostDestroy() {
            // empty
          }
        });

    mRenderingContext = new CanvasRenderingContext2D(this);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    mRenderingContext.onDraw(canvas);
  }

  public void setOverflow(@Nullable String overflow) {
    if (overflow == null) {
      setClipToOutline(true);
      return;
    }
    switch (overflow) {
      case "visible":
      case "scroll":
        setClipToOutline(false);
        break;
      case "hidden":
        setClipToOutline(true);
        break;
    }
  }

  // TODO(raedle) onDestroy view, release the NativeJSRef that wraps the context 2d
}
