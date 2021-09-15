/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class ScaleTransform: IImageTransform {

    private let width: Float
    private let height: Float

    enum ScaleTranformError: Error {
        case NoDimensProvided
        case ErrorScalingImage
    }

    init(width: Float, height: Float) {
        self.width = width
        self.height = height
    }

    public static func parse(transform: JSON) throws -> ScaleTransform {
        let widthString = transform["width"].string!
        let heightString = transform["height"].string!
        let width = Float(widthString)!
        let height = Float(heightString)!
        return ScaleTransform(width: width, height: height)
    }

    func transform(bitmap: CGImage) throws -> CGImage {
        let newSize = CGSize(width: Int(width), height: Int(height))
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        let renderer = UIGraphicsImageRenderer(size: newSize, format: format)
        let image = renderer.image { ctx in
            var transform = CGAffineTransform(scaleX: 1, y: -1)
            transform = transform.translatedBy(x: 0, y: -newSize.height)
            ctx.cgContext.concatenate(transform)
            ctx.cgContext.draw(bitmap, in: CGRect(origin: .zero, size: newSize))
        }
        if let cgImage = image.cgImage {
            return cgImage
        } else {
            throw ScaleTranformError.ErrorScalingImage
        }
    }
}
