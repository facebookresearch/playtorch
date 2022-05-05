/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class MediaToBlobCache {
    private static var refs: [String: MediaData] = [:]

    public static func begin(img: IImage) -> String? {
        guard let cgImage = img.getBitmap(),
            let provider = cgImage.dataProvider,
            let providerData = provider.data,
            let data = CFDataGetBytePtr(providerData) else {
                return nil
            }

        let numberOfComponents = cgImage.bitsPerPixel / cgImage.bitsPerComponent
        var buffer: [UInt8] = [UInt8](repeating: 0, count: cgImage.width * cgImage.height * 3)
        for y in 0 ..< cgImage.height {
            for x in 0 ..< cgImage.width {
                // Assuming RGBA or RGBX
                let pixelIndex = ((Int(cgImage.width) * y) + x) * numberOfComponents
                var red = data[pixelIndex]
                var green = data[pixelIndex + 1]
                var blue = data[pixelIndex + 2]
                let alpha = data[pixelIndex + 3]

                if cgImage.alphaInfo == .premultipliedLast {
                    if alpha == 0 {
                        red = 0
                        green = 0
                        blue = 0
                    } else {
                        red = UInt8(((CGFloat(red) / CGFloat(alpha)) * 255).rounded())
                        green = UInt8(((CGFloat(green) / CGFloat(alpha)) * 255).rounded())
                        blue = UInt8(((CGFloat(blue) / CGFloat(alpha)) * 255).rounded())
                    }
                }

                let bufferIndex = ((Int(cgImage.width) * y) + x) * 3
                buffer[bufferIndex + 0] = red
                buffer[bufferIndex + 1] = green
                buffer[bufferIndex + 2] = blue
            }
        }

        let mediaData = MediaData(buffer: buffer, size: buffer.count)
        let idRef = UUID().uuidString
        MediaToBlobCache.refs[idRef] = mediaData
        return idRef
    }

    public static func get(idRef: String) -> MediaData {
        return refs[idRef]!
    }

    public static func end(idRef: String) {
        refs.removeValue(forKey: idRef)
    }

    public class MediaData {
        private var mSize: Int
        private var mBuffer: [UInt8]

        init(buffer: [UInt8], size: Int) {
            mBuffer = buffer
            mSize = size
        }

        func getDirectSize() -> size_t {
            return mSize
        }

        func getDirectBytes() -> UnsafeMutablePointer<UInt8> {
            return mBuffer.withUnsafeMutableBytes { (bufferRawPtr: UnsafeMutableRawBufferPointer)
                -> UnsafeMutablePointer<UInt8> in
                let bufferTypedPtr = bufferRawPtr.bindMemory(to: UInt8.self)
                let unsafePointer = bufferTypedPtr.baseAddress!
                return unsafePointer
            }
        }
    }
}
