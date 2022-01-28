/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class TensorToImageUnpacker: Unpacker {
    func unpack(ivalue: IValue, modelSpec: JSON, result: inout [String: Any], packerContext: PackerContext) throws {
        let unpack = modelSpec["unpack"]

        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let tensor = ivalue.toTensor() else {
            throw BaseIValuePackerError.invalidUnpackType
        }
        guard let cgImage = try tensorToBitmap(tensor: tensor) else {
            throw BaseIValuePackerError.invalidUnpackType
        }
        let image = Image(image: cgImage)
        let ref = JSContext.wrapObject(object: image).getJSRef()
        result[key] = ref
    }

    private func tensorToBitmap(tensor: Tensor) throws -> CGImage? {
        guard let data = tensor.getDataAsArray() as? [Float32] else {
            throw BaseIValuePackerError.encodeImageError
        }
        let shape = tensor.shape

        let width = shape[3].intValue
        let height = shape[2].intValue

        // Determine the min/max value of data
        var max: Float32 = 0
        var min: Float32 = Float32.greatestFiniteMagnitude
        for val in data {
            if val > max {
              max = val
            }
            if val < min {
              min = val
            }
        }

        let delta = (max - min)
        var rgba: [UInt8] = [UInt8](repeating: 0, count: 4 * width * height)
        for val in 0..<(width * height) {
            rgba[4 * val] = (UInt8) ((data[val] - min) / delta * 255)
            rgba[4 * val + 1] = (UInt8) ((data[width * height + val] - min) / delta * 255)
            rgba[4 * val + 2] = (UInt8) ((data[width * height * 2 + val] - min) / delta * 255)
            rgba[4 * val + 3] = 255
        }

        let dataForProvider: Data = Data(rgba)
        let bytesPerPixel = 4
        let bitsPerPixel = 32
        let bytesPerRow = bytesPerPixel * width
        let bitsPerComponent = 8
        let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
        let provider: CGDataProvider! = CGDataProvider(data: dataForProvider as CFData)

        let cgImage = CGImage(
            width: width,
            height: height,
            bitsPerComponent: bitsPerComponent,
            bitsPerPixel: bitsPerPixel,
            bytesPerRow: bytesPerRow,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: bitmapInfo,
            provider: provider,
            decode: nil,
            shouldInterpolate: false,
            intent: .defaultIntent
        )
        return cgImage
    }
}
