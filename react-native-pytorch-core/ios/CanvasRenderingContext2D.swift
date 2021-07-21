/*
 * Copyright (c) Facebook, Inc. and its affiliates.
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
    func fillRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fillRect")
        }
    }

    @objc
    func strokeRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.strokeRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeRect")
        }
    }

    @objc
    func rect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.rect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeRect")
        }
    }

    @objc
    func arc(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber, startAngle: NSNumber, endAngle: NSNumber, counterclockwise: Bool) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.arc(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius), startAngle: CGFloat(truncating: startAngle), endAngle: CGFloat(truncating: endAngle), counterclockwise: counterclockwise)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform arc")
        }
    }

    @objc
    func clearRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.clearRect(x: CGFloat(truncating: x), y: CGFloat(truncating: y), width: CGFloat(truncating: width), height: CGFloat(truncating: height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform clearRect")
        }
    }

    @objc
    func clear(_ canvasRef: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.clear()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform clear")
        }
    }

    @objc
    func invalidate(_ canvasRef: NSDictionary){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.invalidate()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform invalidate")
        }
    }

    @objc
    func stroke(_ canvasRef: NSDictionary){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.stroke()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform stroke")
        }
    }

    @objc
    func fill(_ canvasRef: NSDictionary){
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fill()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fill")
        }
    }

    func unwrapCanvas(_ canvasRef: NSDictionary) throws -> DrawingCanvasView {
        let castedCanvasRef = canvasRef as? [ String : String ]
        guard let ref =  castedCanvasRef else { throw CanvasRenderingContext2DError.castingDict }
        let castedCanvasView = try JSContext.unwrapObject(jsRef: ref) as? DrawingCanvasView
        guard let canvasView = castedCanvasView else { throw CanvasRenderingContext2DError.castingObject }
        return canvasView
    }

    func unwrapImage(_ imageRef: NSDictionary) throws -> BitmapImage {
        guard let ref = imageRef["ID"] as? String else { throw CanvasRenderingContext2DError.castingDict }
        let castedImage = try JSContext.unwrapObject(jsRef: ["ID": ref]) as? BitmapImage
        guard let image = castedImage else { throw CanvasRenderingContext2DError.castingObject }
        return image
    }

    @objc
    func scale(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.scale(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform scale")
        }
    }

    @objc
    func rotate(_ canvasRef: NSDictionary, angle: NSNumber, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            if(Int(truncating: x) >= 0 && Int(truncating: y) >= 0){
                canvasView.translate(x: -1 * CGFloat(truncating: x), y: -1 * CGFloat(truncating: y))
            }
            canvasView.rotate(angle: CGFloat(truncating: angle))
            if(Int(truncating: x) >= 0 && Int(truncating: y) >= 0){
                canvasView.translate(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            }
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform rotate")
        }
    }

    @objc
    func translate(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.translate(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform translate")
        }
    }

    @objc
    func setTransform(_ canvasRef: NSDictionary, a: NSNumber, b: NSNumber, c: NSNumber, d: NSNumber, e: NSNumber, f: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setTransform(a: CGFloat(truncating: a), b: CGFloat(truncating: b), c: CGFloat(truncating: c), d: CGFloat(truncating: d), e: CGFloat(truncating: e), f: CGFloat(truncating: f))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setTransform")
        }
    }

    @objc
    func save(_ canvasRef: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.save()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform save")
        }
    }

    @objc
    func restore(_ canvasRef: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.restore()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform save")
        }
    }

    @objc
    func setFillStyle(_ canvasRef: NSDictionary, color: CGColor) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setFillStyle(color: color)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setFillStyle")
        }
    }

    @objc
    func setStrokeStyle(_ canvasRef: NSDictionary, color: CGColor) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setStrokeStyle(color: color)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setStrokeStyle")
        }
    }

    @objc
    func setLineWidth(_ canvasRef: NSDictionary, lineWidth: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setLineWidth(lineWidth: CGFloat(truncating: lineWidth))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineWidth")
        }
    }

    @objc
    func setLineCap(_ canvasRef: NSDictionary, lineCap: NSString) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setLineCap(lineCap: lineCap as String)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineCap")
        }
    }

    @objc
    func setLineJoin(_ canvasRef: NSDictionary, lineJoin: NSString) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setLineJoin(lineJoin: lineJoin as String)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineJoin")
        }
    }

    @objc
    func setMiterLimit(_ canvasRef: NSDictionary, miterLimit: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setMiterLimit(miterLimit: CGFloat(truncating: miterLimit))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setMiterLimit")
        }
    }

    @objc
    func setFont(_ canvasRef: NSDictionary, font: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            if #available(iOS 13.0, *) {
                canvasView.setFont(font: font)
            } else {
                //TODO(T92857704) Eventually forward Error to React Native using promises
                print("iOS 13 is unavailable, cannot perform setFont")
            }
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setFont")
        }
    }

    @objc
    func beginPath(_ canvasRef: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.beginPath()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform beginPath")
        }
    }

    @objc
    func closePath(_ canvasRef: NSDictionary) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.closePath()
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform closePath")
        }
    }

    @objc
    func lineTo(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let point = CGPoint(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            canvasView.lineTo(point: point)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform lineTo")
        }
    }

    @objc
    func moveTo(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let point = CGPoint(x: CGFloat(truncating: x), y: CGFloat(truncating: y))
            canvasView.moveTo(point: point)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform moveTo")
        }
    }

    @objc
    func drawCircle(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.drawCircle(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform drawCircle")
        }
    }

    @objc
    func fillCircle(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.drawCircle(x: CGFloat(truncating: x), y: CGFloat(truncating: y), radius: CGFloat(truncating: radius), fill: true)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fillCircle")
        }
    }

    @objc
    func fillText(_ canvasRef: NSDictionary, text: NSString, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillText(text: text as String, x: CGFloat(truncating: x), y: CGFloat(truncating: y))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fillText")
        }
    }

    @objc
    func strokeText(_ canvasRef: NSDictionary, text: NSString, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillText(text: text as String, x: CGFloat(truncating: x), y: CGFloat(truncating: y), fill: false)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeText")
        }
    }

    @objc
    func setTextAlign(_ canvasRef: NSDictionary, textAlign: NSString) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setTextAlign(textAlign: textAlign as String)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setTextAlign")
        }
    }

    @objc
    func drawImage(_ canvasRef: NSDictionary, image: NSDictionary, sx: NSNumber, sy: NSNumber, sWidth: NSNumber, sHeight: NSNumber, dx: NSNumber, dy: NSNumber, dWidth: NSNumber, dHeight: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            let image = try unwrapImage(image)
            if (dWidth == -1 && sWidth == -1) {
                canvasView.drawImage(image: image, dx: CGFloat(truncating: sx), dy: CGFloat(truncating: sy))
            } else if (dx == -1) {
                canvasView.drawImage(image: image, dx: CGFloat(truncating: sx), dy: CGFloat(truncating: sy), dWidth: CGFloat(truncating: sWidth), dHeight: CGFloat(truncating: sHeight))
            } else {
                canvasView.drawImage(image: image, sx: CGFloat(truncating: sx), sy: CGFloat(truncating: sy), sWidth: CGFloat(truncating: sWidth), sHeight: CGFloat(truncating: sHeight), dx: CGFloat(truncating: dx), dy: CGFloat(truncating: dy), dWidth: CGFloat(truncating: dWidth), dHeight: CGFloat(truncating: dHeight))
            }
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform drawImage")
        }
    }
}
