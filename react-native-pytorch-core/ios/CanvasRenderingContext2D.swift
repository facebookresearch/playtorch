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
            try fillRectWithErrorHandling(canvasRef, x: x, y: y, width: width, height: height)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform fillRect")
        }
    }

    @objc
    func strokeRect(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) {
        do {
            try strokeRectWithErrorHandling(canvasRef, x: x, y: y, width: width, height: height)
        } catch {
            //TODO(T92857704) Eventually forward Error to React Native using promises
            print("Could not perform strokeRect")
        }
    }


    func fillRectWithErrorHandling(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) throws {
        let castedCanvasRef = canvasRef as? [ String : String ]
        guard let ref = castedCanvasRef else { throw CanvasRenderingContext2DError.castingDict }
        let castedCanvasView = try JSContext.unwrapObject(jsRef: ref) as? DrawingCanvasView
        guard let canvasView =  castedCanvasView else { throw CanvasRenderingContext2DError.castingView }
        canvasView.fillRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
    }

    func strokeRectWithErrorHandling(_ canvasRef: NSDictionary, x: NSNumber, y: NSNumber, width: NSNumber, height: NSNumber) throws {
        let castedCanvasRef = canvasRef as? [ String : String ]
        guard let ref = castedCanvasRef else { throw CanvasRenderingContext2DError.castingDict }
        let castedCanvasView = try JSContext.unwrapObject(jsRef: ref) as? DrawingCanvasView
        guard let canvasView = castedCanvasView else { throw CanvasRenderingContext2DError.castingView }
        canvasView.strokeRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
    }

    @objc
    func clear(_ canvasRef: NSDictionary) {
        //TODO(T90912919) implement clear
    }

    @objc
    func invalidate(_ canvasRef: NSDictionary) throws {
        let castedCanvasRef = canvasRef as? [ String : String ]
        guard let ref =  castedCanvasRef else { throw CanvasRenderingContext2DError.castingDict }
        let castedCanvasView = try JSContext.unwrapObject(jsRef: ref) as? DrawingCanvasView
        guard let canvasView = castedCanvasView else { throw CanvasRenderingContext2DError.castingView }
        canvasView.invalidate()
    }

}
