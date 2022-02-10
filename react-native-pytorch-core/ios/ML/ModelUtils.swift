/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

enum ModelUtilsError: Error {
    case downloadError
}

class ModelUtils {

    static func downloadModel(modelUri: String, completionHandler: @escaping (URL?, String?) -> Void) {
        if let modelUrl = URL(string: modelUri) {

            // Load model from local file system if the scheme is file or if it
            // doesn't have a scheme (i.e., `nil`), which means it is likely a
            // local file if URI.
            if modelUrl.scheme == nil || modelUrl.scheme == "file" {
                completionHandler(modelUrl, nil)
            } else {
                let modelTask = URLSession.shared.downloadTask(with: modelUrl) { urlOrNil, _, _ in
                    guard let tempURL = urlOrNil else {
                        completionHandler(nil, "Error downloading file")
                        return
                    }
                    // Create path in cache directory using the last path component as a
                    // filename (e.g., mobilenet_v3_small.ptl).
                    let path = FileManager.default.urls(for: .cachesDirectory,
                                                           in: .userDomainMask)[0]
                        .appendingPathComponent(modelUrl.lastPathComponent)
                    try? FileManager.default.copyItem(at: tempURL, to: path)
                    completionHandler(path, nil)
                }
                modelTask.resume()
            }
        } else {
            completionHandler(nil, "Could not create URLSession with provided URL")
        }
    }

    static func urlStringWithoutFileScheme(url: URL?) throws -> String {
        guard let modelUrl = url else {
            throw ModelUtilsError.downloadError
        }
        let absolutePathString = modelUrl.absoluteString
        if !modelUrl.isFileURL || modelUrl.scheme != "file" {
            return absolutePathString
        }
        // Remove file:// from absolutePathString
        let fromIdx = absolutePathString.index(absolutePathString.startIndex, offsetBy: 7)
        return String(absolutePathString.suffix(from: fromIdx))
    }
}
