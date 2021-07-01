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
        case castingView
        case castingDict
    }

    @objc
    func fillRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.fillRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fillRect")
        }
    }

    @objc
    func strokeRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.strokeRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeRect")
        }
    }

    @objc
    func rect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.rect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeRect")
        }
    }

    @objc
    func arc(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, radius: NSNumber, startAngle: NSNumber, endAngle: NSNumber, counterclockwise: Bool) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.arc(x: CGFloat(x), y: CGFloat(y), radius: CGFloat(radius), startAngle: CGFloat(startAngle), endAngle: CGFloat(endAngle), counterclockwise: counterclockwise)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform arc")
        }
    }

    @objc
    func clearRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.clearRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
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
        guard let canvasView = castedCanvasView else { throw CanvasRenderingContext2DError.castingView }
        return canvasView
    }

    @objc
    func scale(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.scale(x: CGFloat(x), y: CGFloat(y))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform scale")
        }
    }

    @objc
    func rotate(_ canvasRef: NSDictionary, angle: NSNumber, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            if(Int(x) >= 0 && Int(y) >= 0){
                canvasView.translate(x: CGFloat(x), y: CGFloat(y))
            }
            canvasView.rotate(angle: CGFloat(angle))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform rotate")
        }
    }

    @objc
    func translate(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.translate(x: CGFloat(x), y: CGFloat(y))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform translate")
        }
    }

    @objc
    func setTransform(_ canvasRef: NSDictionary, a: NSNumber, b: NSNumber, c: NSNumber, d: NSNumber, e: NSNumber, f: NSNumber) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            canvasView.setTransform(a: CGFloat(a), b: CGFloat(b), c: CGFloat(c), d: CGFloat(d), e: CGFloat(e), f: CGFloat(f))
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
            canvasView.setLineWidth(lineWidth: CGFloat(lineWidth))
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineWidth")
        }
    }

    @objc
    func setLineCap(_ canvasRef: NSDictionary, lineCap: NSString) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            if let lc = lineCap as? String {
                canvasView.setLineCap(lineCap: lc)
            }
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineCap")
        }
    }

    @objc
    func setLineJoin(_ canvasRef: NSDictionary, lineJoin: NSString) {
        do {
            let canvasView = try unwrapCanvas(canvasRef)
            if let lj = lineJoin as? String {
                canvasView.setLineJoin(lineJoin: lj)
            }
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform setLineJoin")
        }
    }
}
