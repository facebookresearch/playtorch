/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicYuvToRGB;
import android.renderscript.Type;
import androidx.annotation.Nullable;
import java.nio.ByteBuffer;

public class ImageUtils {
  /**
   * The supported formats to convert an image to a Bitmap are JPEG and YUV_420_888.
   *
   * @param image A media Image from the camera X.
   * @return A Bitmap converted from the input image.
   */
  public static Bitmap toBitmap(android.media.Image image, @Nullable Context context) {
    android.media.Image.Plane[] planes = image.getPlanes();
    int format = image.getFormat();
    switch (format) {
        // This is the format from the CameraX image capture take picture call
      case ImageFormat.JPEG:
        ByteBuffer buffer = planes[0].getBuffer();
        byte[] bytes = new byte[buffer.remaining()];
        buffer.get(bytes);
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
      case ImageFormat.YUV_420_888:
        // This is the format from the CameraX image analyzer
        return ImageUtils.yuv420ToBitmap(image, context);
    }
    throw new ImageException(String.format("unsupported image format %s", format));
  }

  /**
   * Convert an image in YUV_420_888 format to bitmap. The code was adapted from the following
   * website: {@link
   * https://blog.minhazav.dev/how-to-convert-yuv-420-sp-android.media.Image-to-Bitmap-or-jpeg/}
   *
   * @param image An image in YUV_420_888 format
   * @return A bitmap converted from input image
   */
  private static Bitmap yuv420ToBitmap(android.media.Image image, Context context) {
    RenderScript rs = RenderScript.create(context);
    ScriptIntrinsicYuvToRGB script = ScriptIntrinsicYuvToRGB.create(rs, Element.U8_4(rs));

    // Refer the logic in a section below on how to convert a YUV_420_888 image
    // to single channel flat 1D array. For sake of this example I'll abstract it
    // as a method.
    byte[] nv21 = yuvToNV21(image);

    Type.Builder yuvType = new Type.Builder(rs, Element.U8(rs)).setX(nv21.length);
    Allocation in = Allocation.createTyped(rs, yuvType.create(), Allocation.USAGE_SCRIPT);

    Type.Builder rgbaType =
        new Type.Builder(rs, Element.RGBA_8888(rs)).setX(image.getWidth()).setY(image.getHeight());
    Allocation out = Allocation.createTyped(rs, rgbaType.create(), Allocation.USAGE_SCRIPT);

    // The allocations above "should" be cached if you are going to perform
    // repeated conversion of YUV_420_888 to Bitmap.
    in.copyFrom(nv21);
    script.setInput(in);
    script.forEach(out);

    Bitmap bitmap =
        Bitmap.createBitmap(image.getWidth(), image.getHeight(), Bitmap.Config.ARGB_8888);
    out.copyTo(bitmap);
    return bitmap;
  }

  private static byte[] yuvToNV21(android.media.Image image) {
    if (image.getFormat() != ImageFormat.YUV_420_888) {
      throw new IllegalArgumentException("Invalid image format");
    }

    ByteBuffer yBuffer = image.getPlanes()[0].getBuffer();
    ByteBuffer uBuffer = image.getPlanes()[1].getBuffer();
    ByteBuffer vBuffer = image.getPlanes()[2].getBuffer();

    int ySize = yBuffer.remaining();
    int uSize = uBuffer.remaining();
    int vSize = vBuffer.remaining();

    byte[] nv21 = new byte[ySize + uSize + vSize];

    // U and V are swapped
    yBuffer.get(nv21, 0, ySize);
    vBuffer.get(nv21, ySize, vSize);
    uBuffer.get(nv21, ySize + vSize, uSize);

    return nv21;
  }
}
