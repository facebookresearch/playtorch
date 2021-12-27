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
        case DownloadError
        case ModuleCreationError
        case ImageUnwrapError
    }

    private var mModulesAndSpecs: [String: ModuleHolder] = [:]

    @objc(execute:params:resolver:rejecter:)
    public func execute(_ modelPath: NSString, params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let modelKey = getKey(path: modelPath as String)
        if let moduleHolder = mModulesAndSpecs[modelKey] {
            let packer = BaseIValuePacker()
            guard let modelSpec = moduleHolder.modelSpec else {
                reject(RCTErrorUnspecified, "Could not find model spec", nil)
                return
            }
            let startPack = clock()
            do {
                if let ivalue =  try packer.pack(params: params, modelSpec: modelSpec) {
                    let packTime = (Double(clock() - startPack) / 1000).rounded()
                    let startInference = clock()
                    if let ivalue = moduleHolder.module?.forward([ivalue]) {
                        let inferenceTime = (Double(clock() - startInference) / 1000).rounded()
                        let startUnpack = clock()
                        let result = try packer.unpack(ivalue: ivalue, params: params, modelSpec: modelSpec)
                        let unpackTime = (Double(clock() - startUnpack) / 1000).rounded()
                        let metrics = ["totalTime": packTime + inferenceTime + unpackTime, "packTime": packTime, "inferenceTime": inferenceTime, "unpackTime": unpackTime]
                        resolve(["result": result, "metrics": metrics])
                    }
                } else {
                    reject(RCTErrorUnspecified, "Could not run inference on packed inputs", nil)
                }
            } catch {
                reject(RCTErrorUnspecified, "\(error)", error)
            }
        } else {
            let completionHandler: (String?) -> Void  = { error in
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
    public func preload(_ modelUri: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
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
    public func unload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        mModulesAndSpecs.removeAll()
        resolve(nil)
    }

    func fetchCacheAndLoadModel(modelUri: String, completionHandler: @escaping (String?) -> Void) {
        if let modelUrl = URL(string: modelUri) {

            // Load model from local file system if the scheme is file or if it
            // doesn't have a scheme (i.e., `nil`), which means it is likely a
            // local file if URI.
            if (modelUrl.scheme == nil || modelUrl.scheme == "file") {
                self.loadModelFromURL(modelUri: modelUri, url: modelUrl, completionHandler: completionHandler)
            }
            else {
            let modelTask = URLSession.shared.downloadTask(with: modelUrl) { urlOrNil, responseOrNil, errorOrNil in
                guard let tempURL = urlOrNil else { completionHandler("Error downloading file"); return }
                self.loadModelFromURL(modelUri: modelUri, url: tempURL, completionHandler: completionHandler)
            }
            modelTask.resume()
            }
        } else {
            completionHandler("Could not create URLSession with provided URL")
        }
    }

    func loadModelFromURL(modelUri: String, url: URL, completionHandler: @escaping (String?) -> Void) -> Void {
        let modelKey = getKey(path: modelUri)

        // Try to fetch live.spec.json from model file
        let extraFiles = NSMutableDictionary()
        extraFiles.setValue("", forKey: "model/live.spec.json")

        // Note: regardless what initial value is set for the key "model/live.spec.json", the
        // TorchModule.load method will set an empty string if the model file is not bundled inside the
        // model file.
        if let module = Module.load(url.path, extraFiles: extraFiles) {
            self.mModulesAndSpecs[modelKey] = ModuleHolder()
            self.mModulesAndSpecs[modelKey]?.setModule(module: module)

            let modelSpec = extraFiles["model/live.spec.json"] as? String ?? ""
            if (!modelSpec.isEmpty) {
                do {
                    let data = Data(modelSpec.utf8)
                    let modelSpec = try JSON(data: data)
                    self.mModulesAndSpecs[modelKey]?.setSpec(modelSpec: modelSpec)
                    completionHandler(nil)
                }
                catch {
                    completionHandler("Could not fetch json file: \(error)")
                }
            } else {
                self.fetchModelSpec(modelUri: modelUri, completionHandler: completionHandler)
            }
        } else {
            completionHandler("Could not convert downloaded file into Torch Module")
        }
    }

    func fetchModelSpec(modelUri: String, completionHandler: @escaping (String?) -> Void) {
        let modelKey = getKey(path: modelUri)
        guard var modelUrl = URL(string: modelUri) else { completionHandler("Could not load live spec"); return }
        let newLastComponent = modelUrl.lastPathComponent + ".live.spec.json"
        modelUrl.deleteLastPathComponent()
        modelUrl.appendPathComponent(newLastComponent)
        let specTask = URLSession.shared.downloadTask(with: modelUrl) { urlOrNil, responseOrNil, errorOrNil in
            guard let tempURL = urlOrNil else { completionHandler("Could not load live spec"); return }
            do {
                let jsonString = try String(contentsOfFile: tempURL.path)
                let data = Data(jsonString.utf8)
                let decodedModelSpec = try JSON(data: data)
                self.mModulesAndSpecs[modelKey]?.setSpec(modelSpec: decodedModelSpec)
                completionHandler(nil) //argument represents error, completionHandler(nil) represents success and will resolve promise
            } catch {
                completionHandler("could not fetch json file: \(error)")
            }
        }
        specTask.resume()
    }

    public class ModuleHolder {
        var module: Module?
        var modelSpec: JSON?

        func setModule(module: Module) {
            self.module = module
        }

        func setSpec(modelSpec: JSON) {
            self.modelSpec = modelSpec
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
