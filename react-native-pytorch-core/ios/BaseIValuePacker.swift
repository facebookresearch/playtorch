/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation

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

    func pack(params: NSDictionary, modelSpec: ModelSpecification) throws -> Any? {
        var modelSpecification: ModelSpecification
        do {
            modelSpecification = try applyParams(modelSpec: modelSpec, params: params)
        } catch {
            throw error
        }
        switch modelSpec.pack.type {
        case "tensor_from_image":
            return try packImage(modelSpec: modelSpecification, params: params)
        default:
            throw BaseIValuePackerError.InvalidTransformType
        }
    }

    func unpack(outputs: TensorWrapper, modelSpec: ModelSpecification) throws -> Any? {
        do {
            switch modelSpec.unpack.type {
            case "argmax":
                return try [modelSpec.unpack.key : argmax(tensorWrapper: outputs)]
            default:
                throw BaseIValuePackerError.InvalidUnpackType
            }
        } catch {
            throw error
        }
    }

    func packImage(modelSpec: ModelSpecification, params: NSDictionary) throws -> Any? {
        do {
            if let imageId = (params["image"] as? NSDictionary)?["ID"] as? String, let image = try ImageModule.unwrapImage(imageId).getBitmap() {
                if let transforms = modelSpec.pack.transforms {
                    return try doImageTransforms(transforms: transforms, image: image)
                } else {
                    return image
                }
            } else {
                throw BaseIValuePackerError.ImageUnwrapError
            }
        } catch {
            throw BaseIValuePackerError.ImageUnwrapError
        }
    }

    func doImageTransforms(transforms: [ModelSpecification.Transform], image: CGImage) throws -> Any? {
        var newImage = image
        var iValue: Any? = nil
        for transform in transforms {
            switch transform.type {
            case "image_to_image":
                var transformer: IImageTransform
                switch transform.name {
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
                switch transform.name{
                case "rgb_norm":
                    transformer = try RGBNormTransform.parse(transform: transform)
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

    func applyParams(modelSpec: ModelSpecification, params: NSDictionary) throws -> ModelSpecification {
        var specSrc: String
        let jsonEncoder = JSONEncoder()
        do {
            specSrc = try String(decoding: jsonEncoder.encode(modelSpec), as: UTF8.self)
        } catch {
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
        let jsonDecoder = JSONDecoder()
        do {
            return try jsonDecoder.decode(ModelSpecification.self, from: Data(specSrc.utf8))
        } catch {
            throw BaseIValuePackerError.StringToJSONError
        }
    }

    private func argmax(tensorWrapper: TensorWrapper) throws -> Int {
        return Int(tensorWrapper.argmax());
    }

}
