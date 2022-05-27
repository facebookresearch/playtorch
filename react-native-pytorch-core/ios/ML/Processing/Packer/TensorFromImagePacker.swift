/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Foundation
import SwiftyJSON

class TensorFromImagePacker: Packer {

    enum TensorFromImageError: Error {
        case imageUnwrapError
        case invalidImageToImageName
        case invalidImageToTensorName
    }

    func pack(modelSpec: JSON, params: NSDictionary, packerContext: PackerContext) throws -> IValue? {
        do {
            if let imageId = (params["image"] as? NSDictionary)?["ID"] as? String,
               let image = try JSContextUtils.unwrapObject(imageId, IImage.self).getBitmap() {
                let transforms: JSON = modelSpec["pack"]["transforms"]
                guard let tensor = try doImageTransforms(transforms: transforms.arrayValue, image: image) else {
                  throw TensorFromImageError.imageUnwrapError
                }
                return IValue.fromTensor(tensor)
            } else {
                throw TensorFromImageError.imageUnwrapError
            }
        } catch {
            throw TensorFromImageError.imageUnwrapError
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
                    throw TensorFromImageError.invalidImageToImageName
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
                    throw TensorFromImageError.invalidImageToTensorName
                }
                tensor = transformer.transform(bitmap: newImage)
            default:
                throw BaseIValuePackerError.invalidTransformType
            }
        }
        return tensor
    }
}
