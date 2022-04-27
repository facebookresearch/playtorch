/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class BitmapImage: IImage {
    private var mBitmap: CGImage?
    private var ciImage: CIImage?
    public var width: CGFloat
    public var height: CGFloat

    init(image: CGImage) {
        self.mBitmap = image
        self.width = CGFloat(truncating: image.width as NSNumber)
        self.height = CGFloat(truncating: image.height as NSNumber)
    }

    init(image: CIImage) {
        self.ciImage = image
        self.width = image.extent.width
        self.height = image.extent.height
    }

    public func getPixelDensity() -> CGFloat {
        return 1.0
    }

    public func getWidth() -> CGFloat {
        return self.width
    }

    public func getHeight() -> CGFloat {
        return self.height
    }

    public func getNaturalWidth() -> Int {
        return Int(self.width)
    }

    public func getNaturalHeight() -> Int {
        return Int(self.height)
    }

    public func scale(sx: CGFloat, sy: CGFloat) throws -> IImage {
        return try ImageUtils.scale(image: self, sx: sx, sy: sy)
    }

    public func getBitmap() -> CGImage? {
        if let bitmap = mBitmap {
            return bitmap
        } else {
            let context = CIContext()
            if let ciImage = ciImage, let bitmap = context.createCGImage(ciImage, from: ciImage.extent) {
                mBitmap = bitmap
                return bitmap
            } else {
                return nil
            }
        }
    }

    public func close() throws {
        // TODO(T94684939)
    }
}
