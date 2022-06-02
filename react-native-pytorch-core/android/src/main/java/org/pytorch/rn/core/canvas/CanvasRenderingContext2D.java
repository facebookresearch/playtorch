/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.canvas;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.text.TextPaint;
import android.util.DisplayMetrics;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactInvalidPropertyException;
import java.util.Stack;
import org.pytorch.rn.core.image.IImage;

public class CanvasRenderingContext2D {
  private final CanvasView mCanvasView;
  private final Stack<CanvasState> mSavedStates;
  private Paint mFillPaint;
  private Paint mStrokePaint;
  private Paint mBitmapPaint;
  private Paint mClearPaint;
  private TextPaint mTextFillPaint;
  private Bitmap mBitmap;
  private Canvas mCanvas;
  private Path mPath;

  public CanvasRenderingContext2D(CanvasView canvasView) {
    mCanvasView = canvasView;
    mSavedStates = new Stack<>();

    initPaint();
    init();
  }

  private void initPaint() {
    mFillPaint = new Paint();
    mFillPaint.setAntiAlias(true);
    mFillPaint.setDither(true);
    mFillPaint.setColor(Color.BLACK);
    mFillPaint.setStyle(Paint.Style.FILL);

    mStrokePaint = new Paint();
    mStrokePaint.setAntiAlias(true);
    mStrokePaint.setDither(true);
    mStrokePaint.setColor(Color.BLACK);
    mStrokePaint.setStyle(Paint.Style.STROKE);
    // Initialize stroke width to be pixel density, which matches 1px for a web canvas.
    mStrokePaint.setStrokeWidth(PixelUtil.toPixelFromDIP(1));

    mClearPaint = new Paint();
    mClearPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));

    mBitmapPaint = new Paint();
    mBitmapPaint.setFilterBitmap(true);

    mTextFillPaint = new TextPaint();
    mTextFillPaint.set(mFillPaint);
    mTextFillPaint.setStyle(Paint.Style.FILL);
    // The default font size for web canvas is 10px.
    mTextFillPaint.setTextSize(PixelUtil.toPixelFromDIP(10));
    // Initialize stroke width to be pixel density, which matches 1px for a web canvas.
    mTextFillPaint.setStrokeWidth(PixelUtil.toPixelFromDIP(1));
  }

  private void init() {
    mPath = new Path();

    DisplayMetrics displayMetrics = mCanvasView.getResources().getDisplayMetrics();
    mBitmap =
        Bitmap.createBitmap(
            displayMetrics.widthPixels, displayMetrics.heightPixels, Bitmap.Config.ARGB_8888);
    mCanvas = new Canvas(mBitmap);
  }

  protected void onDraw(Canvas canvas) {
    canvas.drawBitmap(mBitmap, 0, 0, mBitmapPaint);
  }

  public void setFillStyle(int color) {
    mFillPaint.setColor(color);
    mTextFillPaint.setColor(color);
  }

  public void setStrokeStyle(int color) {
    mStrokePaint.setColor(color);
  }

  public void setLineWidth(float width) {
    final float strokeWidth = PixelUtil.toPixelFromDIP(width);
    mStrokePaint.setStrokeWidth(strokeWidth);
    mTextFillPaint.setStrokeWidth(strokeWidth);
  }

  public void setLineCap(String lineCap) throws ReactInvalidPropertyException {
    Paint.Cap cap = null;
    switch (lineCap) {
      case "butt":
        cap = Paint.Cap.BUTT;
        break;
      case "round":
        cap = Paint.Cap.ROUND;
        break;
      case "square":
        cap = Paint.Cap.SQUARE;
        break;
      default:
        throw new ReactInvalidPropertyException("lineCap", lineCap, "butt | round | square");
    }

    Paint.Cap strokeCap = mStrokePaint.getStrokeCap();
    if (!cap.equals(strokeCap)) {
      mStrokePaint.setStrokeCap(cap);
    }

    Paint.Cap textCap = mTextFillPaint.getStrokeCap();
    if (!cap.equals(textCap)) {
      mTextFillPaint.setStrokeCap(cap);
    }
  }

  public void setLineJoin(String lineJoin) {
    Paint.Join join = null;
    switch (lineJoin) {
      case "bevel":
        join = Paint.Join.BEVEL;
        break;
      case "round":
        join = Paint.Join.ROUND;
        break;
      case "miter":
        join = Paint.Join.MITER;
        break;
      default:
        throw new ReactInvalidPropertyException("lineJoin", lineJoin, "bevel | round | miter");
    }

    Paint.Join strokeCap = mStrokePaint.getStrokeJoin();
    if (!join.equals(strokeCap)) {
      mStrokePaint.setStrokeJoin(join);
    }

    Paint.Join textCap = mTextFillPaint.getStrokeJoin();
    if (!join.equals(textCap)) {
      mTextFillPaint.setStrokeJoin(join);
    }
  }

  public void setMiterLimit(final float miterLimit) {
    mStrokePaint.setStrokeMiter(miterLimit);
    mTextFillPaint.setStrokeMiter(miterLimit);
  }

  public void setTextAlign(final String textAlign) {
    Paint.Align align = null;
    switch (textAlign) {
      case "left":
        align = Paint.Align.LEFT;
        break;
      case "center":
        align = Paint.Align.CENTER;
        break;
      case "right":
        align = Paint.Align.RIGHT;
        break;
      default:
        throw new ReactInvalidPropertyException("textAlign", textAlign, "left | center | right");
    }

    Paint.Align currentAlign = mTextFillPaint.getTextAlign();
    if (!align.equals(currentAlign)) {
      mTextFillPaint.setTextAlign(align);
    }
  }

  public void clear() {
    mCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
    mPath.reset();
  }

  public void clearRect(float x, float y, float width, float height) {
    mCanvas.drawRect(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(x + width),
        PixelUtil.toPixelFromDIP(y + height),
        mClearPaint);
  }

  public void strokeRect(float x, float y, float width, float height) {
    mCanvas.drawRect(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(x + width),
        PixelUtil.toPixelFromDIP(y + height),
        mStrokePaint);
  }

  public void fillRect(float x, float y, float width, float height) {
    mFillPaint.setStyle(Paint.Style.FILL);
    mCanvas.drawRect(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(x + width),
        PixelUtil.toPixelFromDIP(y + height),
        mFillPaint);
  }

  public void beginPath() {
    mPath.reset();
  }

  public void closePath() {
    mPath.close();
  }

  public void stroke() {
    mCanvas.drawPath(mPath, mStrokePaint);
  }

  public void fill() {
    mCanvas.drawPath(mPath, mFillPaint);
  }

  public void arc(
      float x, float y, float radius, float startAngle, float endAngle, boolean counterclockwise) {
    RectF rect =
        new RectF(
            PixelUtil.toPixelFromDIP(x - radius),
            PixelUtil.toPixelFromDIP(y - radius),
            PixelUtil.toPixelFromDIP(x + radius),
            PixelUtil.toPixelFromDIP(y + radius));

    float PI2 = (float) Math.PI * 2;

    float sweepAngle = endAngle - startAngle;
    float initialAngle = startAngle % PI2;

    if (!counterclockwise && sweepAngle < 0) {
      sweepAngle %= PI2;
      if (sweepAngle < 0 || initialAngle == 0) {
        sweepAngle += PI2;
      }
    } else if (counterclockwise && sweepAngle > 0) {
      sweepAngle %= PI2;
      if (sweepAngle > 0 || initialAngle == 0) {
        sweepAngle -= PI2;
      }
    }

    mPath.addArc(rect, radiansToDegrees(initialAngle), radiansToDegrees(sweepAngle));
  }

  public void rect(float x, float y, float width, float height) {
    mPath.addRect(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(x + width),
        PixelUtil.toPixelFromDIP(y + height),
        Path.Direction.CW);
  }

  public void lineTo(float x, float y) {
    mPath.lineTo(PixelUtil.toPixelFromDIP(x), PixelUtil.toPixelFromDIP(y));
  }

  public void moveTo(float x, float y) {
    mPath.moveTo(PixelUtil.toPixelFromDIP(x), PixelUtil.toPixelFromDIP(y));
  }

  public void drawCircle(float x, float y, float radius) {
    mCanvas.drawCircle(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(radius),
        mStrokePaint);
  }

  public void fillCircle(float x, float y, float radius) {
    mCanvas.drawCircle(
        PixelUtil.toPixelFromDIP(x),
        PixelUtil.toPixelFromDIP(y),
        PixelUtil.toPixelFromDIP(radius),
        mFillPaint);
  }

  public void drawImage(IImage image, float dx, float dy) {
    float imagePixelDensity = image.getPixelDensity();
    Matrix matrix = new Matrix();
    matrix.postScale(
        PixelUtil.getDisplayMetricDensity() / imagePixelDensity,
        PixelUtil.getDisplayMetricDensity() / imagePixelDensity);
    matrix.postTranslate(PixelUtil.toPixelFromDIP(dx), PixelUtil.toPixelFromDIP(dy));
    mCanvas.drawBitmap(image.getBitmap(), matrix, null);
  }

  public void drawImage(IImage image, float dx, float dy, float dWidth, float dHeight) {
    Bitmap bitmap = image.getBitmap();
    int sWidth = bitmap.getWidth();
    int sHeight = bitmap.getHeight();
    float scaleX = PixelUtil.toPixelFromDIP(dWidth) / sWidth;
    float scaleY = PixelUtil.toPixelFromDIP(dHeight) / sHeight;

    Matrix matrix = new Matrix();
    matrix.postScale(scaleX, scaleY);
    matrix.postTranslate(PixelUtil.toPixelFromDIP(dx), PixelUtil.toPixelFromDIP(dy));
    mCanvas.drawBitmap(bitmap, matrix, null);
  }

  public void drawImage(
      IImage image,
      float sx,
      float sy,
      float sWidth,
      float sHeight,
      float dx,
      float dy,
      float dWidth,
      float dHeight) {
    Bitmap bitmap = image.getBitmap();
    // Extract source x,y,width,height from original bitmap into destination bitmap
    Bitmap destBitmap =
        Bitmap.createBitmap(bitmap, (int) sx, (int) sy, (int) sWidth, (int) sHeight);

    float scaleX = PixelUtil.toPixelFromDIP(dWidth) / sWidth;
    float scaleY = PixelUtil.toPixelFromDIP(dHeight) / sHeight;

    Matrix matrix = new Matrix();
    matrix.postScale(scaleX, scaleY);
    matrix.postTranslate(PixelUtil.toPixelFromDIP(dx), PixelUtil.toPixelFromDIP(dy));
    mCanvas.drawBitmap(destBitmap, matrix, null);
  }

  public ImageData getImageData(float sx, float sy, float sw, float sh) {
    int x = (int) PixelUtil.toPixelFromDIP(sx);
    int y = (int) PixelUtil.toPixelFromDIP(sy);
    int pixelWidth = (int) PixelUtil.toPixelFromDIP(sw);
    int pixelHeight = (int) PixelUtil.toPixelFromDIP(sh);
    Bitmap bitmap = Bitmap.createBitmap(mBitmap, x, y, pixelWidth, pixelHeight);
    return new ImageData(bitmap, (int) sw, (int) sh);
  }

  public void putImageData(ImageData imageData, float dx, float dy) {
    // This method is not affected by the canvas transformation matrix. We save the canvas transform
    // and restore it afterwards.
    mCanvas.save();
    Bitmap bitmap = imageData.getBitmap();
    mCanvas.drawBitmap(bitmap, PixelUtil.toPixelFromDIP(dx), PixelUtil.toPixelFromDIP(dy), null);
    mCanvas.restore();
  }

  public void setFont(final ReadableMap font) {
    String textSizeString = font.getString("fontSize");
    int textSize = Integer.parseInt(textSizeString.substring(0, textSizeString.length() - 2));
    mTextFillPaint.setTextSize(PixelUtil.toPixelFromDIP(textSize));

    String fontFamily = font.getArray("fontFamily").getString(0);
    Typeface typeface = Typeface.DEFAULT;
    switch (fontFamily) {
      case "serif":
        typeface = Typeface.SERIF;
        break;
      case "sans-serif":
        typeface = Typeface.SANS_SERIF;
        break;
      case "monospace":
        typeface = Typeface.MONOSPACE;
        break;
    }

    int typefaceStyle = Typeface.NORMAL;

    String fontWeight = font.getString("fontWeight");
    if ("bold".equals(fontWeight)) {
      typefaceStyle += Typeface.BOLD;
    }

    String fontStyle = font.getString("fontStyle");
    if ("italic".equals(fontStyle)) {
      typefaceStyle += Typeface.ITALIC;
    }

    Typeface newTypeface = Typeface.create(typeface, typefaceStyle);
    mTextFillPaint.setTypeface(newTypeface);
  }

  public void fillText(String text, float x, float y) {
    mTextFillPaint.setStyle(Paint.Style.FILL);
    mCanvas.drawText(
        text, PixelUtil.toPixelFromDIP(x), PixelUtil.toPixelFromDIP(y), mTextFillPaint);
  }

  public void strokeText(String text, float x, float y) {
    mTextFillPaint.setStyle(Paint.Style.STROKE);
    mCanvas.drawText(
        text, PixelUtil.toPixelFromDIP(x), PixelUtil.toPixelFromDIP(y), mTextFillPaint);
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
   * @param a (m11) Horizontal scaling. A value of 1 results in no scaling.
   * @param b (m12) Vertical skewing.
   * @param c (m21) Horizontal skewing.
   * @param d (m22) Vertical scaling. A value of 1 results in no scaling.
   * @param e (dx) Horizontal translation (moving).
   * @param f (dy)Vertical translation (moving).
   *     <p>{@link
   *     https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform}
   */
  protected void setTransform(float a, float b, float c, float d, float e, float f) {
    Matrix matrix = new Matrix();
    matrix.setValues(
        new float[] {
          a, c, PixelUtil.toPixelFromDIP(e), b, d, PixelUtil.toPixelFromDIP(f), 0, 0, 1
        });
    mCanvas.setMatrix(matrix);
  }

  protected void scale(float x, float y) {
    mCanvas.scale(x, y);
  }

  protected void rotate(float angle) {
    mCanvas.rotate(radiansToDegrees(angle));
  }

  protected void translate(float x, float y) {
    mCanvas.translate(PixelUtil.toPixelFromDIP(x), PixelUtil.toPixelFromDIP(y));
  }

  /**
   * The CanvasRenderingContext2D save function saves the following states:
   *
   * <p>The drawing state that gets saved onto a stack consists of:
   *
   * <p>* The current transformation matrix. * The current clipping region. * The current dash list.
   * * The current values of the following attributes: strokeStyle, fillStyle, globalAlpha,
   * lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, shadowOffsetX, shadowOffsetY,
   * shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline, direction,
   * imageSmoothingEnabled.
   *
   * <p>However, the Android Canvas only saves the canvas, therefore the implementation needs to
   * additionally copy the current paints etc. into a canvas state that can be loaded on restore.
   *
   * <p>{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save}
   */
  protected void save() {
    // The Canvas.save() only saves current matrix and clip, so we have to separately save
    // additional drawing state.
    CanvasState savedState = new CanvasState(mStrokePaint, mFillPaint);
    // Create new paint objects with current paint state.
    mStrokePaint = new Paint(mStrokePaint);
    mFillPaint = new Paint(mFillPaint);

    mCanvas.save();
    mSavedStates.push(savedState);
  }

  protected void restore() {
    if (!mSavedStates.empty()) {
      CanvasState canvasState = mSavedStates.pop();
      mStrokePaint = canvasState.mStrokePaint;
      mFillPaint = canvasState.mFillPaint;
      mCanvas.restore();
    }
  }

  public void invalidate() {
    mCanvasView.invalidate();
  }

  private float radiansToDegrees(float radians) {
    return (float) (radians * 180 / Math.PI);
  }

  static class CanvasState {
    Paint mStrokePaint;
    Paint mFillPaint;

    private CanvasState(Paint strokePaint, Paint fillPaint) {
      mStrokePaint = strokePaint;
      mFillPaint = fillPaint;
    }
  }
}
