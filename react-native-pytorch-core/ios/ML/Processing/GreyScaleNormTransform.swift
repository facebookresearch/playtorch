/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import UIKit
import SwiftyJSON

class GreyScaleNormTransform: IImageToTensorTransform {
    let mean: Float
    let std: Float
    let colorBackground: CGColor
    let colorForeground: CGColor

    enum GreyScaleNormTransformError: Error {
        case noMeanStdColor
    }

    init(mean: Float, std: Float, colorBackground: CGColor, colorForeground: CGColor) {
        self.mean = mean
        self.std = std
        self.colorBackground = colorBackground
        self.colorForeground = colorForeground
    }

    static func parse(transform: JSON) throws -> GreyScaleNormTransform {
        if let mean = transform["mean"].float,
           let std = transform["std"].float,
           let colorBackgroundString = transform["colorBackground"].string,
           let colorForegroundString = transform["colorForeground"].string {
            let colorBackground = hexStringToUIColor(hex: colorBackgroundString)
            let colorForeground = hexStringToUIColor(hex: colorForegroundString)
            return GreyScaleNormTransform(mean: mean,
                                          std: std,
                                          colorBackground: colorBackground.cgColor,
                                          colorForeground: colorForeground.cgColor)
        } else {
            throw GreyScaleNormTransformError.noMeanStdColor
        }
    }

    static func hexStringToUIColor(hex: String) -> UIColor {
        var cString: String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()

        if cString.hasPrefix("#") {
            cString.remove(at: cString.startIndex)
        }

        if (cString.count) != 6 {
            return UIColor.gray
        }

        var rgbValue: UInt64 = 0
        Scanner(string: cString).scanHexInt64(&rgbValue)

        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }

    func colorCartesianDistance(colorLhs: CGColor, colorRhs: CGColor) -> Float {
        let red0 = Int(round(colorLhs.components![0] * 255))
        let green0 = Int(round(colorLhs.components![1] * 255))
        let blue0 = Int(round(colorLhs.components![2] * 255))
        let red1 = Int(round(colorRhs.components![0] * 255))
        let green1 = Int(round(colorRhs.components![1] * 255))
        let blue1 = Int(round(colorRhs.components![2] * 255))
        let compA = red0 - red1
        let compB = green0 - green1
        let combC = blue0 - blue1
        return sqrtf(Float(compA*compA + compB*compB + combC*combC))
    }

    func transform(bitmap: CGImage) -> Tensor? {
        let width = bitmap.width
        let height = bitmap.height
        let bytesPerPixel = 4
        let bytesPerRow = bytesPerPixel * width
        let bitsPerComponent = 8
        var rawBytes: [UInt8] = [UInt8](repeating: 0, count: width * height * 4)
        rawBytes.withUnsafeMutableBytes { ptr in
            if let context = CGContext(data: ptr.baseAddress,
                                        width: width,
                                        height: height,
                                        bitsPerComponent: bitsPerComponent,
                                        bytesPerRow: bytesPerRow,
                                        space: CGColorSpaceCreateDeviceRGB(),
                                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) {
                let rect = CGRect(x: 0, y: 0, width: width, height: height)
                context.draw(bitmap, in: rect)
            }
        }
        var normalizedBuffer: [Float32] = [Float32](repeating: 0, count: width * height * 1)
        for idx in 0 ..< width * height {
            let red = CGFloat(rawBytes[idx * 4 + 0]) / 255.0 // R
            let green = CGFloat(rawBytes[idx * 4 + 1]) / 255.0 // G
            let blue = CGFloat(rawBytes[idx * 4 + 2]) / 255.0 // B
            let colorLhs = UIColor(red: red, green: green, blue: blue, alpha: 1.0).cgColor
            let dist0 = colorCartesianDistance(colorLhs: colorLhs, colorRhs: self.colorBackground)
            let dist1 = colorCartesianDistance(colorLhs: colorLhs, colorRhs: self.colorForeground)
            let value = dist0 / (dist0 + dist1)
            let norm = (value - self.mean) / self.std
            normalizedBuffer[idx] = norm
        }
        return Tensor.fromBlob(data: &normalizedBuffer,
                               shape: [1, 1, NSNumber(value: Int32(width)), NSNumber(value: Int32(height))],
                               dtype: .float)
    }
}
