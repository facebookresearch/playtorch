/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class ImageUtils {
    static func scale(image: IImage, sx: CGFloat, sy: CGFloat) throws -> IImage {
        if let bitmap = image.getBitmap() {

            let width = Float(bitmap.width) * Float(sx)
            let height = Float(bitmap.height) * Float(sy)

            let size = CGSize(width: Int(width), height: Int(height))
            let rect = CGRect(x: 0, y: 0, width: size.width, height: size.height)

            let uiImage = UIImage(cgImage: bitmap)

            let renderFormat = UIGraphicsImageRendererFormat.default()
            renderFormat.opaque = false
            renderFormat.scale = 1
            let renderer = UIGraphicsImageRenderer(
                size: size,
                format: renderFormat
            )
            let scaledImage = renderer.image { (_) in
                uiImage.draw(in: rect)
            }
            guard let newBitmap = scaledImage.cgImage else {
                throw ImageError.scale
            }
            return BitmapImage(image: newBitmap)
        }
        throw ImageError.scale
    }
}
