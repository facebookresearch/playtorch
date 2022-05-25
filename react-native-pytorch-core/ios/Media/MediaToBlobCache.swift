/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

public class MediaToBlobCache {
    private static var refs: [String: MediaData] = [:]

    public static func begin(obj: Any) -> String? {
        if obj is IImage {
            guard let image = obj as? IImage else {
                print("error unwrapping object")
                return nil
            }
            return beginImg(img: image)
        } else if obj is IAudio {
            guard let audio = obj as? IAudio else {
                print("error unwrapping object")
                return nil
            }
            return beginAudio(audio: audio)
        }
        return nil
    }

    public static func beginImg(img: IImage) -> String? {
        let idRef = UUID().uuidString

        let bitmap = img.getBitmap()!
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

        var buffer: [UInt8] = [UInt8](repeating: 0, count: width * height * 3)
        for idx in 0 ..< width * height {
            buffer[idx * 3 + 0] = rawBytes[idx * 4 + 0] // R
            buffer[idx * 3 + 1] = rawBytes[idx * 4 + 1] // G
            buffer[idx * 3 + 2] = rawBytes[idx * 4 + 2] // B
        }

        let mediaData = MediaData(buffer: buffer, size: buffer.count)
        MediaToBlobCache.refs[idRef] = mediaData
        return idRef
    }

    public static func beginAudio(audio: IAudio) -> String? {
        let buffer = [UInt8](audio.getData())
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
