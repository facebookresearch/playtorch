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
        case ImageUnwrapError
        case InvalidImageToImageName
        case InvalidImageToTensorName
        case InvalidTransformType
        case InvalidPackType
        case InvalidUnpackType
        case InvalidParam
        case MissingKeyParam
        case InvalidDType
        case JSONToStringError
        case StringToJSONError
        case PackStringError
        case DecodeBertError
        case DecodeObjectsError
        case AudioUnwrapError
        case DecodeStringError
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
        case "tensor_from_audio":
            return try packAudio(modelSpec: modelSpecification, params: params)
        default:
            throw BaseIValuePackerError.InvalidTransformType
        }
    }

    func unpack(ivalue: IValue, params: NSDictionary, modelSpec: JSON) throws -> [String: Any] {
        let unpack = modelSpec["unpack"]

        guard let type = unpack["type"].string else {
            throw BaseIValuePackerError.InvalidUnpackType
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
            throw BaseIValuePackerError.InvalidUnpackType
        }
        return map
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

    private func packAudio(modelSpec: JSON, params: NSDictionary) throws -> IValue? {
        do {
            if let audioId = (params["audio"] as? NSDictionary)?["ID"] as? String {
                let audio = try AudioModule.unwrapAudio(audioId)

                let MAX_VALUE = 32767
                var floatArray : [Float] = []
                for n in audio.getData() {
                    floatArray.append(Float(n) / Float(MAX_VALUE))
                }

                guard let tensor = Tensor.fromBlob(data: &floatArray, shape: [1, NSNumber(value: 16000*5)], dtype: .float) else {
                    throw BaseIValuePackerError.AudioUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw BaseIValuePackerError.AudioUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.AudioUnwrapError
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
                    if key != "image" && key != "audio" {
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

    private func unpackTensor(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws -> Void {
        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            let array = tensor?.getDataAsArray() ?? []
            map[key] = array
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

    private func unpackArgmax(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws -> Void {
        let dtype = unpack["dtype"].string
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }
        let valueKey = unpack["valueKey"].string
        switch dtype {
        case "float":
            let tensor = ivalue.toTensor()
            guard let array = tensor?.getDataAsArray() else {
                throw BaseIValuePackerError.InvalidParam
            }
            let maxIdx = argmax(array: array, dtype: tensor?.dtype)
            map[key] = maxIdx
            if valueKey != nil {
                let softmaxData = softmax(data: array)
                map[valueKey!] = softmaxData[maxIdx]
            }
        default:
            throw BaseIValuePackerError.InvalidDType
        }
    }

    private func unpackTensorToImage(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws -> Void {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }

        guard let tensor = ivalue.toTensor() else {
            throw BaseIValuePackerError.InvalidUnpackType
        }
        guard let cgImage = tensorToBitmap(tensor: tensor) else {
            throw BaseIValuePackerError.InvalidUnpackType
        }
        let image = Image(image: cgImage)
        let ref = JSContext.wrapObject(object: image).getJSRef()
        map[key] = ref
    }

    private func tensorToBitmap(tensor: Tensor) -> CGImage? {
        let data = tensor.getDataAsArray() as! [Float32]
        let shape = tensor.shape

        let w = shape[3].intValue
        let h = shape[2].intValue

        // Determine the min/max value of data
        var max: Float32 = 0
        var min: Float32 = Float32.greatestFiniteMagnitude
        for f in data {
            if (f > max) {
              max = f
            }
            if (f < min) {
              min = f
            }
        }

        let delta = (max - min)
        var rgba: [UInt8] = [UInt8](repeating: 0, count: 4 * w * h)
        for i in 0..<(w * h) {
            rgba[4 * i] = (UInt8) ((data[i] - min) / delta * 255);
            rgba[4 * i + 1] = (UInt8) ((data[w * h + i] - min) / delta * 255);
            rgba[4 * i + 2] = (UInt8) ((data[w * h * 2 + i] - min) / delta * 255);
            rgba[4 * i + 3] = 255
        }

        let dataForProvider: Data = Data(rgba)
        let bytesPerPixel = 4
        let bitsPerPixel = 32
        let bytesPerRow = bytesPerPixel * w
        let bitsPerComponent = 8
        let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
        let provider: CGDataProvider! = CGDataProvider(data: dataForProvider as CFData)

        let cgImage = CGImage(
            width: w,
            height: h,
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

    private func decodeTensorToString(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws -> Void {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }

        guard let answer = ivalue.toString() else {
            throw BaseIValuePackerError.DecodeStringError
        }
        map[key] = answer
    }

    private func decodeBertQAAnswer(ivalue: IValue, unpack: JSON, map: inout [String: Any]) throws -> Void {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }

        guard let bertTokenizer = packerContext["bert_tokenizer"] as? BertTokenizer,
              let tokenIds = packerContext["token_ids"] as? [Int] else {
            throw BaseIValuePackerError.DecodeBertError
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.DecodeBertError
        }

        guard let startLogitTensor = dict["start_logits"]?.toTensor(),
              let endLogitTensor = dict["end_logits"]?.toTensor() else {
            throw BaseIValuePackerError.DecodeBertError
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
            throw BaseIValuePackerError.DecodeBertError
        }

        let tokenIdRange = Array(tokenIds[startIdx...endIdx])
        do {
            let text = try bertTokenizer.decode(tokenIds: tokenIdRange)
            map[key] = text
        }
        catch {
            throw BaseIValuePackerError.DecodeBertError
        }
    }

    private func decodeObjects(ivalue: IValue, unpack: JSON, params: NSDictionary, map: inout [String: Any]) throws -> Void {
        guard let key = unpack["key"].string else {
            throw BaseIValuePackerError.MissingKeyParam
        }

        guard let dict = ivalue.toDictStringKey() as [String: IValue]? else {
            throw BaseIValuePackerError.DecodeObjectsError
        }

        guard let predLogitsTensor = dict["pred_logits"]?.toTensor(),
              let predBoxesTensor = dict["pred_boxes"]?.toTensor(),
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
            let scores = softmax(data: confidencesTensor, from: i * numClasses, to: (i + 1) * numClasses)

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

        map[key] = result
    }

    func softmax(data: [NSNumber]) -> [Double] {
        return softmax(data: data, from: 0, to: data.count)
    }

    func softmax(data: [NSNumber], from: Int, to: Int) -> [Double] {
        var softmax = [Double](repeating: 0.0, count: (to - from))
        var expSum = 0.0

        for i in from..<to {
            let expValue = exp(data[i].doubleValue)
            softmax[i - from] = expValue
            expSum += expValue
        }

        for i in 0..<softmax.count {
            softmax[i] /= expSum
        }

        return softmax
    }

}
