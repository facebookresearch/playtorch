/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.jsi;

import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import java.util.Collections;
import java.util.List;

public class PyTorchCoreJSIModulePackage implements JSIModulePackage {
  @Override
  public List<JSIModuleSpec> getJSIModules(
      ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
    reactApplicationContext.getNativeModule(PyTorchCoreJSIModule.class).installLib(jsContext);
    return Collections.emptyList();
  }
}
