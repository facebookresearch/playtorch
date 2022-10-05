/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package dev.playtorch;

import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.MotionEvent.PointerCoords;

/** Detects two finger long press. */
class TwoFingerLongPressDetector {
  private static final double PRECISION = 20.0;
  private static final int NEEDED_PRESS_TIME = 800;
  private static final int NEEDED_POINTER_COUNT = 2;
  private Boolean startedDetecting = false;
  private Long startTime = Long.MAX_VALUE;
  private MotionEvent.PointerCoords[] startPosition = {new PointerCoords(), new PointerCoords()};
  TwoFingerLongPressListener longPressListener;

  TwoFingerLongPressDetector(TwoFingerLongPressListener listener) {
    longPressListener = listener;
  }

  /** Handles touch event. If it detects long press then [longPressListener] is called. */
  void onTouchEvent(MotionEvent event) {
    if (event == null) {
      return;
    }

    if (!startedDetecting
        && event.getAction() == MotionEvent.ACTION_MOVE
        && event.getPointerCount() == NEEDED_POINTER_COUNT) {
      startedDetecting = true;
      startTime = SystemClock.uptimeMillis();
      for (int i = 0; i < startPosition.length; i++) {
        event.getPointerCoords(i, startPosition[i]);
      }
      return;
    }

    if (event.getAction() != MotionEvent.ACTION_MOVE
        || event.getPointerCount() != NEEDED_POINTER_COUNT) {
      startedDetecting = false;
      return;
    }

    for (int i = 0; i < startPosition.length; i++) {
      MotionEvent.PointerCoords out = new MotionEvent.PointerCoords();
      event.getPointerCoords(i, out);
      if (Math.abs(out.x - startPosition[i].x) > PRECISION
          || Math.abs(out.y - startPosition[i].y) > PRECISION) {
        startedDetecting = false;
        return;
      }
    }

    if (SystemClock.uptimeMillis() - startTime >= NEEDED_PRESS_TIME) {
      longPressListener.onTwoFingerLongPress();
      startedDetecting = false;
    }
  }

  interface TwoFingerLongPressListener {
    void onTwoFingerLongPress();
  }
}
