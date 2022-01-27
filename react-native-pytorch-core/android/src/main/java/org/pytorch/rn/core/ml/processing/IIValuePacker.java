/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.ml.processing;

import com.facebook.react.bridge.ReadableMap;
import org.pytorch.IValue;

public interface IIValuePacker {
  IValue pack(final ReadableMap params, PackerContext packerContext) throws Exception;

  ReadableMap unpack(final IValue output, final ReadableMap params, PackerContext packerContext)
      throws Exception;

  PackerContext newContext();
}
