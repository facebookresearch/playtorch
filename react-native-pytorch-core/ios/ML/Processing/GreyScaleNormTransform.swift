/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import UIKit
import SwiftyJSON

class GreyScaleNormTransform: IImageToTensorTransform  {
    let mean: Float
    let std: Float
    let colorBackground: CGColor
    let colorForeground: CGColor
    enum GreyScaleNormTransformError: Error {
        case NoRGBTransform
        case NoMeanStdColorBackgroundOrColorForeground
    }
    init(mean: Float, std: Float, colorBackground: CGColor, colorForeground: CGColor) {
        self.mean = mean
        self.std = std
        self.colorBackground = colorBackground
        self.colorForeground = colorForeground
    }
    static func parse(transform: JSON) throws -> GreyScaleNormTransform {
        if let mean = transform["mean"].float, let std = transform["std"].float, let colorBackgroundString = transform["colorBackground"].string, let colorForegroundString = transform["colorForeground"].string {
            let colorBackground = hexStringToUIColor(hex: colorBackgroundString)
            let colorForeground = hexStringToUIColor(hex: colorForegroundString)
            return GreyScaleNormTransform(mean: mean, std: std, colorBackground: colorBackground.cgColor, colorForeground: colorForeground.cgColor)
        }
        else {
            throw GreyScaleNormTransformError.NoMeanStdColorBackgroundOrColorForeground
        }
    }
    static func hexStringToUIColor(hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()

        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }

        if ((cString.count) != 6) {
            return UIColor.gray
        }

        var rgbValue:UInt64 = 0
        Scanner(string: cString).scanHexInt64(&rgbValue)

        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }

    func colorCartesianDistance(colorLhs: CGColor, colorRhs: CGColor) -> Float {
        let r0 = Int(round(colorLhs.components![0] * 255))
        let g0 = Int(round(colorLhs.components![1] * 255))
        let b0 = Int(round(colorLhs.components![2] * 255))
        let r1 = Int(round(colorRhs.components![0] * 255))
        let g1 = Int(round(colorRhs.components![1] * 255))
        let b1 = Int(round(colorRhs.components![2] * 255))
        let a = r0 - r1
        let b = g0 - g1
        let c = b0 - b1
        return sqrtf(Float(a*a + b*b + c*c))
    }

    func transform(bitmap: CGImage) -> Tensor? {
        let w = bitmap.width
        let h = bitmap.height
        let bytesPerPixel = 4
        let bytesPerRow = bytesPerPixel * w
        let bitsPerComponent = 8
        var rawBytes: [UInt8] = [UInt8](repeating: 0, count: w * h * 4)
        rawBytes.withUnsafeMutableBytes { ptr in
            if let context = CGContext(data: ptr.baseAddress,
                                        width: w,
                                        height: h,
                                        bitsPerComponent: bitsPerComponent,
                                        bytesPerRow: bytesPerRow,
                                        space: CGColorSpaceCreateDeviceRGB(),
                                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) {
                let rect = CGRect(x: 0, y: 0, width: w, height: h)
                context.draw(bitmap, in: rect)
            }
        }
        var normalizedBuffer: [Float32] = [Float32](repeating: 0, count: w * h * 1)
        for i in 0 ..< w * h {
            let r = CGFloat(rawBytes[i * 4 + 0]) / 255.0 // R
            let g = CGFloat(rawBytes[i * 4 + 1]) / 255.0 // G
            let b = CGFloat(rawBytes[i * 4 + 2]) / 255.0 // B
            let c = UIColor(red: r, green: g, blue: b, alpha: 1.0).cgColor
            let d0 = colorCartesianDistance(colorLhs: c, colorRhs: self.colorBackground)
            let d1 = colorCartesianDistance(colorLhs: c, colorRhs: self.colorForeground)
            let value = d0 / (d0 + d1);
            let norm = (value - self.mean) / self.std
            normalizedBuffer[i] = norm
        }
        return Tensor.fromBlob(data: &normalizedBuffer, shape: [1, 1, NSNumber(value: Int32(w)), NSNumber(value: Int32(h))], dtype: .float)
    }
}
