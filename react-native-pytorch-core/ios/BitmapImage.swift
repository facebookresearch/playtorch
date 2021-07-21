/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class BitmapImage {
    private var mBitmap: CGImage
    public var ref: [String:String] = [:]
    private var width: CGFloat;
    private var height: CGFloat;

    init(image: CGImage) {
        self.mBitmap = image
        self.width = CGFloat(truncating: mBitmap.width as NSNumber)
        self.height = CGFloat(truncating: mBitmap.height as NSNumber)
        ref = JSContext.wrapObject(object: self).getJSRef()
    }

    func getNaturalWidth() -> Int {
        return mBitmap.width
    }

    func getNaturalHeight() -> Int {
        return mBitmap.height
    }

    func getWidth() -> CGFloat {
        return self.width
    }

    func getHeight() -> CGFloat {
        return self.height
    }

    func getBitmap() -> CGImage {
        return mBitmap
    }

    func close() throws {
        // TODO(T94684939)
    }

    func scale(sx: CGFloat, sy: CGFloat) -> BitmapImage {
        let scaledImage = BitmapImage(image: self.getBitmap())
        scaledImage.width = sx * self.width
        scaledImage.height = sy * self.height
        return scaledImage
    }
}
