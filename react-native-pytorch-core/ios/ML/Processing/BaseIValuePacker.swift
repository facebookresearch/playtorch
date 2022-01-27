/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class BaseIValuePacker {

    enum BaseIValuePackerError: Error {
        case imageUnwrapError
        case invalidImageToImageName
        case invalidImageToTensorName
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

    var packerContext = [String: Any]()

    func pack(params: NSDictionary, modelSpec: JSON) throws -> IValue? {
        let modelSpecification: JSON
        do {
            modelSpecification = try BaseIValuePacker.applyParams(modelSpec: modelSpec, params: params)
        } catch {
            throw error
        }

        guard let type = modelSpec["pack"]["type"].string else {
            throw BaseIValuePackerError.invalidPackType
        }
        switch type {
        case "tensor_from_image":
            return try packImage(modelSpec: modelSpecification, params: params)
        case "tensor_from_string":
            return try packString(modelSpec: modelSpecification, params: params)
        case "tensor_from_audio":
            return try packAudio(modelSpec: modelSpecification, params: params)
        default:
            throw BaseIValuePackerError.invalidTransformType
        }
    }

    func unpack(ivalue: IValue, params: NSDictionary, modelSpec: JSON) throws -> [String: Any] {
        let unpack = modelSpec["unpack"]

        guard let type = unpack["type"].string else {
            throw BaseIValuePackerError.invalidUnpackType
        }

        var map: [String: Any] = [String: Any]()
        switch type {
        case "tensor":
            try unpackTensor(ivalue: ivalue, unpack: unpack, map: &map)
        case "argmax":
            try unpackArgmax(ivalue: ivalue, unpack: unpack, map: &map)
        case "tensor_to_image":
            try unpackTensorToImage(ivalue: ivalue, unpack: unpack, map: &map)
        case "bert_decode_qa_answer":
            try decodeBertQAAnswer(ivalue: ivalue, unpack: unpack, map: &map)
        case "bounding_boxes":
            try decodeObjects(ivalue: ivalue, unpack: unpack, params: params, map: &map)
        case "string":
            try decodeTensorToString(ivalue: ivalue, unpack: unpack, map: &map)
        default:
            throw BaseIValuePackerError.invalidUnpackType
        }
        return map
    }

    private func packImage(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        do {
            if let imageId = (params["image"] as? NSDictionary)?["ID"] as? String,
               let image = try ImageModule.unwrapImage(imageId).getBitmap() {
                let transforms: JSON = modelSpec["pack"]["transforms"]
                guard let tensor = try doImageTransforms(transforms: transforms.arrayValue, image: image) else {
                  throw BaseIValuePackerError.imageUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw BaseIValuePackerError.imageUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.imageUnwrapError
        }
    }

    private func packAudio(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        do {
            if let audioId = (params["audio"] as? NSDictionary)?["ID"] as? String {
                let audio = try AudioModule.unwrapAudio(audioId)

                let MAXVALUE = 32767
                var floatArray: [Float] = []
                for dat in audio.getData() {
                    floatArray.append(Float(dat) / Float(MAXVALUE))
                }

                guard let tensor = Tensor.fromBlob(data: &floatArray,
                                                   shape: [1, NSNumber(value: 16000*5)],
                                                   dtype: .float) else {
                    throw BaseIValuePackerError.audioUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw BaseIValuePackerError.audioUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.audioUnwrapError
        }
    }

    private func doImageTransforms(transforms: [JSON], image: CGImage) throws -> Tensor? {
        var newImage = image
        var tensor: Tensor?
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
                    throw BaseIValuePackerError.invalidImageToImageName
                }
                newImage = try transformer.transform(bitmap: newImage)
            case "image_to_tensor":
                var transformer: IImageToTensorTransform
                switch name {
                case "rgb_norm":
                    transformer = try RGBNormTransform.parse(transform: transform)
                case "greyscale_norm":
                    transformer = try GreyScaleNormTransform.parse(transform: transform)
                default:
                    throw BaseIValuePackerError.invalidImageToTensorName
                }
                tensor = transformer.transform(bitmap: newImage)
            default:
                throw BaseIValuePackerError.invalidTransformType
            }
        }
        return tensor
    }

    private static func applyParams(modelSpec: JSON, params: NSDictionary) throws -> JSON {
        guard var tmpSrcSpec = modelSpec.rawString() else {
            throw BaseIValuePackerError.JSONToStringError
        }
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

    private func unpackTensor(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws {
        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            let array = tensor?.getDataAsArray() ?? []
            map[key] = array
        default:
            throw BaseIValuePackerError.invalidDType
        }
    }

    private func argmax(array: [Any]?, dtype: PTMTensorType?) -> Int {
        guard let array = array, let dtype = dtype else {
            return 0
        }

        switch dtype {
        case .float:
            var max = -MAXFLOAT
            var ret = -1
            for (idx, item) in array.enumerated() {
                guard let num = item as? Float32 else {
                    continue
                }
                if num > max {
                  ret = idx
                  max = num
                }
            }
            return ret
        default:
            return 0
        }
    }

    private func unpackArgmax(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws {
        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }
        let valueKey = unpack["valueKey"].string
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            guard let array = tensor?.getDataAsArray() else {
                throw BaseIValuePackerError.invalidParam
            }
            let maxIdx = argmax(array: array, dtype: tensor?.dtype)
            map[key] = maxIdx
            if valueKey != nil {
                let softmaxData = softmax(data: array)
                map[valueKey!] = softmaxData[maxIdx]
            }
        default:
            throw BaseIValuePackerError.invalidDType
        }
    }

    private func unpackTensorToImage(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let tensor = ivalue.toTensor() else {
            throw BaseIValuePackerError.invalidUnpackType
        }
        guard let cgImage = try tensorToBitmap(tensor: tensor) else {
            throw BaseIValuePackerError.invalidUnpackType
        }
        let image = Image(image: cgImage)
        let ref = JSContext.wrapObject(object: image).getJSRef()
        map[key] = ref
    }

    private func tensorToBitmap(tensor: Tensor) throws -> CGImage? {
        guard let data = tensor.getDataAsArray() as? [Float32] else {
            throw BaseIValuePackerError.encodeImageError
        }
        let shape = tensor.shape

        let width = shape[3].intValue
        let height = shape[2].intValue

        // Determine the min/max value of data
        var max: Float32 = 0
        var min: Float32 = Float32.greatestFiniteMagnitude
        for val in data {
            if val > max {
              max = val
            }
            if val < min {
              min = val
            }
        }

        let delta = (max - min)
        var rgba: [UInt8] = [UInt8](repeating: 0, count: 4 * width * height)
        for idx in 0..<(width * height) {
            rgba[4 * idx] = (UInt8) ((data[idx] - min) / delta * 255)
            rgba[4 * idx + 1] = (UInt8) ((data[width * height + idx] - min) / delta * 255)
            rgba[4 * idx + 2] = (UInt8) ((data[width * height * 2 + idx] - min) / delta * 255)
            rgba[4 * idx + 3] = 255
        }

        let dataForProvider: Data = Data(rgba)
        let bytesPerPixel = 4
        let bitsPerPixel = 32
        let bytesPerRow = bytesPerPixel * width
        let bitsPerComponent = 8
        let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
        let provider: CGDataProvider! = CGDataProvider(data: dataForProvider as CFData)

        let cgImage = CGImage(
            width: width,
            height: height,
            bitsPerComponent: bitsPerComponent,
            bitsPerPixel: bitsPerPixel,
            bytesPerRow: bytesPerRow,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: bitmapInfo,
            provider: provider,
            decode: nil,
            shouldInterpolate: false,
            intent: .defaultIntent
        )
        return cgImage
    }

    private func packString(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        let pack = modelSpec["pack"]
        let tokenizer = pack["tokenizer"].string
        switch tokenizer {
        case "bert":
            guard let vocabulary = modelSpec["vocabulary_bert"].string else {
                throw BaseIValuePackerError.packStringError
            }
            let bertTokenizer = try BertTokenizer(vocabulary: vocabulary)
            var tokenIds = try bertTokenizer.tokenize(content: pack["string"].stringValue,
                                                      modelInputLength: pack["model_input_length"].intValue)
            packerContext["bert_tokenizer"] = bertTokenizer
            packerContext["token_ids"] = tokenIds
            guard let tensor = Tensor.fromBlob(data: &tokenIds,
                                               shape: [1, NSNumber(value: tokenIds.count)],
                                               dtype: .long) else {
                throw BaseIValuePackerError.packStringError
            }
            return IValue.fromTensor(tensor)
        default:
            throw BaseIValuePackerError.packStringError
        }
    }

    private func decodeTensorToString(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let answer = ivalue.toString() else {
            throw BaseIValuePackerError.decodeStringError
        }
        map[key] = answer
    }

    private func decodeBertQAAnswer(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let bertTokenizer = packerContext["bert_tokenizer"] as? BertTokenizer,
              let tokenIds = packerContext["token_ids"] as? [Int] else {
            throw BaseIValuePackerError.decodeBertError
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.decodeBertError
        }

        guard let startLogitTensor = dict["start_logits"]?.toTensor(),
              let endLogitTensor = dict["end_logits"]?.toTensor() else {
            throw BaseIValuePackerError.decodeBertError
        }

        let startLogits = startLogitTensor.getDataAsArrayBert()
        let endLogits = endLogitTensor.getDataAsArrayBert()
        let startIdx = argmax(array: startLogits, dtype: startLogitTensor.dtype)
        let endIdx = argmax(array: endLogits, dtype: endLogitTensor.dtype)

        // Return null (i.e., no answer found) if start index is outside the
        // lower bounds of the tokens or if start index is the same as the end
        // index.
        if startIdx < 0 || startIdx == endIdx {
            // Setting the answer nil is not necessarily required, but it is
            // explicit that the returned answer is nil (undefined in JS)
            map[key] = nil
            return
        }

        if startIdx > endIdx {
            throw BaseIValuePackerError.decodeBertError
        }

        let tokenIdRange = Array(tokenIds[startIdx...endIdx])
        do {
            let text = try bertTokenizer.decode(tokenIds: tokenIdRange)
            map[key] = text
        } catch {
            throw BaseIValuePackerError.decodeBertError
        }
    }

    private func decodeObjects(ivalue: IValue, unpack: JSON, params: NSDictionary, map: inout [String: Any]) throws {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.missingKeyParam
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        guard let predLogitsTensor = dict["pred_logits"]?.toTensor(),
              let predBoxesTensor = dict["pred_boxes"]?.toTensor(),
              let probabilityThreshold = params["probabilityThreshold"] as? Double,
              let classes = unpack["classes"].array else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        guard let confidencesTensor = predLogitsTensor.getDataAsArray(),
              let locationsTensor = predBoxesTensor.getDataAsArray() else {
            throw BaseIValuePackerError.decodeObjectsError
        }

        let confidencesShape = predLogitsTensor.shape
        let numClasses = confidencesShape[2].intValue
        let locationsShape = predBoxesTensor.shape

        var result = [Any]()

        for cIdx in 0..<confidencesShape[1].intValue {
            let scores = softmax(data: confidencesTensor,
                                 fromIndex: cIdx * numClasses,
                                 toIndex: (cIdx + 1) * numClasses)

            var maxProb = scores[0]
            var maxIndex = -1
            for sIdx in 0..<scores.count where scores[sIdx] > maxProb {
                maxProb = scores[sIdx]
                maxIndex = sIdx
            }

            if maxProb <= probabilityThreshold || maxIndex >= classes.count {
                continue
            }

            var match = [String: Any]()
            match["objectClass"] = classes[maxIndex].stringValue

            let locationsFrom = cIdx * locationsShape[2].intValue
            var bounds = [Double]()
            bounds.append(locationsTensor[locationsFrom].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 1].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 2].doubleValue)
            bounds.append(locationsTensor[locationsFrom + 3].doubleValue)
            match["bounds"] = bounds

            result.append(match)
        }

        map[key] = result
    }

    func softmax(data: [NSNumber]) -> [Double] {
        return softmax(data: data, fromIndex: 0, toIndex: data.count)
    }

    func softmax(data: [NSNumber], fromIndex: Int, toIndex: Int) -> [Double] {
        var softmax = [Double](repeating: 0.0, count: (toIndex - fromIndex))
        var expSum = 0.0

        for val in fromIndex..<toIndex {
            let expValue = exp(data[val].doubleValue)
            softmax[val - fromIndex] = expValue
            expSum += expValue
        }

        for val in 0..<softmax.count {
            softmax[val] /= expSum
        }

        return softmax
    }
}
