/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.utils;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class FileUtils {
  public static void downloadUriToFile(String uriString, File destFile) {
    // Always try to load image from uri to make sure it's always the latest version. Only if
    // fetching the model from the uri fails, it will load the cached version (if exists).
    try {
      InputStream inputStream = new URL(uriString).openStream();

      // Create directory for model if they don't exist
      File parentFile = destFile.getParentFile();
      if (parentFile != null && !parentFile.exists()) {
        parentFile.mkdirs();
      }
      if (!destFile.exists()) {
        destFile.createNewFile();
      }

      // Save content from stream to cache file
      FileUtils.saveStreamToFile(inputStream, destFile);

      // Close stream properly
      inputStream.close();
    } catch (IOException e) {
      // ignore, load image from cache instead
    }
  }

  public static void saveStreamToFile(InputStream inputStream, File destFile) throws IOException {
    BufferedInputStream in = null;
    FileOutputStream fileOutputStream = null;
    try {
      in = new BufferedInputStream(inputStream);
      fileOutputStream = new FileOutputStream(destFile);
      byte[] dataBuffer = new byte[1024];
      int bytesRead;
      while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
        fileOutputStream.write(dataBuffer, 0, bytesRead);
      }
    } catch (IOException e) {
      if (in != null) {
        in.close();
      }
      if (fileOutputStream != null) {
        fileOutputStream.close();
      }
    } finally {
      if (in != null) {
        in.close();
      }
      if (fileOutputStream != null) {
        fileOutputStream.close();
      }
    }
  }

  public static String readFileToString(File file) {
    StringBuilder contentBuilder = new StringBuilder();
    try (BufferedReader br = new BufferedReader(new FileReader(file.getPath()))) {

      String sCurrentLine;
      while ((sCurrentLine = br.readLine()) != null) {
        contentBuilder.append(sCurrentLine).append("\n");
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return contentBuilder.toString();
  }
}
