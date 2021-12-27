/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(CanvasManager)
class CanvasManager: RCTViewManager {

    override func view() -> UIView! {
        let canvas = DrawingCanvasView()
        canvas.backgroundColor = .white
        return canvas
    }

    override static func requiresMainQueueSetup() -> Bool {
       return true
     }
}
