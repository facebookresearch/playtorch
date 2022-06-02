/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class ImageData {
    enum ImageDataError: Error {
        case scaleImage
    }

    let bitmap: CGImage
    let scaledWidth: CGFloat
    let scaledHeight: CGFloat

    init(bitmap: CGImage, scaledWidth: CGFloat, scaledHeight: CGFloat) {
        self.bitmap = bitmap
        self.scaledWidth = scaledWidth
        self.scaledHeight = scaledHeight
    }

    func getScaledBitmap() throws -> CGImage {
        let size = CGSize(width: self.scaledWidth, height: self.scaledHeight)
        guard let scaledImage = UIImage(cgImage: self.bitmap).resizeImage(size: size),
              let scaledBitmap = scaledImage.cgImage else {
            throw ImageDataError.scaleImage
        }
        return scaledBitmap
    }
}
