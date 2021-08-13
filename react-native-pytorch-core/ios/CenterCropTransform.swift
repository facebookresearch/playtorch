/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class CenterCropTransform: IImageTransform {

    enum CenterCropTransformError: Error {
        case IllegalState
        case UnwrappingOptional
        case NoDimensProvided
    }

    private let outWidth: Float
    private let outHeight: Float

    init(outWidth: Float, outHeight: Float) {
        self.outWidth = outWidth
        self.outHeight = outHeight
    }

    static func parse(transform: ModelSpecification.Transform) throws -> CenterCropTransform {
        if let widthString = transform.width, let heightString = transform.height,
           let width = Float(widthString), let height = Float(heightString){
            return CenterCropTransform(outWidth: width, outHeight: height)
        } else {
            throw CenterCropTransformError.NoDimensProvided
        }
    }

    func transform(bitmap: CGImage) throws -> CGImage {
        let width = Float(bitmap.width)
        let height = Float(bitmap.height)

        let ratio = width/height
        let cropRatio = outWidth/outHeight
        var cropWidth: Float
        var cropHeight: Float
        if(cropRatio > ratio) { //landscape
            cropWidth = width
            cropHeight = cropWidth / cropRatio
        } else { //portrait
            cropHeight = height
            cropWidth = cropHeight * cropRatio
        }

        if(cropWidth > width || cropHeight > height) {
            throw CenterCropTransformError.IllegalState
        }

        let offsetX = (width - cropWidth) / 2
        let offsetY = (height - cropHeight) / 2

        if let croppedBitmap = bitmap.cropping(to: CGRect(x: Int(offsetX), y: Int(offsetY), width: Int(cropWidth), height: Int(cropHeight))) {
            return croppedBitmap
        } else {
            throw CenterCropTransformError.UnwrappingOptional
        }
    }
}
