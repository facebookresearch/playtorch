/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.media;

import android.graphics.Bitmap;
import android.graphics.Color;
import androidx.annotation.Keep;
import com.facebook.proguard.annotations.DoNotStrip;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import org.pytorch.rn.core.audio.Audio;
import org.pytorch.rn.core.audio.AudioUtils;
import org.pytorch.rn.core.audio.IAudio;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;

public class MediaUtils {

  @DoNotStrip
  @Keep
  public static String wrapObject(final Object obj) {
    final JSContext.NativeJSRef ref = JSContext.wrapObject(obj);
    return ref.getJSRef().getString("ID");
  }

  @DoNotStrip
  @Keep
  public static void releaseObject(final String id) throws Exception {
    JSContext.release(id);
  }

  @DoNotStrip
  @Keep
  public static IImage imageFromBlob(
      final ByteBuffer buffer, final double width, final double height, final String type) {
    buffer.order(ByteOrder.nativeOrder());
    boolean hasAlpha = false;
    int channels;
    if (BlobUtils.kBlobTypeImageGrayscale.equals(type)) {
      channels = 1;
      hasAlpha = false;
    } else if (BlobUtils.kBlobTypeImageRGB.equals(type)) {
      channels = 3;
      hasAlpha = false;
    } else if (BlobUtils.kBlobTypeImageRGBA.equals(type)) {
      channels = 4;
      hasAlpha = true;
    } else {
      throw new UnsupportedOperationException("Cannot create image from blob with type: " + type);
    }

    final Bitmap bitmap = blobToBitmap(buffer, (int) width, (int) height, hasAlpha, channels);
    return new Image(bitmap);
  }

  @DoNotStrip
  @Keep
  public static ByteBuffer imageToByteBuffer(final IImage image) {
    final Bitmap bitmap = image.getBitmap();
    return bitmapToByteBuffer(bitmap);
  }

  @DoNotStrip
  @Keep
  public static Bitmap blobToBitmap(
      final ByteBuffer buffer,
      final int width,
      final int height,
      final boolean hasAlpha,
      final int channels) {
    final Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    int[] pixels = new int[width * height];

    if (channels == 1) {
      // Grayscale with 1 channel
      for (int i = 0; i < width * height; i++) {
        final int value = (int) (buffer.get(i) & 0xff);
        pixels[i] = Color.rgb(value, value, value);
      }
    } else {
      final int length = buffer.limit();
      final byte[] data = new byte[length];
      buffer.get(data);

      int n = 0;
      bitmap.setPremultiplied(true);
      for (int i = 0; i < width * height; i++) {
        int a = (int) (hasAlpha ? (data[n + 3] & 0xff) : 255);
        int r = (int) (data[n++] & 0xff) * a / 255;
        int g = (int) (data[n++] & 0xff) * a / 255;
        int b = (int) (data[n++] & 0xff) * a / 255;
        if (hasAlpha) {
          n++;
        }

        pixels[i] = (hasAlpha ? Color.argb(a, r, g, b) : Color.rgb(r, g, b));
      }
    }
    bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
    return bitmap;
  }

  @DoNotStrip
  @Keep
  public static ByteBuffer bitmapToByteBuffer(Bitmap bitmap) {
    byte[] buffer = bitmapToRGB(bitmap);
    ByteBuffer byteBuffer = ByteBuffer.allocateDirect(buffer.length);
    byteBuffer.order(ByteOrder.nativeOrder());
    byteBuffer.put(buffer);
    return byteBuffer;
  }

  @DoNotStrip
  @Keep
  public static byte[] bitmapToRGB(final Bitmap bitmap) {
    final int[] pixels = new int[bitmap.getWidth() * bitmap.getHeight()];
    final byte[] bytes = new byte[pixels.length * 3];
    bitmap.getPixels(pixels, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());
    int i = 0;
    for (int pixel : pixels) {
      // Get components assuming is ARGB
      int R = (pixel >> 16) & 0xff;
      int G = (pixel >> 8) & 0xff;
      int B = pixel & 0xff;
      bytes[i++] = (byte) R;
      bytes[i++] = (byte) G;
      bytes[i++] = (byte) B;
    }
    return bytes;
  }

  @DoNotStrip
  @Keep
  public static IAudio audioFromBytes(final byte[] bytes, int sampleRate) {
    final IAudio audio = new Audio(AudioUtils.toShortArray(bytes));
    return audio;
  }
}
