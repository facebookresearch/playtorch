/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class ImageDataImage: IImage {
    private var imageData: ImageData
    private var pixelDensity: CGFloat

    init(imageData: ImageData, pixelDensity: CGFloat) {
        self.imageData = imageData
        self.pixelDensity = pixelDensity
    }

    public func getPixelDensity() -> CGFloat {
        return self.pixelDensity
    }

    public func getWidth() -> CGFloat {
        return CGFloat(self.imageData.bitmap.width)
    }

    public func getHeight() -> CGFloat {
        return CGFloat(self.imageData.bitmap.height)
    }

    public func getNaturalWidth() -> Int {
        return Int(self.imageData.bitmap.width)
    }

    public func getNaturalHeight() -> Int {
        return Int(self.imageData.bitmap.height)
    }

    public func scale(sx: CGFloat, sy: CGFloat) throws -> IImage {
        if let cgImage = self.getBitmap() {
            let bitmapImage = Image(image: cgImage)
            return try ImageUtils.scale(image: bitmapImage, sx: sx, sy: sy)
        }
        throw ImageError.scale
    }

    public func getBitmap() -> CGImage? {
        return self.imageData.bitmap
    }

    public func close() throws {
        // TODO(T94684939)
    }
}
