/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.media;

import android.graphics.Bitmap;
import androidx.annotation.Keep;
import com.facebook.proguard.annotations.DoNotStrip;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import org.pytorch.rn.core.audio.IAudio;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.javascript.JSContext;

public class BlobUtils {

  @DoNotStrip
  @Keep
  public static ByteBuffer nativeJSRefToByteBuffer(final String refId) {
    final JSContext.NativeJSRef nativeJSRef = JSContext.getRef(refId);
    final Object obj = nativeJSRef.getObject();
    if (obj instanceof IImage) {
      final IImage image = (IImage) obj;
      final Bitmap bitmap = image.getBitmap();
      return bitmapToByteBuffer(bitmap);
    } else if (obj instanceof IAudio) {
      final IAudio audio = (IAudio) obj;
      return shortToByteBuffer(audio.getData());
    }
    throw new UnsupportedOperationException(
        "Cannot create ByteBuffer for type " + obj.getClass().getName());
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
  public static ByteBuffer shortToByteBuffer(final short[] data) {
    ByteBuffer byteBuffer = ByteBuffer.allocateDirect(data.length * 2); // 1 short = 2 bytes
    byteBuffer.order(ByteOrder.nativeOrder());
    for (short s : data) {
      byteBuffer.putShort(s);
    }
    return byteBuffer;
  }
}
