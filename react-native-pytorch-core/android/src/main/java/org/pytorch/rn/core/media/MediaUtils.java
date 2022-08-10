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
    if (BlobUtils.kBlobTypeImageRGBA.equals(type)) {
      hasAlpha = true;
    } else if (BlobUtils.kBlobTypeImageRGB.equals(type)) {
      hasAlpha = false;
    } else {
      throw new UnsupportedOperationException("Cannot create image from blob with type: " + type);
    }

    final Bitmap bitmap = blobToBitmap(buffer, (int) width, (int) height, hasAlpha);
    return new Image(bitmap);
  }

  @DoNotStrip
  @Keep
  public static Bitmap blobToBitmap(
      final ByteBuffer buffer, final int width, final int height, final boolean hasAlpha) {
    final Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    final int length = buffer.limit();
    final byte[] data = new byte[length];
    buffer.get(data);

    int n = 0;
    int[] pixels = new int[width * height];
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

    bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
    return bitmap;
  }

  @DoNotStrip
  @Keep
  public static IAudio audioFromBytes(final byte[] bytes, int sampleRate) {
    final IAudio audio = new Audio(AudioUtils.toShortArray(bytes));
    return audio;
  }
}
