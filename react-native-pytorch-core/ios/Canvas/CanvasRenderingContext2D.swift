/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(CanvasRenderingContext2D)
class CanvasRenderingContext2D: NSObject {

    enum CanvasRenderingContext2DError : Error {
        case castingObject
        case castingDict
    }

    @objc
    func fillRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform fillRect: \(error)", error)
        }
    }

    @objc
    func strokeRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.strokeRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform strokeRect: \(error)", error)
        }
    }

    @objc
    func rect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.rect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform rect: \(error)", error)
        }
    }

    @objc
    func arc(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber, startAngle: NSNumber, endAngle: NSNumber, counterclockwise: Bool, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.arc(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius), startAngle: CGFloat(truncating: startAngle), endAngle: CGFloat(truncating: endAngle), counterclockwise: counterclockwise)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform arc: \(error)", error)
        }
    }

    @objc
    func clearRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.clearRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform clearRect: \(error)", error)
        }
    }

    @objc
    func clear(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.clear()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform clear: \(error)", error)
        }
    }

    @objc
    func invalidate(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.invalidate()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform invalidate: \(error)", error)
        }
    }

    @objc
    func stroke(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.stroke()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform stroke: \(error)", error)
        }
    }

    @objc
    func fill(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fill()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform fill: \(error)", error)
        }
    }

    func unwrapCanvas(_ canvasRef: NSDictionary) throws -> DrawingCanvasView {
        let castedCanvasRef = canvasRef as? [ String : String ]
        guard let ref =  castedCanvasRef else { throw CanvasRenderingContext2DError.castingDict }
        let castedCanvasView = try JSContext.unwrapObject(jsRef: ref) as? DrawingCanvasView
        guard let canvasView = castedCanvasView else { throw CanvasRenderingContext2DError.castingObject }
        return canvasView
    }

    func unwrapImage(_ imageRef: NSDictionary) throws -> IImage {
        guard let ref = imageRef["ID"] as? String else { throw CanvasRenderingContext2DError.castingDict }
        let castedImage = try JSContext.unwrapObject(jsRef: ["ID": ref]) as? IImage
        guard let image = castedImage else { throw CanvasRenderingContext2DError.castingObject }
        return image
    }

    public static func unwrapImageData(_ imageDataRef: NSDictionary) throws -> ImageData {
        guard let ref = imageDataRef["ID"] as? String else { throw CanvasRenderingContext2DError.castingDict }
        let castedImageData = try JSContext.unwrapObject(jsRef: ["ID": ref]) as? ImageData
        guard let imageData = castedImageData else { throw CanvasRenderingContext2DError.castingObject }
        return imageData
    }

    @objc
    func scale(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.scale(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform scale: \(error)", error)
        }
    }

    @objc
    func rotate(_ canvasRef: NSDictionary, angle: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.rotate(angle: CGFloat(truncating: angle))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform rotate: \(error)", error)
        }
    }

    @objc
    func translate(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.translate(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform translate: \(error)", error)
        }
    }

    @objc
    func setTransform(_ canvasRef: NSDictionary, a: NSNumber, b: NSNumber, c: NSNumber, d: NSNumber, e: NSNumber, f: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setTransform(a: CGFloat(truncating: a), b: CGFloat(truncating: b), c: CGFloat(truncating: c), d: CGFloat(truncating: d), e: CGFloat(truncating: e), f: CGFloat(truncating: f))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setTransform: \(error)", error)
        }
    }

    @objc
    func save(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.save()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform save: \(error)", error)
        }
    }

    @objc
    func restore(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.restore()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform restore: \(error)", error)
        }
    }

    @objc
    func setFillStyle(_ canvasRef: NSDictionary, color: CGColor, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setFillStyle(color: color)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setFillStyle: \(error)", error)
        }
    }

    @objc
    func setStrokeStyle(_ canvasRef: NSDictionary, color: CGColor, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setStrokeStyle(color: color)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setStrokeStyle: \(error)", error)
        }
    }

    @objc
    func setLineWidth(_ canvasRef: NSDictionary, lineWidth: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setLineWidth(lineWidth: CGFloat(truncating: lineWidth))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setLineWidth: \(error)", error)
        }
    }

    @objc
    func setLineCap(_ canvasRef: NSDictionary, lineCap: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            try canvasView.setLineCap(lineCap: lineCap as String)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setLineCap: \(error)", error)
        }
    }

    @objc
    func setLineJoin(_ canvasRef: NSDictionary, lineJoin: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            try canvasView.setLineJoin(lineJoin: lineJoin as String)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setLineJoin: \(error)", error)
        }
    }

    @objc
    func setMiterLimit(_ canvasRef: NSDictionary, miterLimit: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setMiterLimit(miterLimit: CGFloat(truncating: miterLimit))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setMiterLimit: \(error)", error)
        }
    }

    @objc
    func setFont(_ canvasRef: NSDictionary, font: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            try canvasView.setFont(font: font)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setFont: \(error)", error)
        }
    }

    @objc
    func beginPath(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.beginPath()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform beginPath: \(error)", error)
        }
    }

    @objc
    func closePath(_ canvasRef: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.closePath()
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform closePath: \(error)", error)
        }
    }

    @objc
    func lineTo(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let point = CGPoint(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            canvasView.lineTo(point: point)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform lineTo: \(error)", error)
        }
    }

    @objc
    func moveTo(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let point = CGPoint(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            canvasView.moveTo(point: point)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform moveTo: \(error)", error)
        }
    }

    @objc
    func drawCircle(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.drawCircle(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform drawCircle: \(error)", error)
        }
    }

    @objc
    func fillCircle(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.drawCircle(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius), fill: true)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform fillCircle: \(error)", error)
        }
    }

    @objc
    func fillText(_ canvasRef: NSDictionary, text: NSString, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillText(text: text as String, x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform fillText: \(error)", error)
        }
    }

    @objc
    func strokeText(_ canvasRef: NSDictionary, text: NSString, x: NSNumber, y: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillText(text: text as String, x: CGFloat(truncating: x), y: CGFloat(truncating: y), fill: false)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform strokeText: \(error)", error)
        }
    }

    @objc
    func setTextAlign(_ canvasRef: NSDictionary, textAlign: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setTextAlign(textAlign: textAlign as String)
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform setTextAlign: \(error)", error)
        }
    }

    @objc
    func drawImage(_ canvasRef: NSDictionary, image: NSDictionary, sx: NSNumber, sy: NSNumber, sWidth: NSNumber, sHeight: NSNumber, dx: NSNumber, dy: NSNumber, dWidth: NSNumber, dHeight: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let image = try unwrapImage(image)
            if (dWidth == -1 && sWidth == -1) {
                try canvasView.drawImage(image: image, dx: CGFloat(truncating: sx), dy: CGFloat(truncating: sy))
            } else if (dx == -1) {
                try canvasView.drawImage(image: image, dx: CGFloat(truncating: sx), dy: CGFloat(truncating: sy), dWidth: CGFloat(truncating: sWidth), dHeight: CGFloat(truncating: sHeight))
            } else {
                try canvasView.drawImage(image: image, sx: CGFloat(truncating: sx), sy: CGFloat(truncating: sy), sWidth: CGFloat(truncating: sWidth), sHeight: CGFloat(truncating: sHeight), dx: CGFloat(truncating: dx), dy: CGFloat(truncating: dy), dWidth: CGFloat(truncating: dWidth), dHeight: CGFloat(truncating: dHeight))
            }
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Could not perform drawImage: \(error)", error)
        }
    }

    @objc
    func getImageData(_ canvasRef: NSDictionary, sx: NSNumber, sy: NSNumber, sw: NSNumber, sh: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let imageData = try canvasView.getImageData(sx: CGFloat(truncating: sx), sy: CGFloat(truncating: sy), sw: CGFloat(truncating: sw), sh: CGFloat(truncating: sh))
            let ref = JSContext.wrapObject(object: imageData).getJSRef()
            resolve(ref)
        }
        catch {
            reject(RCTErrorUnspecified, "Could not perform getImageData: \(error)", error)
        }
    }

    @objc
    func putImageData(_ canvasRef: NSDictionary, imageDataRef: NSDictionary, sx: NSNumber, sy: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let imageData = try CanvasRenderingContext2D.unwrapImageData(imageDataRef)
            try canvasView.putImageData(imageData: imageData, sx: CGFloat(truncating: sx), sy: CGFloat(truncating: sy))
            resolve(nil)
        }
        catch {
            reject(RCTErrorUnspecified, "Could not perform putImageData: \(error)", error)
        }
    }
}
