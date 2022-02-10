/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@_cdecl("torchlive_media_beginReadData")
public func torchlive_media_beginReadData(cRefId: UnsafePointer<CChar>) -> UnsafePointer<CChar>? {
    let refId = String(cString: cRefId)
    do {
        let obj = try JSContext.unwrapObject(jsRef: ["ID": refId])
        if obj is IImage {
            guard let img = obj as? IImage else {
                print("error unwrapping object")
                return nil
            }
            let str = MediaToBlobCache.begin(img: img)
            let newString = strdup(str)
            return UnsafePointer(newString)
        }
    } catch {
        print("error unwrapping object")
    }
    return nil
}

@_cdecl("torchlive_media_endReadData")
public func torchlive_media_endReadData(cRefId: UnsafePointer<CChar>) {
    let refId = String(cString: cRefId)
    MediaToBlobCache.end(idRef: refId)
}

@_cdecl("torchlive_media_getDirectBytes")
public func torchlive_media_getDirectBytes(cRefId: UnsafePointer<CChar>) -> UnsafeMutablePointer<UInt8>? {
    let refId = String(cString: cRefId)
    let mediaData = MediaToBlobCache.get(idRef: refId)
    return mediaData.getDirectBytes()
}

@_cdecl("torchlive_media_getDirectSize")
public func torchlive_media_getDirectSize(cRefId: UnsafePointer<CChar>) -> size_t {
    let refId = String(cString: cRefId)
    let mediaData = MediaToBlobCache.get(idRef: refId)
    return mediaData.getDirectSize()
}
