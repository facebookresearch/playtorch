/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class TensorFromAudioPacker: Packer {
    func pack(modelSpec: JSON, params: NSDictionary, packerContext: PackerContext) throws -> IValue? {
        do {
            if let audioId = (params["audio"] as? NSDictionary)?["ID"] as? String {
                let audio = try AudioModule.unwrapAudio(audioId)

                let MAXVALUE = 32767
                var floatArray: [Float] = []
                for dat in audio.getData() {
                    floatArray.append(Float(dat) / Float(MAXVALUE))
                }

                guard let tensor = Tensor.fromBlob(data: &floatArray,
                                                   shape: [1, NSNumber(value: 16000*5)],
                                                   dtype: .float) else {
                    throw BaseIValuePackerError.audioUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw BaseIValuePackerError.audioUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.audioUnwrapError
        }
    }
}
