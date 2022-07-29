/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(PTLBlobUtils)
public class BlobUtils: NSObject {

  @objc
  public static func beginReadData(cRefId: UnsafePointer<CChar>) -> UnsafePointer<CChar>? {
    let refId = String(cString: cRefId)
    do {
      let obj = try JSContext.unwrapObject(jsRef: ["ID": refId])
      if obj is IImage {
        let str = unwrapObject(mediaObject: obj, targetType: IImage.self)
        let newString = strdup(str)
        return UnsafePointer(newString)
      } else if obj is IAudio {
        let str = unwrapObject(mediaObject: obj, targetType: IAudio.self)
        let newString = strdup(str)
        return UnsafePointer(newString)
      }
    } catch {
      print("error unwrapping object")
    }
    return nil
  }

  @objc
  public static func endReadData(cRefId: UnsafePointer<CChar>) {
    let refId = String(cString: cRefId)
    MediaToBlobCache.end(idRef: refId)
  }

  @objc
  public static func getDirectBytes(cRefId: UnsafePointer<CChar>) -> UnsafeMutablePointer<UInt8>? {
    let refId = String(cString: cRefId)
    let mediaData = MediaToBlobCache.get(idRef: refId)
    return mediaData.getDirectBytes()
  }

  @objc
  public static func getDirectSize(cRefId: UnsafePointer<CChar>) -> size_t {
    let refId = String(cString: cRefId)
    let mediaData = MediaToBlobCache.get(idRef: refId)
    return mediaData.getDirectSize()
  }

  public static func unwrapObject<T>(mediaObject: Any, targetType: T.Type) -> String? {
    guard let obj = mediaObject as? T else {
      print("error unwrapping object")
      return nil
    }
    guard let str = MediaToBlobCache.begin(obj: obj) else {
      print("error reading object data")
      return nil
    }
    return str
  }
}
