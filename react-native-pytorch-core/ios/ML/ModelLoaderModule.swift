/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

@objc(ModelLoaderModule)
class ModelLoaderModule: NSObject {

    @objc(download:resolver:rejecter:)
    public func download(_ modelUri: NSString,
                         resolver resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        let completionHandler: (URL?, String?) -> Void  = { url, error in
            if let error = error {
                reject(RCTErrorUnspecified, error, nil)
            } else {
                do {
                    let absolutePath = try ModelUtils.urlStringWithoutFileScheme(url: url)
                    resolve(absolutePath)
                } catch {
                    reject(RCTErrorUnspecified, "download model failed", nil)
                }
            }
        }
        ModelUtils.downloadModel(modelUri: modelUri as String, completionHandler: completionHandler)
    }
}
