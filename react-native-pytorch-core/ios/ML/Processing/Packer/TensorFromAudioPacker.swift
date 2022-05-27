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
                let audio = try JSContextUtils.unwrapObject(audioId, IAudio.self)
                let intArray = audio.getData().withUnsafeBytes { (pointer: UnsafeRawBufferPointer) -> [Int16] in
                    let buffer = UnsafeBufferPointer<Int16>(start: UnsafeRawPointer(pointer.baseAddress!)
                                                                .bindMemory(to: Int16.self, capacity: 1),
                                                     count: audio.getData().count / 2)
                    return [Int16](buffer)
                }
                let MAXVALUE = 32767
                var floatArray: [Float] = []
                for dat in intArray {
                    floatArray.append(Float(dat) / Float(MAXVALUE))
                }

                guard let tensor = Tensor.fromBlob(data: &floatArray,
                                                   shape: [1, NSNumber(value: floatArray.count)],
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
