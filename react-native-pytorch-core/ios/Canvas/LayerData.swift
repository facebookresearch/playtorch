/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

enum LayerType {
    case textLayer
    case shapeLayer
    case imageLayer
}

class LayerData {
    let type: LayerType
    let transform: CATransform3D

    init(layerType: LayerType, transform: CATransform3D) {
        self.type = layerType
        self.transform = transform
    }

}

class TextLayerData: LayerData {
    let text: NSAttributedString
    let frame: CGRect

    init(text: NSAttributedString, transform: CATransform3D, frame: CGRect) {
        self.text = text
        self.frame = frame
        super.init(layerType: LayerType.textLayer, transform: transform)
    }
}

class ShapeLayerData: LayerData {
    let path: CGPath
    let state: CanvasState

    init(path: CGPath, state: CanvasState) {
        self.path = path
        self.state = state
        super.init(layerType: LayerType.shapeLayer, transform: state.transform)
    }
}

class ImageLayerData: LayerData {
    let image: CGImage
    let frame: CGRect

    init(image: CGImage, transform: CATransform3D, frame: CGRect) {
        self.image = image
        self.frame = frame
        super.init(layerType: LayerType.imageLayer, transform: transform)
    }
}
