/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

extension CAShapeLayer {

    func setStyle(state: CanvasState) {
        self.fillColor = state.fillStyle
        self.strokeColor = state.strokeStyle
        self.lineWidth = state.lineWidth
        self.lineCap = state.lineCap
        self.lineJoin = state.lineJoin
        self.miterLimit = state.miterLimit
    }
}
