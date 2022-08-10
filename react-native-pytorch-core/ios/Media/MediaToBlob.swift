/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(PTLMediaToBlob)
public class MediaToBlob: NSObject {
  private var mBuffer: Data?
  private var mBlobType: String?

  enum MediaToBlobError: Error {
      case unknownUnwrappedObject
  }

  // Keep blob type constants in sync with cxx/src/torchlive/media/Blob.h
  static let kBlobTypeImageGrayscale = "image/x-playtorch-grayscale"
  static let kBlobTypeImageRGB = "image/x-playtorch-rgb"
  static let kBlobTypeImageRGBA = "image/x-playtorch-rgba"
  static let kBlobTypeAudio = "audio/x-playtorch"

  @objc
  public init(refId: String) throws {
      super.init()
      let obj = try JSContext.unwrapObject(jsRef: ["ID": refId])
      if obj is IImage {
          // swiftlint:disable:next force_cast
          let image = obj as! IImage
          imageToBlob(img: image)
      } else if obj is IAudio {
          // swiftlint:disable:next force_cast
          let audio = obj as! IAudio
          audioToBlob(audio: audio)
      } else {
        throw MediaToBlobError.unknownUnwrappedObject
      }
  }

  private func imageToBlob(img: IImage) {
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

      mBuffer = Data(buffer)
      mBlobType = MediaToBlob.kBlobTypeImageRGB
  }

  private func audioToBlob(audio: IAudio) {
      mBuffer = audio.getData()
      mBlobType = MediaToBlob.kBlobTypeAudio
  }

  @objc
  public func getByteBuffer() -> Data? {
      return mBuffer
  }

  @objc
  public func getBlobType() -> String? {
    return mBlobType
  }
}
