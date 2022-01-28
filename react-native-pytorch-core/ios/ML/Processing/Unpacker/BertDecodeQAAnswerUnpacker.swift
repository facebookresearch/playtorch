/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class BertDecodeQAAnswerUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]

        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let bertTokenizer = packerContext.get(key: "bert_tokenizer") as? BertTokenizer,
              let tokenIds = packerContext.get(key: "token_ids") as? [Int] else {
            throw BaseIValuePackerError.decodeBertError
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.decodeBertError
        }

        guard let startLogitTensor = dict["start_logits"]?.toTensor(),
              let endLogitTensor = dict["end_logits"]?.toTensor() else {
            throw BaseIValuePackerError.decodeBertError
        }

        let startLogits = startLogitTensor.getDataAsArrayBert()
        let endLogits = endLogitTensor.getDataAsArrayBert()
        let startIdx = argmax(array: startLogits, dtype: startLogitTensor.dtype)
        let endIdx = argmax(array: endLogits, dtype: endLogitTensor.dtype)

        // Return null (i.e., no answer found) if start index is outside the
        // lower bounds of the tokens or if start index is the same as the end
        // index.
        if startIdx < 0 || startIdx == endIdx {
            // Setting the answer nil is not necessarily required, but it is
            // explicit that the returned answer is nil (undefined in JS)
            result[key] = nil
            return
        }

        if startIdx > endIdx {
            throw BaseIValuePackerError.decodeBertError
        }

        let tokenIdRange = Array(tokenIds[startIdx...endIdx])
        do {
            let text = try bertTokenizer.decode(tokenIds: tokenIdRange)
            result[key] = text
        } catch {
            throw BaseIValuePackerError.decodeBertError
        }
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
