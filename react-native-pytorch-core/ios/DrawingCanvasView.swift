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
    var needsDraw: Bool = false
    var shapeLayers = [CAShapeLayer] ()
    var drawingLayer = CATransformLayer()
    let deletionQueue = DispatchQueue(label: "deletionQueue", qos: .userInitiated, attributes: .concurrent)

    override public init(frame: CGRect) {
        super.init(frame: frame)
        self.scale = UIScreen.main.scale
        drawingLayer.bounds = layer.bounds
        ref = JSContext.wrapObject(object: self).getJSRef()
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.scale = UIScreen.main.scale
        drawingLayer.bounds = layer.bounds
        ref = JSContext.wrapObject(object: self).getJSRef()
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    override func draw(_ layer: CALayer, in ctx: CGContext) {
        for sublayer in sublayers {
            drawingLayer.addSublayer(sublayer)
        }
        sublayers.removeAll()
        layer.sublayers?.removeAll()
        self.layer.addSublayer(drawingLayer)
        if #available(iOS 11.0, *), ((self.layer.sublayers?.count ?? 0) > 100) {
            flattenLayer()
        }
        needsDraw = false
        deletionQueue.async {
            CATransaction.flush()
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
        path.addArc(center: CGPoint(x:x, y: y), radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: counterclockwise) // seems counterintuitve to set clockwise to counterclockwise, but is the only way to get it to match web canvas
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.fillColor = UIColor.clear.cgColor
        newLayer.path = p
        newLayer.transform = currentState.transform
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        newLayer.lineWidth = 0
        newLayer.path = p
        newLayer.transform = currentState.transform
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        // create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        path.addRect(rect)
    }

    func invalidate() {
        // The invalidate has been called previously and the canvas hasn't redrawn yet -- no need to call needs display again.
        if (needsDraw) {
            return
        }
        needsDraw = true
        DispatchQueue.main.async {
            self.layer.setNeedsDisplay()
            self.deletionQueue.async {
                CATransaction.flush()
            }
        }
    }

    func clear() {
        drawingLayer.sublayers?.removeAll()
        DispatchQueue.main.async {
            self.layer.sublayers?.removeAll()
            self.deletionQueue.async {
                CATransaction.flush()
            }
        }
        sublayers.removeAll()
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func clearRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) { // doesn't work yet
        let tempColor = currentState.fillStyle
        currentState.fillStyle = UIColor.white.cgColor
        fillRect(x:x, y: y, width: width, height: height)
        currentState.fillStyle = tempColor
    }

    func stroke() {
        if !path.isEmpty {
            onTransformationChange()
        }
        let newLayer = CATransformLayer()
        newLayer.isDoubleSided = true
        var newShapeLayers = [CAShapeLayer]()
        for sublayer in shapeLayers {
            sublayer.setStyle(state: currentState)
            sublayer.fillColor = UIColor.clear.cgColor
            sublayer.frame = sublayer.contentsRect
            newLayer.addSublayer(sublayer)
            newShapeLayers.append(copyShapeLayer(layer: sublayer))
            deletionQueue.async {
                CATransaction.flush()
            }
        }
        shapeLayers.removeAll()
        shapeLayers = newShapeLayers
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func fill() {
        if !path.isEmpty {
            onTransformationChange()
        }
        let newLayer = CATransformLayer()
        newLayer.isDoubleSided = true
        var newShapeLayers = [CAShapeLayer] ()
        for sublayer in shapeLayers {
            sublayer.setStyle(state: currentState)
            sublayer.lineWidth = 0
            sublayer.frame = sublayer.contentsRect
            newLayer.addSublayer(sublayer)
            newShapeLayers.append(copyShapeLayer(layer: sublayer))
            deletionQueue.async {
                CATransaction.flush()
            }
        }
        shapeLayers.removeAll()
        shapeLayers = newShapeLayers
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func copyShapeLayer(layer: CAShapeLayer) -> CAShapeLayer {
        let newLayer = CAShapeLayer()
        newLayer.transform = layer.transform
        newLayer.path = layer.path
        deletionQueue.async {
            CATransaction.flush()
        }
        return newLayer
    }

    func scale(x: CGFloat, y: CGFloat) {
        if !path.isEmpty {
            onTransformationChange()
        }
        currentState.transform = CATransform3DScale(currentState.transform, x, y, 1.0)
    }

    func rotate(angle: CGFloat) {
        if !path.isEmpty {
            onTransformationChange()
        }
        // If the vector has zero length, the behavior is undefined: t = rotation(angle, x, y, z) * t.
        currentState.transform = CATransform3DRotate(currentState.transform, angle, 0.0, 0.0, 1.0)
    }

    func translate(x: CGFloat, y: CGFloat) {
        if !path.isEmpty {
            onTransformationChange()
        }
        currentState.transform = CATransform3DTranslate(currentState.transform, x, y, 0.0)
    }

    func setTransform(a: CGFloat, b: CGFloat, c: CGFloat, d: CGFloat, e: CGFloat, f: CGFloat) {
        if !path.isEmpty {
            onTransformationChange()
        }
        currentState.transform = CATransform3DMakeAffineTransform(CGAffineTransform(a: a, b: b, c: c, d: d, tx: e, ty: f))
        // Note that the Apple CGAffineTransform matrix is the transpose of the matrix used by PyTorch Live, but so is their labeling
    }

    func setFillStyle(color: CGColor){
        currentState.fillStyle = color
    }

    func setStrokeStyle(color: CGColor){
        currentState.strokeStyle = color
    }

    func save() {
        stateStack.push(state: currentState)
        currentState = CanvasState(state: currentState)
    }

    func restore() {
        if let s = stateStack.pop() {
            currentState = s
        }
    }

    func setLineWidth(lineWidth: CGFloat) {
        currentState.lineWidth = lineWidth
    }

    func setLineCap(lineCap: String) {
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

    func setLineJoin(lineJoin: String) {
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

    func setMiterLimit(miterLimit: CGFloat) {
        currentState.miterLimit = miterLimit
    }

    @available(iOS 13.0, *)
    func setFont(font: NSDictionary) {
        var fontName = ""
        var serif = false

        if let fontFamilyArr = font["fontFamily"] as? NSArray, let fontFamily = fontFamilyArr[0] as? String {
            switch fontFamily {
            case "serif":
                fontName = "TimesNewRomanPS-"
                serif = true
            case "sans-serif":
                fontName = "HelveticaNeue-"
            case "monospace":
                fontName = "Menlo-"
            default:
                fontName = "Helvetica-"
                print("Invalid font family... using default of sans-serif")
            }
        }

        if let fontWeight = font["fontWeight"] as? NSString {
            if (fontWeight == "bold") {
                fontName += "Bold"
            }
        }

        if let fontStyle = font["fontStyle"] as? NSString {
            if (fontStyle == "italic") {
                fontName += "Italic"
            }
        }

        if fontName.last == "-" {
            fontName.removeLast()
        }

        if serif {
            fontName += "MT"
        }

        currentState.font = UIFont(name: fontName, size: 10.0) ?? .systemFont(ofSize: 10)

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
        shapeLayers = [CAShapeLayer] ()
    }

    func closePath(){
        path.closeSubpath()
    }

    func lineTo(point: CGPoint){
        path.addLine(to: point)
    }

    func moveTo(point: CGPoint){
        path.move(to: point)
    }

    func drawCircle(x: CGFloat, y: CGFloat, radius: CGFloat, fill: Bool = false) {
        let rect = CGRect(x: x-radius, y: y-radius, width: 2*radius, height: 2*radius)
        let p = CGMutablePath()
        p.addEllipse(in: rect)
        let newLayer = CAShapeLayer()
        newLayer.setStyle(state: currentState)
        if fill {
            newLayer.lineWidth = 0
        } else {
            newLayer.fillColor = UIColor.clear.cgColor
        }
        newLayer.path = p
        newLayer.transform = currentState.transform
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
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
        let newLayer = CATextLayer()
        newLayer.string = attrString
        newLayer.transform = currentState.transform
        let textWidth = attrString.size().width + currentState.lineWidth
        let textHeight = attrString.size().height
        var offsetX = CGFloat(0) //default value for textAlign left (so not needed in switch case)
        let offsetY = -1 * textHeight
        switch currentState.textAlign {
        case NSTextAlignment.right:
            offsetX = -1 * textWidth
        case NSTextAlignment.center:
            offsetX = -1 * textWidth/2.0
        default:
            offsetX = 0 //this is a duplicate of what is already stored in offsetX, but switch case must be exhaustive and each case must have at least one executable statement?
        }
        newLayer.frame = CGRect(x: x + offsetX, y: y + offsetY, width: textWidth, height: textHeight)
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
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func drawImage(image: BitmapImage, dx: CGFloat, dy: CGFloat) {
        let newLayer = CALayer()
        newLayer.contents = image.getBitmap()
        newLayer.transform = currentState.transform
        newLayer.frame = CGRect(x: dx, y: dy, width: CGFloat(image.getWidth()), height: CGFloat(image.getHeight()))
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func drawImage(image: BitmapImage, dx: CGFloat, dy: CGFloat, dWidth: CGFloat, dHeight: CGFloat) {
        let newLayer = CALayer()
        newLayer.contents = image.getBitmap()
        newLayer.transform = currentState.transform
        newLayer.frame = CGRect(x: dx, y: dy, width: dWidth, height: dHeight)
        sublayers.append(newLayer)
        deletionQueue.async {
            CATransaction.flush()
        }
    }

    func drawImage(image: BitmapImage, sx: CGFloat, sy: CGFloat, sWidth: CGFloat, sHeight: CGFloat, dx: CGFloat, dy: CGFloat, dWidth: CGFloat, dHeight: CGFloat) {
        let newLayer = CALayer()
        newLayer.transform = currentState.transform
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
        deletionQueue.async {
            CATransaction.flush()
        }
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

    func onTransformationChange() {
        let newLayer = CAShapeLayer()
        newLayer.isDoubleSided = true
        newLayer.path = path
        newLayer.transform = currentState.transform
        shapeLayers.append(newLayer)
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CATransform3DGetAffineTransform(currentState.transform))
        deletionQueue.async {
            CATransaction.flush()
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
    public var transform: CATransform3D
    public var strokeStyle: CGColor
    public var fillStyle: CGColor
    public var lineWidth: CGFloat
    public var lineCap: CAShapeLayerLineCap
    public var lineJoin: CAShapeLayerLineJoin
    public var miterLimit: CGFloat
    public var font: UIFont
    public var textAlign: NSTextAlignment

    init(transform: CATransform3D = CATransform3DIdentity, strokeStyle: CGColor = UIColor.black.cgColor, fillStyle: CGColor = UIColor.black.cgColor, lineWidth: CGFloat = 1, lineCap: CAShapeLayerLineCap = .butt, lineJoin: CAShapeLayerLineJoin = .miter, miterLimit: CGFloat = 10, font: UIFont = .systemFont(ofSize: 10), textAlign: NSTextAlignment = NSTextAlignment.left) {
        self.transform = transform
        self.strokeStyle = strokeStyle
        self.fillStyle = fillStyle
        self.lineWidth = lineWidth
        self.lineCap = lineCap
        self.lineJoin = lineJoin
        self.miterLimit = miterLimit
        self.font = font
        self.textAlign = textAlign
    }

    init(state: CanvasState) {
        self.transform = CATransform3DConcat(state.transform, CATransform3DIdentity)
        self.strokeStyle = state.strokeStyle.copy()!
        self.fillStyle = state.fillStyle.copy()!
        self.lineWidth = CGFloat(state.lineWidth)
        self.lineCap = CAShapeLayerLineCap(rawValue: state.lineCap.rawValue)
        self.lineJoin =  CAShapeLayerLineJoin(rawValue: state.lineJoin.rawValue)
        self.miterLimit = CGFloat(state.miterLimit)
        self.font = state.font.copy() as! UIFont
        self.textAlign = state.textAlign
    }
}
