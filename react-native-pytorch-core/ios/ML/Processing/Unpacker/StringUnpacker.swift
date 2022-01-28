/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class StringUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let answer = ivalue.toString() else {
            throw BaseIValuePackerError.decodeStringError
        }
        result[key] = answer
    }
}
