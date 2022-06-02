/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(ImageDataModule)
public class ImageDataModule: NSObject {

    @objc
    public func getName() -> String {
        return "PyTorchCoreImageDataModule"
    }

    @objc(release:resolver:rejecter:)
    public func release(_ imageDataRef: NSDictionary,
                        resolver resolve: RCTPromiseResolveBlock,
                        rejecter reject: RCTPromiseRejectBlock) {
        do {
            if let imageDataRef = imageDataRef as? [ String: String] {
                try JSContext.release(jsRef: imageDataRef)
            }
            resolve(nil)
        } catch {
            reject(RCTErrorUnspecified, "Invalid image data reference in release: \(error)", error)
        }
    }
}
