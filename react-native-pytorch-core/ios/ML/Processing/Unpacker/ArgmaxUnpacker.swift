/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class ArgmaxUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]

        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }
        let valueKey = unpack["valueKey"].string
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            guard let array = tensor?.getDataAsArray() else {
                throw BaseIValuePackerError.invalidParam
            }
            let maxIdx = argmax(array: array, dtype: tensor?.dtype)
            result[key] = maxIdx
            if valueKey != nil {
                let softmaxData = softmax(data: array)
                result[valueKey!] = softmaxData[maxIdx]
            }
        default:
            throw BaseIValuePackerError.invalidDType
        }
    }

    func softmax(data: [NSNumber]) -> [Double] {
        return softmax(data: data, fromIndex: 0, toIndex: data.count)
    }

    func softmax(data: [NSNumber], fromIndex: Int, toIndex: Int) -> [Double] {
        var softmax = [Double](repeating: 0.0, count: (toIndex - fromIndex))
        var expSum = 0.0

        for idx in fromIndex..<toIndex {
            let expValue = exp(data[idx].doubleValue)
            softmax[idx - fromIndex] = expValue
            expSum += expValue
        }

        for idx in 0..<softmax.count {
            softmax[idx] /= expSum
        }

        return softmax
    }

    private func argmax(array: [Any]?, dtype: PTMTensorType?) -> Int {
        guard let array = array, let dtype = dtype else {
            return 0
        }

        switch dtype {
        case .float:
            var max = -MAXFLOAT
            var ret = -1
            for (idx, item) in array.enumerated() {
                guard let num = item as? Float32 else {
                    continue
                }
                if num > max {
                  ret = idx
                  max = num
                }
            }
            return ret
        default:
            return 0
        }
    }
}
