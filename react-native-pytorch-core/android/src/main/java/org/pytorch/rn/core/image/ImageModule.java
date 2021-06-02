/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.image;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.StandardCopyOption;
import org.pytorch.rn.core.javascript.JSContext;

public class ImageModule extends ReactContextBaseJavaModule {

  public static final String REACT_MODULE = "PyTorchCoreImageModule";

  public ImageModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_MODULE;
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
  public void fromBundle(final String uriString, Promise promise) {
    Uri uri = Uri.parse(uriString);

    // Get file path to cache image or load image model from cache if loading from Uri fails
    File targetFile = new File(getReactApplicationContext().getCacheDir(), uri.getPath());

    // Always try to load image from uri to make sure it's always the latest version. Only if
    // fetching the model from the uri fails, it will load the cached version (if exists).
    try {
      InputStream inputStream = new URL(uriString).openStream();

      // Create directory for model if they don't exist
      targetFile.mkdirs();

      // Save content from stream to cache file
      java.nio.file.Files.copy(
          inputStream, targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

      // Close stream properly
      inputStream.close();
    } catch (IOException e) {
      // ignore, load image from cache instead
    }

    InputStream inputStream;
    try {
      inputStream = new FileInputStream(targetFile);
    } catch (FileNotFoundException e) {
      promise.reject(e);
      return;
    }

    Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
    IImage image = new Image(bitmap);
    JSContext.NativeJSRef ref = JSContext.wrapObject(image);
    promise.resolve(ref.getJSRef());
  }
}
