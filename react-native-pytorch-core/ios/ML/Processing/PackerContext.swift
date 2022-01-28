/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

public class PackerContext {
    private var mMap = [String: Any]()
    public var mSpec: JSON

    public init(spec: JSON) {
        mSpec = spec
    }

    public func store(key: String, value: Any) {
        mMap[key] = value
    }

    public func get(key: String) -> Any? {
        return mMap[key]
    }
}
