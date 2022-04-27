/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public protocol IImage {
    func getPixelDensity() -> CGFloat
    func getWidth() -> CGFloat
    func getHeight() -> CGFloat
    func getNaturalWidth() -> Int
    func getNaturalHeight() -> Int
    func scale(sx: CGFloat, sy: CGFloat) throws -> IImage
    func getBitmap() -> CGImage?
    func close() throws
}
