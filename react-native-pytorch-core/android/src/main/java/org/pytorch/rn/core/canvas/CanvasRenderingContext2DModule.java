/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import android.os.Handler;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ReactInvalidPropertyException;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.javascript.JSContext;

@ReactModule(name = "PyTorchCoreCanvasRenderingContext2DModule")
public class CanvasRenderingContext2DModule extends ReactContextBaseJavaModule {

  public static final String NAME = "PyTorchCoreCanvasRenderingContext2DModule";

  private final ReactApplicationContext mReactContext;

  private final Handler mMainHandler;

  public CanvasRenderingContext2DModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
    mMainHandler = new Handler(mReactContext.getMainLooper());
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void invalidate(ReadableMap canvasRef, Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.invalidate();
          promise.resolve(null);
        });
  }

  @ReactMethod
  public void setFillStyle(ReadableMap canvasRef, double color) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setFillStyle((int) color);
        });
  }

  @ReactMethod
  public void setStrokeStyle(ReadableMap canvasRef, double color) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setStrokeStyle((int) color);
        });
  }

  @ReactMethod
  public void setLineWidth(ReadableMap canvasRef, double width) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setLineWidth((int) width);
        });
  }

  @ReactMethod
  public void setLineCap(final ReadableMap canvasRef, final String lineCap, final Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          try {
            ctx.setLineCap(lineCap);
          } catch (ReactInvalidPropertyException e) {
            promise.reject(e);
          }
        });
  }

  @ReactMethod
  public void setLineJoin(
      final ReadableMap canvasRef, final String lineJoin, final Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          try {
            ctx.setLineJoin(lineJoin);
          } catch (ReactInvalidPropertyException e) {
            promise.reject(e);
          }
        });
  }

  @ReactMethod
  public void setMiterLimit(final ReadableMap canvasRef, final double miterLimit) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setMiterLimit((float) miterLimit);
        });
  }

  @ReactMethod
  public void setTextAlign(ReadableMap canvasRef, String textAlign, final Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          try {
            ctx.setTextAlign(textAlign);
          } catch (ReactInvalidPropertyException e) {
            promise.reject(e);
          }
        });
  }

  @ReactMethod
  public void clear(ReadableMap canvasRef) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.clear();
        });
  }

  @ReactMethod
  public void clearRect(ReadableMap canvasRef, double x, double y, double width, double height) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.clearRect((float) x, (float) y, (float) width, (float) height);
        });
  }

  @ReactMethod
  public void strokeRect(ReadableMap canvasRef, double x, double y, double width, double height) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.strokeRect((float) x, (float) y, (float) width, (float) height);
        });
  }

  @ReactMethod
  public void fillRect(ReadableMap canvasRef, double x, double y, double width, double height) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.fillRect((float) x, (float) y, (float) width, (float) height);
        });
  }

  @ReactMethod
  public void beginPath(ReadableMap canvasRef) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.beginPath();
        });
  }

  @ReactMethod
  public void closePath(ReadableMap canvasRef) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.closePath();
        });
  }

  @ReactMethod
  public void stroke(ReadableMap canvasRef) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.stroke();
        });
  }

  @ReactMethod
  public void fill(ReadableMap canvasRef) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.fill();
        });
  }

  @ReactMethod
  public void arc(
      ReadableMap canvasRef,
      double x,
      double y,
      double radius,
      double startAngle,
      double endAngle,
      boolean anticlockwise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.arc(
              (float) x,
              (float) y,
              (float) radius,
              (float) startAngle,
              (float) endAngle,
              anticlockwise);
        });
  }

  @ReactMethod
  public void rect(ReadableMap canvasRef, double x, double y, double width, double height) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.rect((float) x, (float) y, (float) width, (float) height);
        });
  }

  @ReactMethod
  public void lineTo(ReadableMap canvasRef, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.lineTo((float) x, (float) y);
        });
  }

  @ReactMethod
  public void moveTo(ReadableMap canvasRef, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.moveTo((float) x, (float) y);
        });
  }

  @ReactMethod
  public void drawCircle(ReadableMap canvasRef, double x, double y, double radius) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.drawCircle((float) x, (float) y, (float) radius);
        });
  }

  @ReactMethod
  public void fillCircle(ReadableMap canvasRef, double x, double y, double radius) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.fillCircle((float) x, (float) y, (float) radius);
        });
  }

  /**
   * This method is the equivalent to the ctx.drawImage of the web CanvasRenderingContext2D {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}.
   *
   * <p>Because React Native NativeModules don't support method overloading, it will be a single
   * method in Java (native) and the three different cases for the drawImage functions will be
   * dicerned by INVALID function params. The INVALID function value in this case will be any
   * negative value.
   *
   * <p>For more details on the method params, check out the web documentation for the
   * CanvasRenderingContext2D.
   */
  @ReactMethod
  public void drawImage(
      ReadableMap canvasRef,
      ReadableMap imageRef,
      double dx_sx,
      double dy_sy,
      double dWidth_sWidth,
      double dHeight_sHeight,
      double dx,
      double dy,
      double dWidth,
      double dHeight) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          IImage image = JSContext.unwrapObject(imageRef);
          if (image != null) {

            if (dWidth_sWidth < 0 || dHeight_sHeight < 0) {
              ctx.drawImage(image, (float) dx_sx, (float) dy_sy);
            } else if (dx < 0 || dy < 0) {
              ctx.drawImage(
                  image,
                  (float) dx_sx,
                  (float) dy_sy,
                  (float) dWidth_sWidth,
                  (float) dHeight_sHeight);
            } else {
              ctx.drawImage(
                  image,
                  (float) dx_sx,
                  (float) dy_sy,
                  (float) dWidth_sWidth,
                  (float) dHeight_sHeight,
                  (float) dx,
                  (float) dy,
                  (float) dWidth,
                  (float) dHeight);
            }
          }
        });
  }

  @ReactMethod
  public void getImageData(
      ReadableMap canvasRef, double sx, double sy, double sw, double sh, Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ImageData imageData = ctx.getImageData((float) sx, (float) sy, (float) sw, (float) sh);
          JSContext.NativeJSRef imageDataRef = JSContext.wrapObject(imageData);
          promise.resolve(imageDataRef.getJSRef());
        });
  }

  @ReactMethod
  public void putImageData(ReadableMap canvasRef, ReadableMap imageDataRef, double dx, double dy) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ImageData imageData = JSContext.unwrapObject(imageDataRef);
          ctx.putImageData(imageData, (float) dx, (float) dy);
        });
  }

  @ReactMethod
  public void setFont(ReadableMap canvasRef, ReadableMap font) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setFont(font);
        });
  }

  @ReactMethod
  public void fillText(ReadableMap canvasRef, String text, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.fillText(text, (float) x, (float) y);
        });
  }

  @ReactMethod
  public void strokeText(ReadableMap canvasRef, String text, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.strokeText(text, (float) x, (float) y);
        });
  }

  /**
   * The CanvasRenderingContext2D.setTransform() method of the Canvas 2D API resets (overrides) the
   * current transformation to the identity matrix, and then invokes a transformation described by
   * the arguments of this method. This lets you scale, rotate, translate (move), and skew the
   * context.
   *
   * <p>The transformation matrix is described by:
   *
   * <p>a & c & e
   *
   * <p>b & d & f
   *
   * <p>0 & 0 & 1
   *
   * <p>setTransform() has two types of parameter that it can accept. The older type consists of
   * several parameters representing the individual components of the transformation matrix to set:
   *
   * @param canvasRef The JS ref to the native canvas instance.
   * @param a (m11) Horizontal scaling. A value of 1 results in no scaling.
   * @param b (m12) Vertical skewing.
   * @param c (m21) Horizontal skewing.
   * @param d (m22) Vertical scaling. A value of 1 results in no scaling.
   * @param e (dx) Horizontal translation (moving).
   * @param f (dy)Vertical translation (moving).
   *     <p>{@link
   *     https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform}
   */
  @ReactMethod
  public void setTransform(
      ReadableMap canvasRef, double a, double b, double c, double d, double e, double f) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.setTransform((float) a, (float) b, (float) c, (float) d, (float) e, (float) f);
        });
  }

  @ReactMethod
  public void scale(ReadableMap canvasRef, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.scale((float) x, (float) y);
        });
  }

  @ReactMethod
  public void rotate(ReadableMap canvasRef, double angle) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.rotate((float) angle);
        });
  }

  @ReactMethod
  public void translate(ReadableMap canvasRef, double x, double y) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.translate((float) x, (float) y);
        });
  }

  @ReactMethod
  public void save(ReadableMap canvasRef, Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.save();
          promise.resolve(null);
        });
  }

  @ReactMethod
  public void restore(ReadableMap canvasRef, Promise promise) {
    mMainHandler.post(
        () -> {
          CanvasRenderingContext2D ctx = JSContext.unwrapObject(canvasRef);
          ctx.restore();
          promise.resolve(null);
        });
  }
}
