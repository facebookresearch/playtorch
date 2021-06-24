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
    @objc public var width: NSNumber?
    @objc public var height: NSNumber?
    var ref: [String:String] = [:] // initialized to allow using self in init()
    var currentColor = UIColor.black.cgColor
    var savedState: UIImage?
    var renderer = UIGraphicsImageRenderer(size: UIScreen.main.bounds.size)
    var path = CGMutablePath()
    var currentTransformation = CGAffineTransform.identity
    var boundsRect = UIScreen.main.bounds

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
            img.draw(in: boundsRect)
        }
    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID" : ref[JSContext.ID_KEY]])
        if let width = width as? Int, let height = height as? Int {
            boundsRect = CGRect(x: 0, y: 0, width: width, height: height)
            self.bounds = boundsRect
            renderer = UIGraphicsImageRenderer(size: boundsRect.size)
        } else {
            print("Could not set width and height of the canvas, using default of fullscreen")
            //TODO(T92857704) Eventually forward Error to React Native using promises
            boundsRect = UIScreen.main.bounds
            self.bounds = boundsRect
            renderer = UIGraphicsImageRenderer(size: boundsRect.size)
        }
    }

    func arc(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, counterclockwise: Bool) {
        path.addArc(center: CGPoint(x:x, y: y), radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: counterclockwise, transform: currentTransformation) // seems counterintuitve, but is the only way to get it to match web canvas
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: boundsRect)
            }
            context.cgContext.concatenate(currentTransformation)
            context.cgContext.addRect(rect)
            context.cgContext.strokePath()
        }
        invalidate(rect)
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: boundsRect)
            }
            context.cgContext.concatenate(currentTransformation)
            context.cgContext.addRect(rect)
            context.cgContext.drawPath(using: .fillStroke)
        }
        invalidate()
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        // create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        path.addRect(rect, transform: currentTransformation)
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
                img.draw(in: boundsRect)
            }
            context.cgContext.concatenate(currentTransformation)
            context.cgContext.setBlendMode(CGBlendMode.clear)
            context.cgContext.addRect(rect)
            context.cgContext.drawPath(using: .fillStroke)
        }
        invalidate(rect)
    }

    func stroke(){
        savedState = renderer.image { context in
            if let img = savedState {
                img.draw(in: boundsRect)
            }
            context.cgContext.addPath(path)
            context.cgContext.strokePath()
        }
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
        invalidate()
    }

    func scale(x: CGFloat, y: CGFloat) {
        currentTransformation = currentTransformation.scaledBy(x: x, y: y)
    }

    func rotate(angle: CGFloat) {
        currentTransformation = currentTransformation.rotated(by: angle)
    }

    func translate(x: CGFloat, y: CGFloat) {
        currentTransformation = currentTransformation.translatedBy(x: x, y: y)
    }

    func setTransform(a: CGFloat, b: CGFloat, c: CGFloat, d: CGFloat, e: CGFloat, f: CGFloat){
        // Note that the Apple CGAffineTransform matrix is the transpose of the matrix used by PyTorch Live, but so is their labeling
        currentTransformation = CGAffineTransform(a: a, b: b, c: c, d: d, tx: e, ty: f)
    }
}
