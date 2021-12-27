/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

class ImageData {

    let width: CGFloat
    let height: CGFloat
    let data: [UInt8]

    init(width: CGFloat, height: CGFloat, data: [UInt8]) {
        self.width = width
        self.height = height
        self.data = data
    }
}
