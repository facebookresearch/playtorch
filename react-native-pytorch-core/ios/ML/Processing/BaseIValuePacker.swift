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
        case InvalidUnpackType
        case InvalidParam
        case JSONToStringError
        case StringToJSONError
    }

    func pack(params: NSDictionary, modelSpec: JSON) throws -> Any? {
        let modelSpecification: JSON
        do {
            modelSpecification = try applyParams(modelSpec: modelSpec, params: params)
        } catch {
            throw error
        }

        switch modelSpec["pack"]["type"].string {
        case "tensor_from_image":
            return try packImage(modelSpec: modelSpecification, params: params)
        default:
            throw BaseIValuePackerError.InvalidTransformType
        }
    }

    func unpack(outputs: TensorWrapper, modelSpec: JSON) throws -> Any? {
        do {
            let unpack = modelSpec["unpack"]
            let type = unpack["type"].string
            switch type {
            case "tensor":
                return [(unpack["key"].string) : outputs.toFloatArray()]
            case "argmax":
                return try [(unpack["key"].string) : argmax(tensorWrapper: outputs)]
            default:
                throw BaseIValuePackerError.InvalidUnpackType
            }
        } catch {
            throw error
        }
    }

    func packImage(modelSpec: JSON, params: NSDictionary) throws -> Any? {
        do {
            if let imageId = (params["image"] as? NSDictionary)?["ID"] as? String, let image = try ImageModule.unwrapImage(imageId).getBitmap() {
                let transforms: JSON = modelSpec["pack"]["transforms"]
                return try doImageTransforms(transforms: transforms.arrayValue, image: image)
            } else {
                throw BaseIValuePackerError.ImageUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.ImageUnwrapError
        }
    }

    func doImageTransforms(transforms: Array<JSON>, image: CGImage) throws -> Any? {
        var newImage = image
        var iValue: Any? = nil
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
                iValue = newImage
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
                iValue = transformer.transform(bitmap: newImage)
            default:
                throw BaseIValuePackerError.InvalidTransformType
            }
        }
        return iValue
    }

    func applyParams(modelSpec: JSON, params: NSDictionary) throws -> JSON {
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
        throw BaseIValuePackerError.StringToJSONError
    }

    private func argmax(tensorWrapper: TensorWrapper) throws -> Int {
        return Int(tensorWrapper.argmax());
    }
}
