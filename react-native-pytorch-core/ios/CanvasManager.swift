/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(CanvasManager)
class CanvasManager: RCTViewManager {

    var canvas = DrawingCanvasView()

    override func view() -> UIView! {
        canvas.backgroundColor = .white
        return canvas
    }

    override static func requiresMainQueueSetup() -> Bool {
       return true
     }
}
