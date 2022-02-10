/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.utils;

import android.net.Uri;
import android.util.Log;
import com.facebook.react.bridge.ReactContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ModelUtils {

  public static final String TAG = "PTLModelUtils";

  public static File downloadModel(final ReactContext reactContext, final String modelUri)
      throws IOException {
    Log.d(TAG, "Load model: " + modelUri);

    Uri uri = Uri.parse(modelUri);

    File targetFile;
    if (uri.getScheme() == null) {
      // A uri with no scheme (i.e., `null`) is likely to be a resource or local file. Release mode
      // builds bundle the model file in the APK as a raw resource.
      int resourceId =
          reactContext.getResources().getIdentifier(modelUri, "raw", reactContext.getPackageName());
      if (resourceId != 0) {
        targetFile = new File(rawResourceFilePath(reactContext, modelUri, resourceId));
      } else {
        // Fall back to the local file system
        targetFile = new File(uri.getPath());
      }
    } else if ("file".equals(uri.getScheme())) {
      // Load model from local file system if the scheme is file
      targetFile = new File(uri.getPath());
    } else {
      // Get file path to cache model or load model from cache if loading from URI fails
      targetFile = new File(reactContext.getCacheDir(), uri.getPath());

      // Always try to load model from uri to make sure it's always the latest version. Only if
      // fetching the model from the uri fails, it will load the cached version (if exists).
      FileUtils.downloadUriToFile(modelUri, targetFile);
    }

    Log.d(TAG, "Absolute local model path: " + targetFile.getAbsolutePath());

    return targetFile;
  }

  /**
   * Copy specified raw resource to the cache directory and return its absolute path.
   *
   * <p>This is a workaround because org.pytorch.LiteModuleLoader as of 1.10.0 does not have an API
   * to load a model from an asset with extra_files, although the API exists in C++.
   *
   * @return absolute file path
   */
  private static String rawResourceFilePath(
      final ReactContext reactContext, final String resourceName, final int resourceId)
      throws IOException {
    File file = new File(reactContext.getCacheDir(), resourceName);
    try (InputStream is = reactContext.getResources().openRawResource(resourceId)) {
      try (OutputStream os = new FileOutputStream(file)) {
        byte[] buffer = new byte[4 * 1024];
        int read;
        while ((read = is.read(buffer)) != -1) {
          os.write(buffer, 0, read);
        }
        os.flush();
      }
    }
    return file.getAbsolutePath();
  }
}
