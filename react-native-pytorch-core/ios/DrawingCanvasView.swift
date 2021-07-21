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
    var scale: CGFloat?

    override public init(frame: CGRect) {
        super.init(frame: frame)
        self.scale = UIScreen.main.scale
        ref = JSContext.wrapObject(object: self).getJSRef()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.scale = UIScreen.main.scale
        ref = JSContext.wrapObject(object: self).getJSRef()
    }

    override func draw(_ layer: CALayer, in ctx: CGContext) {
        for sublayer in sublayers {
            layer.addSublayer(sublayer)
        }
        sublayers.removeAll()
        if #available(iOS 11.0, *) {
            flattenLayer()
        }
    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID" : ref[JSContext.ID_KEY]])
        if let width = width as? Int, let height = height as? Int {
            let boundsRect = CGRect(x: 0, y: 0, width: width, height: height)
            self.bounds = boundsRect
        } else {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            if let boundsRect = self.superview?.bounds {
                self.bounds = boundsRect
            } else {
                let boundsRect = UIScreen.main.bounds
                self.bounds = boundsRect
            }
        }
    }

    func arc(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, counterclockwise: Bool) {
        path.addArc(center: CGPoint(x:x, y: y), radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: counterclockwise, transform: currentState.transformation) // seems counterintuitve to set clockwise to counterclockwise, but is the only way to get it to match web canvas
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect, transform: currentState.transformation)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.fillColor = UIColor.clear.cgColor
        newLayer.path = p
        sublayers.append(newLayer)
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect, transform: currentState.transformation)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.lineWidth = 0
        newLayer.path = p
        sublayers.append(newLayer)
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
        let tempColor = currentState.fillStyle
        currentState.fillStyle = UIColor.white.cgColor
        fillRect(x:x, y: y, width: width, height: height)
        currentState.fillStyle = tempColor
    }

    func stroke() {
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.fillColor = UIColor.clear.cgColor
        newLayer.path = path
        newLayer.frame = newLayer.contentsRect
        sublayers.append(newLayer)
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CGAffineTransform.identity)
    }

    func fill() {
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.lineWidth = 0
        newLayer.path = path
        newLayer.frame = newLayer.contentsRect
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
        var descriptor: UIFontDescriptor? = nil

        if let fontFamilyArr = font["fontFamily"] as? NSArray, let fontFamily = fontFamilyArr[0] as? String {
            switch fontFamily {
            case "serif":
                descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.serif)
            case "sans-serif":
                descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.rounded)
            case "monospace":
                descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.monospaced)
            default:
                descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).withDesign(.rounded)
                print("Invalid font family... using default of sans-serif")
            }
        }

        if let fontStyle = font["fontStyle"] as? NSString {
            if (fontStyle == "italic") {
                descriptor = descriptor?.withSymbolicTraits(.traitItalic)
            }
        }

        if let fontWeight = font["fontWeight"] as? NSString {
            if (fontWeight == "bold") {
                descriptor = descriptor?.withSymbolicTraits(.traitBold)
            }
        }

        if let descriptor = descriptor {
            currentState.font = UIFont(descriptor: descriptor, size: 0)
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
        let p = CGMutablePath()
        p.addEllipse(in: rect, transform: currentState.transformation)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        if fill {
            newLayer.lineWidth = 0
        } else {
            newLayer.fillColor = UIColor.clear.cgColor
        }
        newLayer.path = p
        sublayers.append(newLayer)
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

        if currentState.font.fontDescriptor.symbolicTraits.contains(.traitBold) {
            let boldTrait = UIFontDescriptor.SymbolicTraits.traitBold
        }

        if currentState.font.fontDescriptor.symbolicTraits.contains(.traitItalic) {
            let italicTrait = UIFontDescriptor.SymbolicTraits.traitBold

        }

        let attrString = NSAttributedString(string: text, attributes: attrs)
        let newLayer = CATextLayer()
        newLayer.string = attrString
        newLayer.setAffineTransform(currentState.transformation)
        switch currentState.textAlign {
        case NSTextAlignment.left:
            newLayer.frame = CGRect(x: x, y: y - attrString.size().height, width: attrString.size().width, height: attrString.size().height)
        case NSTextAlignment.right:
            newLayer.frame = CGRect(x: x - attrString.size().width, y: y, width: attrString.size().width, height: attrString.size().height)
        case NSTextAlignment.center:
            newLayer.frame = CGRect(x: x - attrString.size().width/2.0, y: y, width: attrString.size().width, height: attrString.size().height)
        default:
            newLayer.frame = CGRect(x: x, y: y - attrString.size().height, width: attrString.size().width, height: attrString.size().height)
        }
        if let scale = scale {
            DispatchQueue.main.sync {
                newLayer.contentsScale = scale
            }
        } else {
            DispatchQueue.main.sync {
                newLayer.contentsScale = UIScreen.main.scale
            }
        }
        sublayers.append(newLayer)
    }

    func drawImage(image: BitmapImage, dx: CGFloat, dy: CGFloat) {
        let newLayer = CALayer()
        newLayer.contents = image.getBitmap()
        newLayer.frame = CGRect(x: dx, y: dy, width: CGFloat(image.getWidth()), height: CGFloat(image.getHeight()))
        sublayers.append(newLayer)
    }

    func drawImage(image: BitmapImage, dx: CGFloat, dy: CGFloat, dWidth: CGFloat, dHeight: CGFloat) {
        let newLayer = CALayer()
        newLayer.contents = image.getBitmap()
        newLayer.frame = CGRect(x: dx, y: dy, width: dWidth, height: dHeight)
        sublayers.append(newLayer)
    }

    func drawImage(image: BitmapImage, sx: CGFloat, sy: CGFloat, sWidth: CGFloat, sHeight: CGFloat, dx: CGFloat, dy: CGFloat, dWidth: CGFloat, dHeight: CGFloat) {
        let newLayer = CALayer()
        if let croppedImage = image.getBitmap().cropping(to: CGRect(x: sx, y: sy, width: sWidth, height: sHeight)) {
            if(dWidth != -1 && dHeight != -1) {
                newLayer.contents = croppedImage
                newLayer.frame = CGRect(x: dx, y: dy, width: dWidth, height: dHeight)
            } else {
                newLayer.contents = image.getBitmap()
                newLayer.frame = CGRect(x: dx, y: dy, width: CGFloat(image.getWidth()), height: CGFloat(image.getHeight()))
            }
        }
        sublayers.append(newLayer)
    }

    @available(iOS 11.0, *)
    func flattenLayer() {
        //see https://medium.com/@almalehdev/high-performance-drawing-on-ios-part-2-2cb2bc957f6
        let currentLayer = self.layer.presentation()
        if let flattenedLayer = try? NSKeyedUnarchiver.unarchiveTopLevelObjectWithData(
            NSKeyedArchiver.archivedData(withRootObject: currentLayer, requiringSecureCoding: false))
            as? CAShapeLayer {
                self.layer.sublayers = nil
                self.layer.sublayers?.append(flattenedLayer)
        }
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
