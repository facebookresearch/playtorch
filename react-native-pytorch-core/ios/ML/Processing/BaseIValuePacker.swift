/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class BaseIValuePacker {

    enum BaseIValuePackerError: Error {
        case ImageUnwrapError
        case InvalidImageToImageName
        case InvalidImageToTensorName
        case InvalidTransformType
        case InvalidPackType
        case InvalidUnpackType
        case InvalidParam
        case InvalidDType
        case JSONToStringError
        case StringToJSONError
        case PackStringError
        case DecodeBertError
        case DecodeObjectsError
    }

    var packerContext = [String: Any]()

    func pack(params: NSDictionary, modelSpec: JSON) throws -> IValue? {
        let modelSpecification: JSON
        do {
            modelSpecification = try applyParams(modelSpec: modelSpec, params: params)
        } catch {
            throw error
        }

        guard let type = modelSpec["pack"]["type"].string else {
            throw BaseIValuePackerError.InvalidPackType
        }
        switch type {
        case "tensor_from_image":
            return try packImage(modelSpec: modelSpecification, params: params)
        case "tensor_from_string":
            return try packString(modelSpec: modelSpecification, params: params)
        default:
            throw BaseIValuePackerError.InvalidTransformType
        }
    }

    func unpack(ivalue: IValue, params: NSDictionary, modelSpec: JSON) throws -> Any? {
        let unpack = modelSpec["unpack"]

        guard let type = unpack["type"].string,
              let key = unpack["key"].string else {
            throw BaseIValuePackerError.InvalidUnpackType
        }
        var value : Any? = nil
        switch type {
        case "tensor":
            value = try unpackTensor(ivalue: ivalue, unpack: unpack)
        case "argmax":
            value = try unpackArgmax(ivalue: ivalue, unpack: unpack)
        case "bert_decode_qa_answer":
            value = try decodeBertQAAnswer(ivalue: ivalue, unpack: unpack)
        case "bounding_boxes":
            value = try decodeObjects(ivalue: ivalue, unpack: unpack, params: params)
        default:
            throw BaseIValuePackerError.InvalidUnpackType
        }
        return [key: value]
    }

    private func packImage(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        do {
            if let imageId = (params["image"] as? NSDictionary)?["ID"] as? String, let image = try ImageModule.unwrapImage(imageId).getBitmap() {
                let transforms: JSON = modelSpec["pack"]["transforms"]
                guard let tensor = try doImageTransforms(transforms: transforms.arrayValue, image: image) else {
                  throw BaseIValuePackerError.ImageUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw BaseIValuePackerError.ImageUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.ImageUnwrapError
        }
    }

    private func doImageTransforms(transforms: Array<JSON>, image: CGImage) throws -> Tensor? {
        var newImage = image
        var tensor: Tensor? = nil
        for transform in transforms {
            let type = transform["type"].string
            let name = transform["name"].string

            switch type {
            case "image_to_image":
                var transformer: IImageTransform
                switch name {
                case "center_crop":
                    transformer = try CenterCropTransform.parse(transform: transform)
                case "scale":
                    transformer = try ScaleTransform.parse(transform: transform)
                default:
                    throw BaseIValuePackerError.InvalidImageToImageName
                }
                newImage = try transformer.transform(bitmap: newImage)
            case "image_to_tensor":
                var transformer: IImageToTensorTransform
                switch name{
                case "rgb_norm":
                    transformer = try RGBNormTransform.parse(transform: transform)
                case "greyscale_norm":
                    transformer = try GreyScaleNormTransform.parse(transform: transform)
                default:
                    throw BaseIValuePackerError.InvalidImageToTensorName
                }
                tensor = transformer.transform(bitmap: newImage)
            default:
                throw BaseIValuePackerError.InvalidTransformType
            }
        }
        return tensor
    }

    private func applyParams(modelSpec: JSON, params: NSDictionary) throws -> JSON {
        guard var specSrc = modelSpec.rawString() else {
            throw BaseIValuePackerError.JSONToStringError
        }

        for (key, value) in params {
            if let key = key as? String, let value = value as? String ?? (value as? NSNumber)?.stringValue {
                specSrc = specSrc.replacingOccurrences(of: "$\(key)", with: value)
            } else {
                if let key = key as? String {
                    if key != "image" {
                        throw BaseIValuePackerError.InvalidParam
                    }
                } else {
                    throw BaseIValuePackerError.InvalidParam
                }
            }
        }

        do {
            let spec = try JSON(data: Data(specSrc.utf8))
            return spec
        } catch {
            throw BaseIValuePackerError.StringToJSONError
        }
    }

    private func unpackTensor(ivalue: IValue, unpack: JSON) throws -> [Any] {
        let dtype = unpack["dtype"].string
        switch dtype {
        case "float":
            return ivalue.toTensor()?.getDataAsArray() ?? []
        default:
            throw BaseIValuePackerError.InvalidDType
        }
    }

    private func argmax(array: [Any]?, dtype: PTMTensorType?) -> Int {
        guard let array = array, let dtype = dtype else {
            return 0
        }

        switch dtype {
        case .float:
            var max = -MAXFLOAT;
            var ret = -1;
            for (i, item) in array.enumerated() {
                let num = item as! Float32
                if (num > max) {
                  ret = i;
                  max = num;
                }
            }
            return ret;
        default:
            return 0
        }
    }

    private func unpackArgmax(ivalue: IValue, unpack: JSON) throws -> Int {
        let dtype = unpack["dtype"].string
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            let array = tensor?.getDataAsArray()
            return argmax(array: array, dtype: tensor?.dtype)
        default:
            throw BaseIValuePackerError.InvalidDType
        }
    }

    private func packString(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        let pack = modelSpec["pack"]
        let tokenizer = pack["tokenizer"].string
        switch tokenizer {
        case "bert":
            guard let vocabulary = modelSpec["vocabulary_bert"].string else {
                throw BaseIValuePackerError.PackStringError
            }
            let bertTokenizer = try BertTokenizer(vocabulary: vocabulary)
            var tokenIds = try bertTokenizer.tokenize(content: pack["string"].stringValue, modelInputLength: pack["model_input_length"].intValue)
            packerContext["bert_tokenizer"] = bertTokenizer
            packerContext["token_ids"] = tokenIds
            guard let tensor = Tensor.fromBlob(data: &tokenIds, shape: [1, NSNumber(value: tokenIds.count)], dtype: .long) else {
                throw BaseIValuePackerError.PackStringError
            }
            return IValue.fromTensor(tensor)
        default:
            throw BaseIValuePackerError.PackStringError
        }
    }

    private func decodeBertQAAnswer(ivalue: IValue, unpack: JSON) throws -> String {
        guard let bertTokenizer = packerContext["bert_tokenizer"] as? BertTokenizer,
              let tokenIds = packerContext["token_ids"] as? [Int] else {
            throw BaseIValuePackerError.DecodeBertError
        }

        guard let map = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.DecodeBertError
        }

        guard let startLogitTensor = map["start_logits"]?.toTensor(),
              let endLogitTensor = map["end_logits"]?.toTensor() else {
            throw BaseIValuePackerError.DecodeBertError
        }

        let startLogits = startLogitTensor.getDataAsArrayBert()
        let endLogits = endLogitTensor.getDataAsArrayBert()
        let startIdx = argmax(array: startLogits, dtype: startLogitTensor.dtype)
        let endIdx = argmax(array: endLogits, dtype: endLogitTensor.dtype)

        if startIdx > endIdx {
            throw BaseIValuePackerError.DecodeBertError
        }

        let tokenIdRange = Array(tokenIds[startIdx...endIdx])
        return try bertTokenizer.decode(tokenIds: tokenIdRange)
    }

    private func decodeObjects(ivalue: IValue, unpack: JSON, params: NSDictionary) throws -> [Any] {
        guard let map = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.DecodeObjectsError
        }

        guard let predLogitsTensor = map["pred_logits"]?.toTensor(),
              let predBoxesTensor = map["pred_boxes"]?.toTensor(),
              let probabilityThreshold = params["probabilityThreshold"] as? Double,
              let classes = unpack["classes"].array else {
            throw BaseIValuePackerError.DecodeObjectsError
        }

        guard let confidencesTensor = predLogitsTensor.getDataAsArray(),
              let locationsTensor = predBoxesTensor.getDataAsArray() else {
            throw BaseIValuePackerError.DecodeObjectsError
        }

        let confidencesShape = predLogitsTensor.shape
        let numClasses = confidencesShape[2].intValue
        let locationsShape = predBoxesTensor.shape

        var result = [Any]()

        for i in 0..<confidencesShape[1].intValue {
            let scores = softmax(confidences: confidencesTensor, from: i * numClasses, to: (i + 1) * numClasses)

            var maxProb = scores[0]
            var maxIndex = -1
            for j in 0..<scores.count {
                if scores[j] > maxProb {
                    maxProb = scores[j]
                    maxIndex = j
                }
            }

            if maxProb <= probabilityThreshold || maxIndex >= classes.count {
                continue
            }

            var match = [String : Any]()
            match["objectClass"] = classes[maxIndex].stringValue

            let locationsFrom = i * locationsShape[2].intValue
            var bounds = [Double]()
            bounds.append(locationsTensor[locationsFrom].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 1].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 2].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 3].doubleValue)
            match["bounds"] = bounds

            result.append(match)
        }

        return result
    }

    func softmax(confidences: [NSNumber], from: Int, to: Int) -> [Double] {
        var softmax = [Double](repeating: 0.0, count: (to - from))
        var expSum = 0.0

        for i in from..<to {
            let expValue = exp(confidences[i].doubleValue)
            softmax[i - from] = expValue
            expSum += expValue
        }

        for i in 0..<softmax.count {
            softmax[i] /= expSum
        }

        return softmax
    }

}
