/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class RGBNormTransform: IImageToTensorTransform {

    let mean: [Float]
    let std: [Float]

    enum RGBNormTransformError: Error {
        case NoRGBTransform
        case NoMeanOrStd
    }

    init(mean: [Float], std: [Float]) {
        self.mean = mean
        self.std = std
    }

    static func parse(transform: ModelSpecification.Transform) throws -> RGBNormTransform {
        if let mean = transform.mean, let std = transform.std {
            return RGBNormTransform(mean: mean, std: std)
        } else {
            throw RGBNormTransformError.NoMeanOrStd
        }
    }

    func transform(bitmap: CGImage) -> [Float32] {
        let w = bitmap.width
        let h = bitmap.height
        let bytesPerPixel = 4
        let bytesPerRow = bytesPerPixel * w
        let bitsPerComponent = 8
        var rawBytes: [UInt8] = [UInt8](repeating: 0, count: w * h * 4)
        rawBytes.withUnsafeMutableBytes { ptr in
            if let context = CGContext(data: ptr.baseAddress,
                                        width: w,
                                        height: h,
                                        bitsPerComponent: bitsPerComponent,
                                        bytesPerRow: bytesPerRow,
                                        space: CGColorSpaceCreateDeviceRGB(),
                                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) {
                let rect = CGRect(x: 0, y: 0, width: w, height: h)
                context.draw(bitmap, in: rect)
            }
        }
        var normalizedBuffer: [Float32] = [Float32](repeating: 0, count: w * h * 3)
        // normalize the pixel buffer
        // see https://pytorch.org/hub/pytorch_vision_resnet/ for more detail
        for i in 0 ..< w * h {
            normalizedBuffer[i] = (Float32(rawBytes[i * 4 + 0]) / 255.0 - mean[0]) / std[0] // R
            normalizedBuffer[w * h + i] = (Float32(rawBytes[i * 4 + 1]) / 255.0 - mean[1]) / std[1] // G
            normalizedBuffer[w * h * 2 + i] = (Float32(rawBytes[i * 4 + 2]) / 255.0 - mean[2]) / std[2]// B
        }
        return normalizedBuffer
    }
}
