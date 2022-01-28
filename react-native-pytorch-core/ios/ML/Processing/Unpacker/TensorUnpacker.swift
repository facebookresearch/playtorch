/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class TensorUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]

        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            let array = tensor?.getDataAsArray() ?? []
            result[key] = array
        default:
            throw BaseIValuePackerError.invalidDType
        }
    }
}
