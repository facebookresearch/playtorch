/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import UIKit

@objc(DrawingCanvasView)
class DrawingCanvasView: UIView {

    enum CanvasError: Error {
        case invalidLineJoinValue
        case invalidLineCapValue
        case invalidFontFamily
        case unableToCreateBitmap
    }

    @objc public var onContext2D: RCTBubblingEventBlock?
    var ref: [String: String] = [:] // initialized to allow using self in init()
    var stateStack = Stack()
    var path = CGMutablePath()
    var currentState = CanvasState()
    var sublayers = [LayerData]()
    let scaleText = UIScreen.main.scale
    var shapeLayers = [ShapeLayerData]()

    override public init(frame: CGRect) {
        super.init(frame: frame)
        self.clipsToBounds = true
        self.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        ref = JSContext.wrapObject(object: self).getJSRef()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.clipsToBounds = true
        self.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        ref = JSContext.wrapObject(object: self).getJSRef()
    }

    override class var layerClass: AnyClass {
        return CATransformLayer.self
    }

    override func didSetProps(_ changedProps: [String]!) {
        guard let unwrappedOnContext2D = onContext2D else { return }
        unwrappedOnContext2D(["ID": ref[JSContext.idKey] as Any])
    }

    func arc(x: CGFloat, y: CGFloat, radius: CGFloat, startAngle: CGFloat, endAngle: CGFloat, counterclockwise: Bool) {
        // seems counterintuitve to set clockwise to counterclockwise, but is the only way to get it to match web canvas
        path.addArc(center: CGPoint(x: x, y: y),
                    radius: radius,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    clockwise: counterclockwise)
    }

    func strokeRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect)
        var state = CanvasState(state: currentState)
        state.fillStyle = UIColor.clear.cgColor
        let newLayer = ShapeLayerData(path: p, state: state)
        sublayers.append(newLayer)
    }

    func fillRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        let rect = CGRect(x: x, y: y, width: width, height: height)
        let p = CGMutablePath()
        p.addRect(rect)
        var state = CanvasState(state: currentState)
        state.lineWidth = 0
        let newLayer = ShapeLayerData(path: p, state: state)
        sublayers.append(newLayer)
    }

    func rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
        // create CGRect and add it to list
        let rect = CGRect(x: x, y: y, width: width, height: height)
        path.addRect(rect)
    }

    private func renderLayers(allLayerData: [LayerData], layer: CALayer) {
        for layerData in allLayerData {
            let baseLayer = CALayer()
            baseLayer.transform = layerData.transform
            switch layerData.type {
            case .shapeLayer:
                guard let data = layerData as? ShapeLayerData else {
                    continue
                }
                let newLayer = CAShapeLayer()
                newLayer.setStyle(state: data.state)
                baseLayer.transform = data.state.transform
                newLayer.path = data.path
                baseLayer.addSublayer(newLayer)
            case .textLayer:
                guard let data = layerData as? TextLayerData else {
                    continue
                }
                let newLayer = CATextLayer()
                newLayer.frame = data.frame
                newLayer.string = data.text
                newLayer.contentsScale = self.scaleText
                baseLayer.addSublayer(newLayer)
            case .imageLayer:
                guard let data = layerData as? ImageLayerData else {
                    continue
                }
                let newLayer = CALayer()
                newLayer.contents = data.image
                newLayer.frame = data.frame
                baseLayer.addSublayer(newLayer)
            }
            layer.addSublayer(baseLayer)
        }
    }

    func invalidate() {
        // Swift has value semantics, which means the following will create a new array
        // for the sublayers that can be used in the main loop even though the original
        // array is cleared.
        // https://developer.apple.com/swift/blog/?id=10
        let sublayers = self.sublayers
        self.sublayers.removeAll()

        RunLoop.main.perform {
            self.layer.sublayers?.removeAll()
            self.renderLayers(allLayerData: sublayers, layer: self.layer)
            self.layer.needsDisplay()
        }
    }

    func clear() {
        sublayers.removeAll()
    }

    func clearRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) { // doesn't work yet
        let tempColor = currentState.fillStyle
        currentState.fillStyle = UIColor.white.cgColor
        fillRect(x: x, y: y, width: width, height: height)
        currentState.fillStyle = tempColor
    }

    func stroke() {
        if !path.isEmpty {
            onTransformationChange()
        }
        var state = CanvasState(state: currentState)
        state.fillStyle = UIColor.clear.cgColor
        for sld in shapeLayers {
            let newLayer  = ShapeLayerData(path: sld.path, state: state)
            sublayers.append(newLayer)
        }
    }

    func fill() {
        if !path.isEmpty {
            onTransformationChange()
        }
        var state = CanvasState(state: currentState)
        state.lineWidth = 0
        for sld in shapeLayers {
            let newLayer = ShapeLayerData(path: sld.path, state: state)
            sublayers.append(newLayer)
        }
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
        // Note that the Apple CGAffineTransform matrix is the transpose of the
        // matrix used by PyTorch Live, but so is their labeling
        currentState.transform = CATransform3DMakeAffineTransform(CGAffineTransform(a: a,
                                                                                    b: b,
                                                                                    c: c,
                                                                                    d: d,
                                                                                    tx: e,
                                                                                    ty: f))
    }

    func setFillStyle(color: CGColor) {
        currentState.fillStyle = color
    }

    func setStrokeStyle(color: CGColor) {
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

    func setLineCap(lineCap: String) throws {
        switch lineCap {
        case "butt":
            currentState.lineCap = CAShapeLayerLineCap.butt
        case "round":
            currentState.lineCap = CAShapeLayerLineCap.round
        case "square":
            currentState.lineCap = CAShapeLayerLineCap.square
        default:
            throw CanvasError.invalidLineCapValue
        }
    }

    func setLineJoin(lineJoin: String) throws {
        switch lineJoin {
        case "miter":
            currentState.lineJoin = CAShapeLayerLineJoin.miter
        case "round":
            currentState.lineJoin = CAShapeLayerLineJoin.round
        case "bevel":
            currentState.lineJoin = CAShapeLayerLineJoin.bevel
        default:
            throw CanvasError.invalidLineJoinValue
        }
    }

    func setMiterLimit(miterLimit: CGFloat) {
        currentState.miterLimit = miterLimit
    }

    // swiftlint:disable cyclomatic_complexity
    func setFont(font: NSDictionary) throws {
        if let fr = currentState.fontRepresentation, fr.isEqual(font) {
            return
        } else {
            currentState.fontRepresentation = font
        }

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
                throw CanvasError.invalidFontFamily
            }
        }

        if let fontWeight = font["fontWeight"] as? NSString {
            if fontWeight == "bold" {
                fontName += "Bold"
            }
        }

        if let fontStyle = font["fontStyle"] as? NSString {
            if fontStyle == "italic" {
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

    func beginPath() {
        path = CGMutablePath()
        shapeLayers.removeAll()
    }

    func closePath() {
        path.closeSubpath()
    }

    func lineTo(point: CGPoint) {
        path.addLine(to: point)
    }

    func moveTo(point: CGPoint) {
        path.move(to: point)
    }

    func drawCircle(x: CGFloat, y: CGFloat, radius: CGFloat, fill: Bool = false) {
        let rect = CGRect(x: x-radius, y: y-radius, width: 2*radius, height: 2*radius)
        let p = CGMutablePath()
        p.addEllipse(in: rect)
        var state = CanvasState(state: currentState)
        if fill {
            state.lineWidth = 0
        } else {
            state.fillStyle = UIColor.clear.cgColor
        }
        let newLayer = ShapeLayerData(path: p, state: state)
        sublayers.append(newLayer)
    }

    func fillText(text: String, x: CGFloat, y: CGFloat, fill: Bool = true) {
        var attrs = [NSAttributedString.Key.font: currentState.font] as [NSAttributedString.Key: Any]
        if fill {
            attrs[ NSAttributedString.Key.foregroundColor ] = currentState.fillStyle
        } else {
            attrs[ NSAttributedString.Key.foregroundColor ] = UIColor.clear
            attrs[ NSAttributedString.Key.strokeColor ] = currentState.strokeStyle
            attrs[ NSAttributedString.Key.strokeWidth ] = currentState.lineWidth
        }
        let attrString = NSAttributedString(string: text, attributes: attrs)
        let textWidth = attrString.size().width + currentState.lineWidth
        let textHeight = attrString.size().height
        var offsetX = CGFloat(0) // default value for textAlign left (so not needed in switch case)
        let offsetY = -1 * textHeight
        switch currentState.textAlign {
        case NSTextAlignment.right:
            offsetX = -1 * textWidth
        case NSTextAlignment.center:
            offsetX = -1 * textWidth/2.0
        default:
            break
        }
        let frame = CGRect(x: x + offsetX, y: y + offsetY, width: textWidth, height: textHeight)
        let newLayer = TextLayerData(text: attrString, transform: currentState.transform, frame: frame)
        sublayers.append(newLayer)
    }

    func drawImage(image: IImage, dx: CGFloat, dy: CGFloat) throws {
        let frame = CGRect(x: dx, y: dy, width: CGFloat(image.getWidth()), height: CGFloat(image.getHeight()))
        if let bitmap = image.getBitmap() {
            let newLayer = ImageLayerData(image: bitmap, transform: currentState.transform, frame: frame)
            sublayers.append(newLayer)
        } else {
            throw CanvasError.unableToCreateBitmap
        }
    }

    func drawImage(image: IImage, dx: CGFloat, dy: CGFloat, dWidth: CGFloat, dHeight: CGFloat) throws {
        let frame = CGRect(x: dx, y: dy, width: dWidth, height: dHeight)
        if let bitmap = image.getBitmap() {
            let newLayer = ImageLayerData(image: bitmap, transform: currentState.transform, frame: frame)
            sublayers.append(newLayer)
        } else {
            throw CanvasError.unableToCreateBitmap
        }
    }

    func drawImage(image: IImage,
                   sx: CGFloat,
                   sy: CGFloat,
                   sWidth: CGFloat,
                   sHeight: CGFloat,
                   dx: CGFloat,
                   dy: CGFloat,
                   dWidth: CGFloat,
                   dHeight: CGFloat) throws {
        var contentsImage: CGImage?
        if let croppedImage = image.getBitmap()?.cropping(to: CGRect(x: sx, y: sy, width: sWidth, height: sHeight)) {
            contentsImage = croppedImage
        } else {
            contentsImage = image.getBitmap()
        }
        var frame: CGRect
        if dWidth != -1 && dHeight != -1 {
            frame = CGRect(x: dx, y: dy, width: dWidth, height: dHeight)
        } else {
            frame = CGRect(x: dx, y: dy, width: CGFloat(image.getWidth()), height: CGFloat(image.getHeight()))
        }
        if let bitmap = contentsImage {
            let newLayer = ImageLayerData(image: bitmap, transform: currentState.transform, frame: frame)
            sublayers.append(newLayer)
        } else {
            throw CanvasError.unableToCreateBitmap
        }
    }

    func getImageData(sx: CGFloat,
                      sy: CGFloat,
                      sw: CGFloat,
                      sh: CGFloat,
                      completionHandler: (ImageData?) -> Void) throws {
        let bounds = CGRect(x: sx, y: sy, width: sw, height: sh)
        let renderer = UIGraphicsImageRenderer(bounds: bounds)
        try DispatchQueue.main.sync {
            let uiImage = renderer.image(actions: { rendererContext in
                // The sublayers will be empty when the canvas invalidate is called. In that
                // case, we want the image data come from the view layer.
                if sublayers.isEmpty {
                    self.layer.render(in: rendererContext.cgContext)
                } else {
                    let rootLayer = CALayer()
                    rootLayer.bounds = self.bounds
                    self.renderLayers(allLayerData: sublayers, layer: rootLayer)
                    rootLayer.render(in: rendererContext.cgContext)
                }
            })
            guard let bitmap = uiImage.cgImage else {
                throw CanvasError.unableToCreateBitmap
            }
            let imageData = ImageData(bitmap: bitmap, scaledWidth: sw, scaledHeight: sh)
            completionHandler(imageData)
        }
    }

    func putImageData(imageData: ImageData, sx: CGFloat, sy: CGFloat) throws {
        let newLayer = ImageLayerData(image: imageData.bitmap, transform: currentState.transform, frame: frame)
        sublayers.append(newLayer)
    }

    func onTransformationChange() {
        let newLayer = ShapeLayerData(path: path, state: currentState)
        shapeLayers.append(newLayer)
        let startPoint = path.currentPoint
        path = CGMutablePath()
        path.move(to: startPoint, transform: CATransform3DGetAffineTransform(currentState.transform))
    }

    class Stack {
        var stateArray = [CanvasState]()

        func push(state: CanvasState) {
            stateArray.append(state)
        }

        func pop() -> CanvasState? {
            if stateArray.last != nil {
                return stateArray.removeLast()
            } else {
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
    public var fontRepresentation: NSDictionary?

    init(transform: CATransform3D = CATransform3DIdentity,
         strokeStyle: CGColor = UIColor.black.cgColor,
         fillStyle: CGColor = UIColor.black.cgColor,
         lineWidth: CGFloat = 1,
         lineCap: CAShapeLayerLineCap = .butt,
         lineJoin: CAShapeLayerLineJoin = .miter,
         miterLimit: CGFloat = 10,
         font: UIFont = .systemFont(ofSize: 10),
         textAlign: NSTextAlignment = NSTextAlignment.left) {
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
        // swiftlint:disable:next force_cast
        self.font = state.font.copy() as! UIFont
        self.textAlign = state.textAlign
        self.fontRepresentation = state.fontRepresentation
    }
}
