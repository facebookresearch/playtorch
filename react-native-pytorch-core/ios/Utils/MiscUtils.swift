/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

/*
 * Define and use internal RCTPromiseResolveBlock and RCTPromiseRejectBlock to
 * avoid import error in auto generated "react_native_pytorch_core-Swift.h"
 * https://github.com/facebook/react-native/blob/main/React/Base/RCTBridgeModule.h#L33-L44
 */
public typealias InternalRCTPromiseResolveBlock = (_ result: Any?) -> Void
public typealias InternalRCTPromiseRejectBlock = (_ code: String?, _ message: String?, _ error: Error?) -> Void
