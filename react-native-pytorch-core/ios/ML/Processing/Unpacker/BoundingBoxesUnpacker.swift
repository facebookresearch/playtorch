/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class BoundingBoxesUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]

        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        guard let predLogitsTensor = dict["pred_logits"]?.toTensor(),
              let predBoxesTensor = dict["pred_boxes"]?.toTensor(),
              let classes = unpack["classes"].array else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        let probabilityThreshold = unpack["probabilityThreshold"].doubleValue

        guard let confidencesTensor = predLogitsTensor.getDataAsArray(),
              let locationsTensor = predBoxesTensor.getDataAsArray() else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        let confidencesShape = predLogitsTensor.shape
        let numClasses = confidencesShape[2].intValue
        let locationsShape = predBoxesTensor.shape

        var boxedResults = [Any]()

        for cIdx in 0..<confidencesShape[1].intValue {
            let scores = softmax(data: confidencesTensor,
                                 fromIndex: cIdx * numClasses,
                                 toIndex: (cIdx + 1) * numClasses)

            var maxProb = scores[0]
            var maxIndex = 0
            for sIdx in 0..<scores.count where scores[sIdx] > maxProb {
                maxProb = scores[sIdx]
                maxIndex = sIdx
            }

            if maxProb <= probabilityThreshold || maxIndex >= classes.count {
                continue
            }

            var match = [String: Any]()
            match["objectClass"] = classes[maxIndex].stringValue

            let locationsFrom = cIdx * locationsShape[2].intValue
            var bounds = [Double]()
            bounds.append(locationsTensor[locationsFrom].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 1].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 2].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 3].doubleValue)
            match["bounds"] = bounds

            boxedResults.append(match)
        }

        result[key] = boxedResults
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
}
