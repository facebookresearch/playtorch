/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

enum BaseIValuePackerError: Error {
    case invalidTransformType
    case invalidPackType
    case invalidUnpackType
    case invalidParam
    case missingKeyParam
    case invalidDType
    case JSONToStringError
    case stringToJSONError
    case packStringError
    case decodeBertError
    case decodeObjectsError
    case audioUnwrapError
    case decodeStringError
    case encodeImageError
}

class BaseIValuePacker: IIValuePacker {

    private static var initialized = false

    private var mSrcSpec: String
    private var mSpec: JSON

    init(srcSpec: String) throws {
        BaseIValuePacker.registerAllPackersAndUnpackers()
        mSrcSpec = srcSpec
        let data = Data(srcSpec.utf8)
        mSpec = try JSON(data: data)
    }

    /**
     * Register default packer and unpacker once when BaseIValuePacker is used for the first time. This is most likely
     * when the first model gets preloaded or executed.
     */
    static func registerAllPackersAndUnpackers() {
        if initialized {
            return
        }
        do {
            // Default packers
            try PackerRegistry.register(type: "tensor_from_image", packer: TensorFromImagePacker())
            try PackerRegistry.register(type: "tensor_from_audio", packer: TensorFromAudioPacker())
            try PackerRegistry.register(type: "tensor_from_string", packer: TensorFromStringPacker())

            // Default unpackers
            try PackerRegistry.register(type: "tensor", unpacker: TensorUnpacker())
            try PackerRegistry.register(type: "argmax", unpacker: ArgmaxUnpacker())
            try PackerRegistry.register(type: "tensor_to_image", unpacker: TensorToImageUnpacker())
            try PackerRegistry.register(type: "bert_decode_qa_answer", unpacker: BertDecodeQAAnswerUnpacker())
            try PackerRegistry.register(type: "bounding_boxes", unpacker: BoundingBoxesUnpacker())
            try PackerRegistry.register(type: "string", unpacker: StringUnpacker())
        } catch {
            // nothing
        }
        self.initialized = true
    }

    func pack(params: NSDictionary, packerContext: PackerContext) throws -> IValue? {
        let modelSpec: JSON = try BaseIValuePacker.applyParams(srcSpec: mSrcSpec, params: params)
        return try PackerRegistry.pack(modelSpec: modelSpec, params: params, packerContext: packerContext)
    }

    func unpack(ivalue: IValue, params: NSDictionary, packerContext: PackerContext) throws -> [String: Any] {
        let modelSpec: JSON = try BaseIValuePacker.applyParams(srcSpec: mSrcSpec, params: params)
        var result: [String: Any] = [String: Any]()
        try PackerRegistry.unpack(ivalue: ivalue, modelSpec: modelSpec, result: &result, packerContext: packerContext)
        return result
    }

    func newContext() -> PackerContext {
        return PackerContext(spec: mSpec)
    }

    private static func applyParams(srcSpec: String, params: NSDictionary) throws -> JSON {
        var tmpSrcSpec = srcSpec
        for (key, value) in params where key is String {
            guard let value = value as? String else {
                let stringifiedObject = String(describing: value)
                tmpSrcSpec = tmpSrcSpec.replacingOccurrences(of: "$\(key)", with: stringifiedObject)
                continue
            }
            tmpSrcSpec = tmpSrcSpec.replacingOccurrences(of: "$\(key)", with: value)
        }

        do {
            return try JSON(data: Data(tmpSrcSpec.utf8))
        } catch {
            throw BaseIValuePackerError.stringToJSONError
        }
    }
}
