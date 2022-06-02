/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class CenterCropTransform: IImageTransform {

    enum CenterCropTransformError: Error {
        case illegalState
        case parseDimension
        case unwrappingOptional
    }

    private let outWidth: Float
    private let outHeight: Float

    init(outWidth: Float, outHeight: Float) {
        self.outWidth = outWidth
        self.outHeight = outHeight
    }

    static func parse(transform: JSON) throws -> CenterCropTransform {
        // If no width or height is defined, it will fallback to a default crop
        // ratio, which means it will center crop to the min dimension of the
        // input image.
        // swiftlint:disable:next empty_enum_arguments
        if !transform["width"].exists() || !transform["height"].exists() {
            return CenterCropTransform(outWidth: -1, outHeight: -1)
        }

        let widthString = transform["width"].stringValue
        let heightString = transform["height"].stringValue

        guard let width = Float(widthString),
              let height = Float(heightString)
        else {
            throw CenterCropTransformError.parseDimension
        }

        return CenterCropTransform(outWidth: width, outHeight: height)
    }

    func transform(bitmap: CGImage) throws -> CGImage {
        let width = Float(bitmap.width)
        let height = Float(bitmap.height)

        let ratio = width/height
        let cropRatio = outWidth/outHeight
        var cropWidth: Float
        var cropHeight: Float
        if cropRatio > ratio { // landscape
            cropWidth = width
            cropHeight = cropWidth / cropRatio
        } else { // portrait
            cropHeight = height
            cropWidth = cropHeight * cropRatio
        }

        if cropWidth > width || cropHeight > height {
            throw CenterCropTransformError.illegalState
        }

        let offsetX = (width - cropWidth) / 2
        let offsetY = (height - cropHeight) / 2

        if let croppedBitmap = bitmap.cropping(to: CGRect(x: Int(offsetX),
                                                          y: Int(offsetY),
                                                          width: Int(cropWidth),
                                                          height: Int(cropHeight))) {
            return croppedBitmap
        } else {
            throw CenterCropTransformError.unwrappingOptional
        }
    }
}
