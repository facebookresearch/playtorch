/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

enum ImageError: Error {
    case scale
}

public class Image: IImage {

    private var image: IImage
    private var closed: Bool = false

    init(image: CGImage) {
        self.image = BitmapImage(image: image)
    }

    init(image: CIImage) {
        self.image = BitmapImage(image: image)
    }

    init(imageData: ImageData, pixelDensity: CGFloat) {
        self.image = ImageDataImage(imageData: imageData, pixelDensity: pixelDensity)
    }

    public func getPixelDensity() -> CGFloat {
        return self.image.getPixelDensity()
    }

    public func getWidth() -> CGFloat {
        return self.image.getWidth()
    }

    public func getHeight() -> CGFloat {
        return self.image.getHeight()
    }

    public func getNaturalWidth() -> Int {
        // Note: on Android, returns the width in device pixels so that it can be properly redrawn back to the canvas
        // Since iOS always uses points (density independent), this will return the same as getWidth so that it can
        // be properly redrawn back to the canvas
        return self.image.getNaturalWidth()
    }

    public func getNaturalHeight() -> Int {
        // Note: on Android, returns the height in device pixels so that it can be properly redrawn back to the canvas
        // Since iOS always uses points (density independent), this will return the same as getHeight so that it can
        // be properly redrawn back to the canvas
        return self.image.getNaturalHeight()
    }

    public func scale(sx: CGFloat, sy: CGFloat) throws -> IImage {
        return try self.image.scale(sx: sx, sy: sy)
    }

    public func getBitmap() -> CGImage? {
        return self.image.getBitmap()
    }

    public func close() throws {
        self.closed = true
    }

    public func isClosed() -> Bool {
        return self.closed
    }
}
