/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class RGBNormTransform: IImageToTensorTransform {

    let mean: [Float]
    let std: [Float]

    init(mean: [Float], std: [Float]) {
        self.mean = mean
        self.std = std
    }

    static func parse(transform: JSON) throws -> RGBNormTransform {
        let mean = transform["mean"].arrayValue.map {$0.float ?? 0}
        let std = transform["std"].arrayValue.map {$0.float ?? 0}
        return RGBNormTransform(mean: mean, std: std)
    }

    func transform(bitmap: CGImage) -> Tensor? {
        let width = bitmap.width
        let height = bitmap.height
        let bytesPerPixel = 4
        let bytesPerRow = bytesPerPixel * width
        let bitsPerComponent = 8
        var rawBytes: [UInt8] = [UInt8](repeating: 0, count: width * height * 4)
        rawBytes.withUnsafeMutableBytes { ptr in
            if let context = CGContext(data: ptr.baseAddress,
                                        width: width,
                                        height: height,
                                        bitsPerComponent: bitsPerComponent,
                                        bytesPerRow: bytesPerRow,
                                        space: CGColorSpaceCreateDeviceRGB(),
                                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) {
                let rect = CGRect(x: 0, y: 0, width: width, height: height)
                context.draw(bitmap, in: rect)
            }
        }
        var normalizedBuffer: [Float32] = [Float32](repeating: 0, count: width * height * 3)
        // normalize the pixel buffer
        // see https://pytorch.org/hub/pytorch_vision_resnet/ for more detail
        for idx in 0 ..< width * height {
            normalizedBuffer[idx] = (Float32(rawBytes[idx * 4 + 0]) / 255.0 - mean[0]) / std[0] // R
            normalizedBuffer[width * height + idx] = (Float32(rawBytes[idx * 4 + 1]) / 255.0 - mean[1]) / std[1] // G
            normalizedBuffer[width * height * 2 + idx] = (Float32(rawBytes[idx * 4 + 2]) / 255.0 - mean[2]) / std[2]// B
        }
        return Tensor.fromBlob(data: &normalizedBuffer,
                               shape: [1, 3, NSNumber(value: Int32(width)), NSNumber(value: Int32(height))],
                               dtype: .float)
    }
}
