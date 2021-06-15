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
    var currentColor = UIColor.black.cgColor
    var savedState: UIImage?
    var renderer = UIGraphicsImageRenderer(size: CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))

    var stagedRects = [CGRect]()
    var stagedArcs = [Arc]()

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
        if let img = savedState {
            img.draw(in: rect)
        }

    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID" : ref[JSContext.ID_KEY]])
    }

    func arc(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, counterclockwise: Bool) {
        stagedArcs.append(Arc(x: x, y: y, radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: counterclockwise)) //seems counterintuitve, but is the only way to get it to match web canvas
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: UIScreen.main.bounds)
            }
            context.cgContext.addRect(rect)
            context.cgContext.strokePath()
        }
        invalidate(rect)
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: UIScreen.main.bounds)
            }
            context.cgContext.addRect(rect)
            context.cgContext.drawPath(using: .fillStroke)
        }
        invalidate(rect)
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        //create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        stagedRects.append(rect)
    }

    func invalidate() {
        DispatchQueue.main.async {
            self.setNeedsDisplay()
        }
    }

    func invalidate(_ rect: CGRect) {
        DispatchQueue.main.async {
            self.setNeedsDisplay(rect)
        }
    }

    func clear() {
        savedState = renderer.image { context in }
        invalidate()
    }

    func clearRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: UIScreen.main.bounds)
            }
            context.cgContext.setBlendMode(CGBlendMode.clear)
            context.cgContext.addRect(rect)
            context.cgContext.drawPath(using: .fillStroke)
        }
        invalidate(rect)
    }

    func stroke(){
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: UIScreen.main.bounds)
            }
            for arc in stagedArcs {
                context.cgContext.addArc(center: arc.center, radius: arc.radius, startAngle: arc.startAngle, endAngle: arc.endAngle, clockwise: arc.clockwise)
            }
            for rect in stagedRects {
                context.cgContext.addRect(rect)
            }
            context.cgContext.strokePath()
        }
        stagedArcs = [Arc]()
        stagedRects = [CGRect]()
        invalidate()
    }

    struct Arc {
        public var center: CGPoint
        public var radius: CGFloat
        public var startAngle: CGFloat
        public var endAngle: CGFloat
        public var clockwise: Bool

        init(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, clockwise: Bool) {
            self.center = CGPoint(x: x, y: y)
            self.radius = radius
            self.startAngle = startAngle
            self.endAngle = endAngle
            self.clockwise = clockwise
        }
    }
}
