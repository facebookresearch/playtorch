/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

@objc(MobileModelModule)
public class MobileModelModule: NSObject {

    enum MobileModelModuleError: Error {
        case downloadError
        case moduleCreationError
        case imageUnwrapError
    }

    private var mModulesAndSpecs: [String: ModuleHolder] = [:]

    @objc(execute:params:resolver:rejecter:)
    public func execute(_ modelPath: NSString,
                        params: NSDictionary,
                        resolver resolve: @escaping InternalRCTPromiseResolveBlock,
                        rejecter reject: @escaping InternalRCTPromiseRejectBlock) {
        let modelKey = getKey(path: modelPath as String)
        if let moduleHolder = mModulesAndSpecs[modelKey] {
            guard let packer = moduleHolder.packer else {
                reject(RCTErrorUnspecified, "Could not find model packer", nil)
                return
            }
            let packerContext: PackerContext = packer.newContext()
            let startPack = clock()
            do {
                if let ivalue =  try packer.pack(params: params, packerContext: packerContext) {
                    let packTime = (Double(clock() - startPack) / 1000).rounded()
                    let startInference = clock()
                    if let ivalue = moduleHolder.module?.forward([ivalue]) {
                        let inferenceTime = (Double(clock() - startInference) / 1000).rounded()
                        let startUnpack = clock()
                        let result = try packer.unpack(ivalue: ivalue, params: params, packerContext: packerContext)
                        let unpackTime = (Double(clock() - startUnpack) / 1000).rounded()
                        let metrics = [
                            "totalTime": packTime + inferenceTime + unpackTime,
                            "packTime": packTime,
                            "inferenceTime": inferenceTime,
                            "unpackTime": unpackTime
                        ]
                        resolve(["result": result, "metrics": metrics])
                    }
                } else {
                    reject(RCTErrorUnspecified, "Could not run inference on packed inputs", nil)
                }
            } catch {
                reject(RCTErrorUnspecified, "\(error)", error)
            }
        } else {
            let completionHandler: (String?) -> Void = { error in
                if let error = error {
                    reject(RCTErrorUnspecified, error, nil)
                } else {
                    self.execute(modelPath, params: params, resolver: resolve, rejecter: reject)
                }
            }
            fetchCacheAndLoadModel(modelUri: modelPath as String, completionHandler: completionHandler)
        }
    }

    @objc(preload:resolver:rejecter:)
    public func preload(_ modelUri: NSString,
                        resolver resolve: @escaping InternalRCTPromiseResolveBlock,
                        rejecter reject: @escaping InternalRCTPromiseRejectBlock) {
        let completionHandler: (String?) -> Void  = { error in
            if let error = error {
                reject(RCTErrorUnspecified, error, nil)
            } else {
                resolve(nil)
            }
        }
        fetchCacheAndLoadModel(modelUri: modelUri as String, completionHandler: completionHandler)
    }

    @objc(unload:rejecter:)
    public func unload(_ resolve: @escaping InternalRCTPromiseResolveBlock,
                       rejecter reject: @escaping InternalRCTPromiseRejectBlock) {
        mModulesAndSpecs.removeAll()
        resolve(nil)
    }

    func fetchCacheAndLoadModel(modelUri: String, completionHandler: @escaping (String?) -> Void) {
        let downloadCompletionHandler: (URL?, String?) -> Void = { url, error in
            if let error = error {
                completionHandler(error)
            } else {
                guard let modelUrl = url else {
                    completionHandler("Could not download model")
                    return
                }
                self.loadModelFromURL(modelUri: modelUri, url: modelUrl, completionHandler: completionHandler)
            }
        }
        ModelUtils.downloadModel(modelUri: modelUri, completionHandler: downloadCompletionHandler)
    }

    func loadModelFromURL(modelUri: String, url: URL, completionHandler: @escaping (String?) -> Void) {
        let modelKey = getKey(path: modelUri)

        // Try to fetch live.spec.json from model file
        let extraFiles = NSMutableDictionary()
        extraFiles.setValue("", forKey: "model/live.spec.json")

        // Note: regardless what initial value is set for the key "model/live.spec.json", the
        // TorchModule.load method will set an empty string if the model file is not bundled inside the
        // model file.
        if let module = Module.load(url.path, extraFiles: extraFiles) {
            let modelSpec = extraFiles["model/live.spec.json"] as? String ?? ""
            if !modelSpec.isEmpty {
                do {
                    try self.mModulesAndSpecs[modelKey] = ModuleHolder(module: module, srcSpec: modelSpec)
                    completionHandler(nil)
                } catch {
                    completionHandler("Could not fetch json file: \(error)")
                }
            } else {

                let otherCompletionHandler: (String) -> Void = { spec in
                    do {
                        try self.mModulesAndSpecs[modelKey] = ModuleHolder(module: module, srcSpec: spec)
                        completionHandler(nil)
                    } catch {
                        completionHandler("could not fetch json file: \(error)")
                    }
                }

                self.fetchModelSpec(modelUri: modelUri,
                                    completionHandler: otherCompletionHandler,
                                    errorHandler: completionHandler)
            }
        } else {
            completionHandler("Could not convert downloaded file into Torch Module")
        }
    }

    func fetchModelSpec(modelUri: String,
                        completionHandler: @escaping (String) -> Void,
                        errorHandler: @escaping (String?) -> Void) {
        guard var modelUrl = URL(string: modelUri) else { completionHandler("Could not load live spec"); return }
        let newLastComponent = modelUrl.lastPathComponent + ".live.spec.json"
        modelUrl.deleteLastPathComponent()
        modelUrl.appendPathComponent(newLastComponent)
        let specTask = URLSession.shared.downloadTask(with: modelUrl) { urlOrNil, _, _ in
            guard let tempURL = urlOrNil else {
                completionHandler("Could not load live spec")
                return
            }
            do {
                let jsonString = try String(contentsOfFile: tempURL.path)
                completionHandler(jsonString)
            } catch {
                errorHandler("could not fetch json file: \(error)")
            }
        }
        specTask.resume()
    }

    public class ModuleHolder {
        var module: Module?
        var packer: IIValuePacker?

        init(module: Module, srcSpec: String) throws {
            self.module = module
            self.packer = try BaseIValuePacker(srcSpec: srcSpec)
        }
    }

    func getKey(path: String) -> String {
        var modelKey: String
        if let key = path.components(separatedBy: "/").last {
            modelKey = key
        } else {
            modelKey = path
        }
        return modelKey
    }
}
