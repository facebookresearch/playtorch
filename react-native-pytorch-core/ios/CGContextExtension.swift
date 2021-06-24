/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

extension CGContext {
    func setStyle(state: CanvasState){
        self.setFillColor(state.fillStyle)
        self.setStrokeColor(state.strokeStyle)
        self.setLineWidth(state.lineWidth)
        self.setLineCap(state.lineCap)
        self.setLineJoin(state.lineJoin)
        self.setMiterLimit(state.miterLimit)
    }
}
