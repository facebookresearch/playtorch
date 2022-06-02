/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.widget.Toast;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.views.imagehelper.ImageSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import org.pytorch.rn.core.canvas.ImageData;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.utils.FileUtils;

@ReactModule(name = "PyTorchCoreImageModule")
public class ImageModule extends ReactContextBaseJavaModule {

  public static final String TAG = "PTLImageModule";

  public static final String NAME = "PyTorchCoreImageModule";

  private ReactApplicationContext mReactContext;

  public ImageModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void release(ReadableMap imageRef, Promise promise) throws Exception {
    JSContext.release(imageRef);
    promise.resolve(null);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public int getWidth(ReadableMap imageRef) {
    IImage image = JSContext.unwrapObject(imageRef);
    return image.getWidth();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public int getHeight(ReadableMap imageRef) {
    IImage image = JSContext.unwrapObject(imageRef);
    return image.getHeight();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public float getNaturalWidth(ReadableMap imageRef) {
    IImage image = JSContext.unwrapObject(imageRef);
    return image.getNaturalWidth();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public float getNaturalHeight(ReadableMap imageRef) {
    IImage image = JSContext.unwrapObject(imageRef);
    return image.getNaturalHeight();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public float getPixelDensity(ReadableMap imageRef) {
    IImage image = JSContext.unwrapObject(imageRef);
    return image.getPixelDensity();
  }

  @ReactMethod
  public void scale(ReadableMap imageRef, double sx, double sy, Promise promise) {
    IImage image = JSContext.unwrapObject(imageRef);
    IImage scaledImage = image.scale((float) sx, (float) sy);
    JSContext.NativeJSRef ref = JSContext.wrapObject(scaledImage);
    promise.resolve(ref.getJSRef());
  }

  @ReactMethod
  public void fromURL(String urlString, Promise promise) {
    try {
      URL url = new URL(urlString);
      Bitmap bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream());
      IImage image = new Image(bitmap);
      JSContext.NativeJSRef ref = JSContext.wrapObject(image);
      promise.resolve(ref.getJSRef());
    } catch (IOException e) {
      promise.reject(e);
    }
    promise.reject(new Error("Could not load image from " + urlString));
  }

  @ReactMethod
  public void fromFile(String filepath, Promise promise) {
    File file = new File(filepath);
    if (file.exists()) {
      Bitmap bitmap = BitmapFactory.decodeFile(filepath);
      IImage image = new Image(bitmap);
      JSContext.NativeJSRef ref = JSContext.wrapObject(image);
      promise.resolve(ref.getJSRef());
    } else {
      promise.reject(new Error("File does not exist " + filepath));
    }
  }

  @ReactMethod
  public void fromBundle(final ReadableMap source, Promise promise) {
    final String uri = source.getString("uri");
    final ImageSource imageSource = new ImageSource(mReactContext, uri);
    if (Uri.EMPTY.equals(imageSource.getUri())) {
      warnImageSource(uri);
    }

    try {
      InputStream inputStream;
      if (imageSource.isResource()) {
        // A uri with no scheme (i.e., `null`) is likely to be a resource or
        // local file. Release mode builds bundle the model file in the APK as
        // a raw resource.
        final int resourceId =
            mReactContext
                .getResources()
                .getIdentifier(imageSource.getSource(), "drawable", mReactContext.getPackageName());
        if (resourceId != 0) {
          inputStream = mReactContext.getResources().openRawResource(resourceId);
        } else {
          // Fall back to the local file system
          inputStream = new FileInputStream(uri);
        }
      } else {
        // Get file path to cache image resource or load image resource from
        // cache if loading from URI fails
        final File targetFile = new File(mReactContext.getCacheDir(), uri);

        // Always try to load image resource from URI to make sure it's always
        // the latest version. Only if fetching the image resource from the URI
        // fails, it will load the cached version (if exists).
        FileUtils.downloadUriToFile(imageSource.getSource(), targetFile);

        inputStream = new FileInputStream(targetFile);
      }

      Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
      IImage image = new Image(bitmap);
      JSContext.NativeJSRef ref = JSContext.wrapObject(image);
      promise.resolve(ref.getJSRef());
    } catch (IOException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void fromImageData(final ReadableMap imageDataRef, final boolean scaled, Promise promise) {
    ImageData imageData = JSContext.unwrapObject(imageDataRef);
    IImage image;
    if (scaled) {
      Bitmap bitmap = imageData.getScaledBitmap();
      image = new Image(bitmap);
    } else {
      // Create a copy of the bitmap to allow developers to independently
      // release the image data and this new image. Without a copy, the image
      // will have an invalid bitmap when the image data is released and vice
      // versa.
      Bitmap bitmap = imageData.getBitmap();
      Bitmap bitmapCopy = bitmap.copy(bitmap.getConfig(), bitmap.isMutable());
      image = new Image(bitmapCopy);
    }
    JSContext.NativeJSRef ref = JSContext.wrapObject(image);
    promise.resolve(ref.getJSRef());
  }

  @ReactMethod
  public void toFile(final ReadableMap imageRef, Promise promise) {
    try {
      IImage image = JSContext.unwrapObject(imageRef);
      Bitmap bitmap = image.getBitmap();
      File cacheDir = mReactContext.getCacheDir();
      File file = File.createTempFile("image", ".png", cacheDir);
      FileOutputStream outputStream = new FileOutputStream(file);
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
      promise.resolve(file.getAbsolutePath());
    } catch (IOException e) {
      promise.reject(e);
    }
  }

  private void warnImageSource(String uri) {
    if (ReactBuildConfig.DEBUG) {
      Toast.makeText(
              mReactContext,
              "Warning: Image source \"" + uri + "\" doesn't exist",
              Toast.LENGTH_SHORT)
          .show();
    }
  }
}
