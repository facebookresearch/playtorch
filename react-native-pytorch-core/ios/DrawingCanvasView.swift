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
    var stateStack = Stack()
    var path = CGMutablePath()
    var currentState = CanvasState()
    var sublayers = [CALayer]()

    override public init(frame: CGRect) {
        super.init(frame: frame)
        ref = JSContext.wrapObject(view: self).getJSRef()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        ref = JSContext.wrapObject(view: self).getJSRef()
    }

    override func draw(_ layer: CALayer, in ctx: CGContext) {
        for sublayer in sublayers {
            layer.addSublayer(sublayer)
        }
        sublayers.removeAll()
    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID" : ref[JSContext.ID_KEY]])
        if let width = width as? Int, let height = height as? Int {
            let boundsRect = CGRect(x: 0, y: 0, width: width, height: height)
            self.bounds = boundsRect
        } else {
            print("Could not set width and height of the canvas, using default of fullscreen")
            //TODO(T92857704) Eventually forward Error to React Native using promises
            let boundsRect = UIScreen.main.bounds
            self.bounds = boundsRect
        }
    }

    func arc(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, counterclockwise: Bool) {
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        // create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        path.addRect(rect, transform: currentState.transformation)
    }

    func invalidate() {
        DispatchQueue.main.sync {
            self.layer.setNeedsDisplay()
            if let sublayers = self.layer.sublayers {
                for i in sublayers.indices {
                    self.layer.sublayers?[i].setNeedsDisplay()
                    print("redrawing sublayer")
                }
            }
        }
    }

    func clear() {
        DispatchQueue.main.async {
            self.layer.sublayers = nil
        }
    }

    func clearRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) { // doesn't work yet
    }

    func stroke() {
        var newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.fillColor = UIColor.clear.cgColor
        newLayer.path = path
        sublayers.append(newLayer)
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
    }

    func fill() {
        var newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.lineWidth = 0
        newLayer.path = path
        sublayers.append(newLayer)
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
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
            currentState.lineCap = CAShapeLayerLineCap.butt
        case "round":
            currentState.lineCap = CAShapeLayerLineCap.round
        case "square":
            currentState.lineCap = CAShapeLayerLineCap.square
        default:
            print("Invalid value, could not set line cap")
        }
    }

    func setLineJoin(lineJoin: String){
        switch lineJoin {
        case "miter":
            currentState.lineJoin = CAShapeLayerLineJoin.miter
        case "round":
            currentState.lineJoin = CAShapeLayerLineJoin.round
        case "bevel":
            currentState.lineJoin = CAShapeLayerLineJoin.bevel
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

    func setTextAlign(textAlign: String) {
        switch textAlign {
        case "left":
            currentState.textAlign = NSTextAlignment.left
        case "right":
            currentState.textAlign = NSTextAlignment.right
        case "center":
            currentState.textAlign = NSTextAlignment.center
        default:
            currentState.textAlign = NSTextAlignment.left
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

    func drawCircle(x: CGFloat, y: CGFloat, radius: CGFloat, fill: Bool = false) {
        let rect = CGRect(x: x-radius, y: y-radius, width: 2*radius, height: 2*radius)
    }

    func fillText(text: String, x: CGFloat, y: CGFloat, fill: Bool = true) {
        var attrs = [NSAttributedString.Key.font: currentState.font] as [NSAttributedString.Key : Any]
        if(fill) {
            attrs[ NSAttributedString.Key.foregroundColor ] = currentState.fillStyle
        } else {
            attrs[ NSAttributedString.Key.foregroundColor ] = UIColor.clear
            attrs[ NSAttributedString.Key.strokeColor ] = currentState.strokeStyle
            attrs[ NSAttributedString.Key.strokeWidth ] = currentState.lineWidth
        }
        let attrString = NSAttributedString(string: text, attributes: attrs)
    }

    class Stack {
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
    public var lineCap: CAShapeLayerLineCap
    public var lineJoin: CAShapeLayerLineJoin
    public var miterLimit: CGFloat
    public var font: UIFont
    public var textAlign: NSTextAlignment

    init(transformation: CGAffineTransform = CGAffineTransform.identity, strokeStyle: CGColor = UIColor.black.cgColor, fillStyle: CGColor = UIColor.black.cgColor, lineWidth: CGFloat = 1, lineCap: CAShapeLayerLineCap = .butt, lineJoin: CAShapeLayerLineJoin = .miter, miterLimit: CGFloat = 10, font: UIFont = .systemFont(ofSize: 10), textAlign: NSTextAlignment = NSTextAlignment.left) {
        self.transformation = transformation
        self.strokeStyle = strokeStyle
        self.fillStyle = fillStyle
        self.lineWidth = lineWidth
        self.lineCap = lineCap
        self.lineJoin = lineJoin
        self.miterLimit = miterLimit
        self.font = font
        self.textAlign = textAlign
    }
}
