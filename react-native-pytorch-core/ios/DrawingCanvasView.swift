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
    var renderer = UIGraphicsImageRenderer(size: UIScreen.main.bounds.size)
    var canvasImage: UIImage?
    var stateStack = Stack()
    var path = CGMutablePath()
    var boundsRect = UIScreen.main.bounds
    var currentState = CanvasState()

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
        if let img = canvasImage {
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
        path.addArc(center: CGPoint(x:x, y: y), radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: counterclockwise, transform: currentState.transformation) // seems counterintuitve, but is the only way to get it to match web canvas
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.setStyle(state: currentState)
            context.cgContext.concatenate(currentState.transformation)
            context.cgContext.addRect(rect)
            context.cgContext.strokePath()
        }
        invalidate()
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.setStyle(state: currentState)
            context.cgContext.concatenate(currentState.transformation)
            context.cgContext.addRect(rect)
            context.cgContext.fillPath()
        }
        invalidate()
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        // create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        path.addRect(rect, transform: currentState.transformation)
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
        canvasImage = renderer.image { context in }
        invalidate()
    }

    func clearRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.concatenate(currentState.transformation)
            context.cgContext.setBlendMode(CGBlendMode.clear)
            context.cgContext.addRect(rect)
            context.cgContext.fillPath()
        }
        invalidate(rect)
    }

    func stroke(){
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.addPath(path)
            context.cgContext.setStyle(state: currentState)
            context.cgContext.strokePath()
        }
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
        invalidate()
    }

    func fill(){
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: UIScreen.main.bounds)
            }
            context.cgContext.addPath(path)
            context.cgContext.setStyle(state: currentState)
            context.cgContext.fillPath()
        }
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
        invalidate()
    }

    func scale(x: CGFloat, y: CGFloat) {
        currentState.transformation = currentState.transformation.scaledBy(x: x, y: y)
    }

    func rotate(angle: CGFloat) {
        currentState.transformation = currentState.transformation.rotated(by: angle)
    }

    func translate(x: CGFloat, y: CGFloat) {
        currentState.transformation = currentState.transformation.translatedBy(x: x, y: y)
    }

    func setTransform(a: CGFloat, b: CGFloat, c: CGFloat, d: CGFloat, e: CGFloat, f: CGFloat) {
        // Note that the Apple CGAffineTransform matrix is the transpose of the matrix used by PyTorch Live, but so is their labeling
        currentState.transformation = CGAffineTransform(a: a, b: b, c: c, d: d, tx: e, ty: f)
    }

    func setFillStyle(color: CGColor){
        currentState.fillStyle = color
    }

    func setStrokeStyle(color: CGColor){
        currentState.strokeStyle = color
    }

    func save() {
        stateStack.push(state: currentState)
    }

    func restore() {
        if let s = stateStack.pop() {
            currentState = s
        }
    }

    func setLineWidth(lineWidth: CGFloat){
        currentState.lineWidth = lineWidth
    }

    func setLineCap(lineCap: String){
        switch lineCap {
        case "butt":
            currentState.lineCap = CGLineCap.butt
        case "round":
            currentState.lineCap = CGLineCap.round
        case "square":
            currentState.lineCap = CGLineCap.square
        default:
            print("Invalid value, could not set line cap")
        }
    }

    func setLineJoin(lineJoin: String){
        switch lineJoin {
        case "miter":
            currentState.lineJoin = CGLineJoin.miter
        case "round":
            currentState.lineJoin = CGLineJoin.round
        case "bevel":
            currentState.lineJoin = CGLineJoin.bevel
        default:
            print("Invalid value, could not set line join")
        }
    }

    func setMiterLimit(miterLimit: CGFloat){
        currentState.miterLimit = miterLimit
    }

    @available(iOS 13.0, *)
    func setFont(font: NSDictionary) {
        if let fontFamilyArr = font["fontFamily"] as? NSArray, let fontFamily = fontFamilyArr[0] as? String {
            switch fontFamily {
            case "serif":
                if let descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.serif) {
                    currentState.font = UIFont(descriptor: descriptor, size: 0)
                }
            case "sans-serif":
                if let descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.rounded) {
                    currentState.font = UIFont(descriptor: descriptor, size: 0)
                }
            case "monospace":
                if let descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.monospaced) {
                    currentState.font = UIFont(descriptor: descriptor, size: 0)
                }
            default:
                print("Invalid font family")
            }
        }
        if let fontSizeString = font["fontSize"] as? NSString {
            let fontSize = CGFloat(fontSizeString.floatValue)
            currentState.font = currentState.font.withSize(fontSize)
        }
    }

    func beginPath(){
        path = CGMutablePath()
    }

    func closePath(){
        path.closeSubpath()
    }

    func lineTo(point: CGPoint){
        path.addLine(to: point, transform: currentState.transformation)
    }

    func moveTo(point: CGPoint){
        path.move(to: point, transform: currentState.transformation)
    }

    func drawCircle(x: CGFloat, y: CGFloat, radius: CGFloat, fill: Bool = false){
        let rect = CGRect(x: x-radius, y: y-radius, width: 2*radius, height: 2*radius)
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.setStyle(state: currentState)
            context.cgContext.concatenate(currentState.transformation)
            context.cgContext.addEllipse(in: rect)
            if(fill) {
                context.cgContext.fillPath()
            } else {
                context.cgContext.strokePath()
            }
        }
        invalidate()
    }

    func fillText(text: String, x: CGFloat, y: CGFloat){
        let textPath = CGMutablePath()
        textPath.addRect(boundsRect)
        let attrs = [NSAttributedString.Key.font: currentState.font, NSAttributedString.Key.foregroundColor: currentState.fillStyle] as [NSAttributedString.Key : Any]
        let attrString = NSAttributedString(string: text, attributes: attrs)
        let frameSetter = CTFramesetterCreateWithAttributedString(attrString as CFAttributedString)
        let frame = CTFramesetterCreateFrame(frameSetter, CFRangeMake(0, attrString.length), textPath, nil)
        canvasImage = renderer.image { context in
            if let img = canvasImage {
                img.draw(in: boundsRect)
            }
            context.cgContext.setStyle(state: currentState)
            context.cgContext.concatenate(currentState.transformation)
            context.cgContext.translateBy(x: x, y: boundsRect.size.height + y)
            context.cgContext.textMatrix = .identity
            context.cgContext.scaleBy(x: 1, y: -1)
            CTFrameDraw(frame, context.cgContext)
        }
        invalidate()
    }

    class Stack{
        var stateArray = [CanvasState]()

        func push(state: CanvasState) {
            stateArray.append(state)
        }

        func pop() -> CanvasState? {
            if stateArray.last != nil {
                return stateArray.removeLast()
            }
            else {
                return nil
            }
        }
    }
}

struct CanvasState {
    public var transformation: CGAffineTransform
    public var strokeStyle: CGColor
    public var fillStyle: CGColor
    public var lineWidth: CGFloat
    public var lineCap: CGLineCap
    public var lineJoin: CGLineJoin
    public var miterLimit: CGFloat
    public var font: UIFont

    init(transformation: CGAffineTransform = CGAffineTransform.identity, strokeStyle: CGColor = UIColor.black.cgColor, fillStyle: CGColor = UIColor.black.cgColor, lineWidth: CGFloat = 1, lineCap: CGLineCap = CGLineCap.butt, lineJoin: CGLineJoin = CGLineJoin.miter, miterLimit: CGFloat = 10, font: UIFont = .systemFont(ofSize: 10)) {
        self.transformation = transformation
        self.strokeStyle = strokeStyle
        self.fillStyle = fillStyle
        self.lineWidth = lineWidth
        self.lineCap = lineCap
        self.lineJoin = lineJoin
        self.miterLimit = miterLimit
        self.font = font
    }
}
