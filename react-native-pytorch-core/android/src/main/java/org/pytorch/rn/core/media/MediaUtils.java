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
  public static IImage imageFromBlob(final ByteBuffer buffer, double width, double height) {
    buffer.order(ByteOrder.nativeOrder());
    final Bitmap bitmap = rgbToBitmap(buffer, (int) width, (int) height);
    return new Image(bitmap);
  }

  @DoNotStrip
  @Keep
  public static Bitmap rgbToBitmap(final ByteBuffer buffer, int width, int height) {
    final Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    final int length = buffer.limit();
    final byte[] data = new byte[length];
    buffer.get(data);

    int n = 0;
    for (int i = 0; i < width * height; i++) {
      int r = (int) (data[n++] & 0xff);
      int g = (int) (data[n++] & 0xff);
      int b = (int) (data[n++] & 0xff);

      int x = i / width;
      int y = i % width;

      int color = Color.rgb(r, g, b);
      bitmap.setPixel(y, x, color);
    }

    return bitmap;
  }
}
