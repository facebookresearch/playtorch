/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.example;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.soloader.SoLoader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.pytorch.IValue;
import org.pytorch.Tensor;
import org.pytorch.rn.core.PyTorchCorePackage;
import org.pytorch.rn.core.jsi.PyTorchCoreJSIModulePackage;
import org.pytorch.rn.core.ml.processing.Packer;
import org.pytorch.rn.core.ml.processing.PackerContext;
import org.pytorch.rn.core.ml.processing.PackerRegistry;
import org.pytorch.rn.core.ml.processing.Unpacker;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for
          // PyTorchCoreExample:
          // packages.add(new MyReactNativePackage());
          packages.add(new PyTorchCorePackage());
          return packages;
        }

        @Override
        protected JSIModulePackage getJSIModulePackage() {
          return new PyTorchCoreJSIModulePackage();
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    PackerRegistry.register(
        "foo",
        new Packer() {
          @Override
          public IValue pack(JSONObject jobject, ReadableMap params, PackerContext packerContext)
              throws JSONException, IOException {
            return null;
          }
        });

    PackerRegistry.register(
        "bounding_boxes2",
        new Unpacker() {
          @Override
          public void unpack(
              IValue ivalue, JSONObject jobject, WritableMap map, PackerContext packerContext)
              throws JSONException, IOException {
            map.putArray(jobject.getString("key"), decodeObjects(ivalue, jobject, packerContext));
          }
        });

    initializeFlipper(
        this,
        getReactNativeHost()
            .getReactInstanceManager()); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("org.pytorch.rn.core.example.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  private WritableArray decodeObjects(
      final IValue ivalue, final JSONObject jobject, final PackerContext packerContext)
      throws JSONException {
    final Map<String, IValue> map = ivalue.toDictStringKey();
    IValue predLogits = map.get("pred_logits");
    IValue predBoxes = map.get("pred_boxes");

    final String PROBABILITY_THRESHOLD_KEY = "probabilityThreshold";
    if (!jobject.has(PROBABILITY_THRESHOLD_KEY)) {
      throw new IllegalStateException(
          "model param value for " + PROBABILITY_THRESHOLD_KEY + " is missing [0, 1]");
    }
    double probabilityThreshold = jobject.getDouble(PROBABILITY_THRESHOLD_KEY);

    final String CLASSES_KEY = "classes";
    String[] classes;
    if (packerContext.get(CLASSES_KEY) != null) {
      classes = (String[]) packerContext.get(CLASSES_KEY);
    } else {
      if (!jobject.has(CLASSES_KEY)) {
        throw new IllegalStateException(
            CLASSES_KEY
                + "classes property is missing in the unpack definition for bounding_boxes unpack type");
      }
      try {
        JSONArray classesArray = jobject.getJSONArray(CLASSES_KEY);
        classes = toStringArray(classesArray);
        packerContext.store(CLASSES_KEY, classes);
      } catch (JSONException e) {
        throw new IllegalStateException(
            CLASSES_KEY
                + "classes property in the unpack definition for bounding_boxes needs to be an array of strings");
      }
    }

    final Tensor predLogitsTensor = predLogits.toTensor();
    final float[] confidencesTensor = predLogitsTensor.getDataAsFloatArray();
    final long[] confidencesShape = predLogitsTensor.shape();
    final int numClasses = (int) predLogitsTensor.shape()[2];

    final Tensor predBoxesTensor = predBoxes.toTensor();
    final float[] locationsTensor = predBoxesTensor.getDataAsFloatArray();
    final long[] locationsShape = predBoxesTensor.shape();

    WritableArray result = Arguments.createArray();

    for (int i = 0; i < confidencesShape[1]; i++) {
      float[] scores = softmax(confidencesTensor, i * numClasses, (i + 1) * numClasses);

      float maxProb = scores[0];
      int maxIndex = -1;
      for (int j = 0; j < scores.length; j++) {
        if (scores[j] > maxProb) {
          maxProb = scores[j];
          maxIndex = j;
        }
      }

      if (maxProb <= probabilityThreshold || maxIndex >= classes.length) {
        continue;
      }

      WritableMap match = Arguments.createMap();
      match.putString("objectClass", classes[maxIndex]);

      int locationsFrom = (int) (i * locationsShape[2]);
      WritableArray bounds = Arguments.createArray();
      bounds.pushDouble(locationsTensor[locationsFrom]);
      bounds.pushDouble(locationsTensor[locationsFrom + 1]);
      bounds.pushDouble(locationsTensor[locationsFrom + 2]);
      bounds.pushDouble(locationsTensor[locationsFrom + 3]);
      match.putArray("bounds", bounds);

      result.pushMap(match);
    }

    return result;
  }

  private static float[] softmax(float[] data, int from, int to) {
    float[] softmax = new float[to - from];
    float expSum = 0;

    for (int i = from; i < to; i++) {
      softmax[i - from] = (float) Math.exp(data[i]);
      expSum += softmax[i - from];
    }

    for (int i = 0; i < softmax.length; i++) {
      softmax[i] /= expSum;
    }
    return softmax;
  }

  private static String[] toStringArray(JSONArray array) throws JSONException {
    String[] arr = new String[array.length()];
    for (int i = 0; i < arr.length; i++) {
      arr[i] = array.getString(i);
    }
    return arr;
  }
}
