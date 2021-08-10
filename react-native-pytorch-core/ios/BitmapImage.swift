/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class BitmapImage {
    private var mBitmap: CGImage?
    private var ciImage: CIImage?
    private var width: CGFloat;
    private var height: CGFloat;

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

    func getNaturalWidth() -> Int {
        //Note: on Android, returns the width in device pixels so that it can be properly redrawn back to the canvas
        //Since iOS always uses points (density independent), this will return the same as getWidth so that it can be properly redrawn back to the canvas
        return Int(width)
    }

    func getNaturalHeight() -> Int {
        //Note: on Android, returns the height in device pixels so that it can be properly redrawn back to the canvas
        //Since iOS always uses points (density independent), this will return the same as getHeight so that it can be properly redrawn back to the canvas
        return Int(height)
    }

    func getWidth() -> CGFloat {
        return self.width
    }

    func getHeight() -> CGFloat {
        return self.height
    }

    func getBitmap() -> CGImage? {
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

    func close() throws {
        // TODO(T94684939)
    }

    func scale(sx: CGFloat, sy: CGFloat) -> BitmapImage? {
        if let bitmap = self.getBitmap() {
            let scaledImage = BitmapImage(image: bitmap)
            scaledImage.width = sx * self.width
            scaledImage.height = sy * self.height
            return scaledImage
        } else {
            return nil
            //TODO(T92857704) Eventually forward Error to React Native using promises
        }
    }
}
