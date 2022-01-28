/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class TensorFromStringPacker: Packer {
    func pack(modelSpec: JSON, params: NSDictionary, packerContext: PackerContext) throws -> IValue? {
        let pack = modelSpec["pack"]
        let tokenizer = pack["tokenizer"].string
        switch tokenizer {
        case "bert":
            guard let vocabulary = modelSpec["vocabulary_bert"].string else {
                throw BaseIValuePackerError.packStringError
            }
            let bertTokenizer = try BertTokenizer(vocabulary: vocabulary)
            var tokenIds = try bertTokenizer.tokenize(content: pack["string"].stringValue,
                                                      modelInputLength: pack["model_input_length"].intValue)
            packerContext.store(key: "bert_tokenizer", value: bertTokenizer)
            packerContext.store(key: "token_ids", value: tokenIds)
            guard let tensor = Tensor.fromBlob(data: &tokenIds,
                                               shape: [1, NSNumber(value: tokenIds.count)],
                                               dtype: .long) else {
                throw BaseIValuePackerError.packStringError
            }
            return IValue.fromTensor(tensor)
        default:
            throw BaseIValuePackerError.packStringError
        }
    }
}
