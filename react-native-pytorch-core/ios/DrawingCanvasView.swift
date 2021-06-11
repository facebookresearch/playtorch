/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import UIKit

@objc(DrawingCanvasView)
class DrawingCanvasView: UIView {

    @objc public var onContext2D: RCTBubblingEventBlock?
    var ref: [String:String] = [:] //initialized to allow using self in init()

    var strokeRectangles = [CGRect]()
    var fillRectangles = [CGRect]()

    override public init(frame: CGRect) {
        super.init(frame: frame)
        ref = JSContext.wrapObject(view: self).getJSRef()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        ref = JSContext.wrapObject(view: self).getJSRef()
    }

    override func draw(_ rect: CGRect) {
        super.draw(rect)

        guard let context = UIGraphicsGetCurrentContext() else { return }

        context.addRects(strokeRectangles)
        context.strokePath()

        context.addRects(fillRectangles)
        context.drawPath(using: .fillStroke)

    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID" : ref[JSContext.ID_KEY]])
    }


    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        //create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        strokeRectangles.append(rect)

        //invalidates view so that it needs to be redrawn
        DispatchQueue.main.async {
            self.setNeedsDisplay(rect)
        }
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        //create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        fillRectangles.append(rect)

        //invalidates view so that it needs to be redrawn
        DispatchQueue.main.async {
            self.setNeedsDisplay(rect)
        }
    }

    func invalidate(){
        DispatchQueue.main.async {
            self.setNeedsDisplay()
        }
    }


}
