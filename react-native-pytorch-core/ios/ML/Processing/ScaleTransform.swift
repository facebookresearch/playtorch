/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class ScaleTransform: IImageTransform {

    private let width: Int
    private let height: Int

    enum ScaleTranformError: Error {
        case NoDimensProvided
        case ErrorScalingImage
    }

    init(width: Int, height: Int) {
        self.width = width
        self.height = height
    }

    public static func parse(transform: ModelSpecification.Transform) throws -> ScaleTransform {
        if let widthString = transform.width, let heightString = transform.height,
           let width = Int( widthString), let height = Int(heightString) {
            return ScaleTransform(width: width, height: height)
        } else {
            throw ScaleTranformError.NoDimensProvided
        }
    }

    func transform(bitmap: CGImage) throws -> CGImage {
        let newSize = CGSize(width: width, height: height)
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        let renderer = UIGraphicsImageRenderer(size: newSize, format: format)
        let image = renderer.image { ctx in
            ctx.cgContext.draw(bitmap, in: CGRect(origin: .zero, size: newSize))
        }
        if let cgImage = image.cgImage {
            return cgImage
        } else {
            throw ScaleTranformError.ErrorScalingImage
        }
    }
}
