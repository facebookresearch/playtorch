/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <ATen/Functions.h>
#include <string>

#include "../torch/utils/helpers.h"
#include "TransformsHostObject.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace vision {
namespace transforms {

using namespace facebook;

static inline std::array<int, 2> getImageSize(torch_::Tensor& tensor) {
  auto sizes = tensor.sizes();
  auto length = sizes.size();
  std::array<int, 2> size;
  size[0] = sizes[length - 1];
  size[1] = sizes[length - 2];
  return size;
}

// TransformsHostObject Method Name
static const std::string CENTER_CROP = "centerCrop";
static const std::string NORMALIZE = "normalize";
static const std::string RESIZE = "resize";

// TransformsHostObject Property Names
// empty

// TransformsHostObject Properties
// empty
static const std::vector<std::string> PROPERTIES = {};

// TransformsHostObject Methods
const std::vector<std::string> METHODS = {CENTER_CROP, NORMALIZE, RESIZE};

TransformsHostObject::TransformsHostObject(jsi::Runtime& runtime)
    : centerCrop_(createCenterCrop(runtime)),
      normalize_(createNormalize(runtime)),
      resize_(createResize(runtime)) {}

std::vector<jsi::PropNameID> TransformsHostObject::getPropertyNames(
    jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  for (std::string property : PROPERTIES) {
    result.push_back(jsi::PropNameID::forUtf8(rt, property));
  }
  for (std::string method : METHODS) {
    result.push_back(jsi::PropNameID::forUtf8(rt, method));
  }
  return result;
}

jsi::Value TransformsHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == CENTER_CROP) {
    return jsi::Value(runtime, centerCrop_);
  } else if (name == NORMALIZE) {
    return jsi::Value(runtime, normalize_);
  } else if (name == RESIZE) {
    return jsi::Value(runtime, resize_);
  }

  return jsi::Value::undefined();
}

/**
 * Crops the given torch Tensor at the center, it is expected to have […, H, W]
 * shape, where … means an arbitrary number of leading dimensions.
 *
 * TODO(T112483016) If image size is smaller than output size along any edge,
 * image is padded with 0 and then center cropped.
 *
 * Original function:
 * https://github.com/pytorch/vision/blob/main/torchvision/transforms/functional.py#L515-L553
 */
jsi::Function TransformsHostObject::createCenterCrop(jsi::Runtime& runtime) {
  auto centerCropFactoryFunc = [](jsi::Runtime& runtime,
                                  const jsi::Value& thisValue,
                                  const jsi::Value* arguments,
                                  size_t count) -> jsi::Value {
    int width = -1;
    int height = -1;
    if (count > 0) {
      width = arguments[0].asNumber();
    }
    if (count > 1) {
      height = arguments[1].asNumber();
    }

    auto centerCropFunc = [width, height](
                              jsi::Runtime& innerRuntime,
                              const jsi::Value& innerThisValue,
                              const jsi::Value* innerArguments,
                              size_t innerCount) -> jsi::Value {
      if (innerCount != 1) {
        throw jsi::JSError(innerRuntime, "Tensor required as argument");
      }

      auto tensorHostObject =
          utils::helpers::parseTensor(innerRuntime, &innerArguments[0]);
      auto tensor = tensorHostObject->tensor;

      // Get the size of the image tensor -> […, H, W]
      auto size = getImageSize(tensor);

      auto cropHeight = height;
      auto cropWidth = width;
      if (cropWidth == -1) {
        auto minSize = std::min(size[0], size[1]);
        cropHeight = minSize;
        cropWidth = minSize;
      } else if (cropHeight == -1) {
        cropHeight = cropWidth;
      }

      auto cropTop = (size[1] - cropHeight) / 2;
      auto cropLeft = (size[0] - cropWidth) / 2;

      // Crop image tensor by narrowing the tensor along the last two
      // dimensions.
      auto dims = tensor.ndimension();
      tensor = tensor.narrow(dims - 2, cropTop, cropHeight)
                   .narrow(dims - 1, cropLeft, cropWidth);

      auto centerCroppedTensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(
              innerRuntime, tensor);
      return jsi::Object::createFromHostObject(
          innerRuntime, centerCroppedTensorHostObject);
    };

    return jsi::Function::createFromHostFunction(
        runtime,
        jsi::PropNameID::forUtf8(
            runtime,
            "CenterCrop(" + std::to_string(width) + ", " +
                std::to_string(height) + ")"),
        1,
        centerCropFunc);
  };

  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, CENTER_CROP),
      1,
      centerCropFactoryFunc);
}

/**
 * Normalize a tensor image with mean and standard deviation. Given mean:
 * (mean[1],...,mean[n]) and std: (std[1],..,std[n]) for n channels, this
 * transform will normalize each channel of the input torch.*Tensor i.e.,
 * output[channel] = (input[channel] - mean[channel]) / std[channel]
 *
 * Original function:
 * https://github.com/pytorch/vision/blob/main/torchvision/transforms/functional.py#L320-L364
 */
jsi::Function TransformsHostObject::createNormalize(jsi::Runtime& runtime) {
  auto normalizeFactoryFunc = [](jsi::Runtime& runtime,
                                 const jsi::Value& thisValue,
                                 const jsi::Value* arguments,
                                 size_t count) -> jsi::Value {
    std::vector<double> dataMean =
        utils::helpers::parseJSIArrayData(runtime, arguments[0]);
    std::vector<int64_t> shapeMean =
        utils::helpers::parseJSIArrayShape(runtime, arguments[0]);
    auto mean = torch_::tensor(dataMean).reshape(at::IntArrayRef(shapeMean));

    std::vector<double> dataStd =
        utils::helpers::parseJSIArrayData(runtime, arguments[1]);
    std::vector<int64_t> shapeStd =
        utils::helpers::parseJSIArrayShape(runtime, arguments[1]);
    auto std = torch_::tensor(dataStd).reshape(at::IntArrayRef(shapeStd));

    bool inplace = false;
    if (count == 3) {
      if (!arguments[2].isBool()) {
        throw jsi::JSError(
            runtime, "The 3rd argument for inplace needs to be a boolean");
      }
      inplace = arguments[2].getBool();
    }

    auto normalizeFunc = [mean, std, inplace](
                             jsi::Runtime& innerRuntime,
                             const jsi::Value& innerThisValue,
                             const jsi::Value* innerArguments,
                             size_t innerCount) -> jsi::Value {
      if (innerCount != 1) {
        throw jsi::JSError(innerRuntime, "Tensor required as argument");
      }

      auto tensorHostObject =
          utils::helpers::parseTensor(innerRuntime, &innerArguments[0]);
      auto tensor = tensorHostObject->tensor;

      if (!inplace) {
        tensor = tensor.clone();
      }

      torch_::Tensor meanTensor;
      torch_::Tensor stdTensor;
      if (mean.ndimension() == 1) {
        meanTensor = mean.view({-1, 1, 1});
      }
      if (std.ndimension() == 1) {
        stdTensor = std.view({-1, 1, 1});
      }

      tensor.sub_(meanTensor).div_(stdTensor);

      auto normalizedTensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(
              innerRuntime, tensor);
      return jsi::Object::createFromHostObject(
          innerRuntime, normalizedTensorHostObject);
    };

    return jsi::Function::createFromHostFunction(
        runtime,
        jsi::PropNameID::forUtf8(runtime, "Normalize_Tensor"),
        1,
        normalizeFunc);
  };

  return jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forUtf8(runtime, NORMALIZE),
      2,
      normalizeFactoryFunc);
}

/**
 * Resize the input image to the given size. It is expected to have […, H, W]
 * shape, where … means an arbitrary number of leading dimensions.
 *
 * Original function:
 * https://pytorch.org/vision/main/generated/torchvision.transforms.Resize.html
 */
jsi::Function TransformsHostObject::createResize(jsi::Runtime& runtime) {
  auto resizeFactoryFunc = [](jsi::Runtime& runtime,
                              const jsi::Value& thisValue,
                              const jsi::Value* arguments,
                              size_t count) -> jsi::Value {
    auto size = arguments[0].asNumber();

    auto resizeFunc = [size](
                          jsi::Runtime& innerRuntime,
                          const jsi::Value& innerThisValue,
                          const jsi::Value* innerArguments,
                          size_t innerCount) -> jsi::Value {
      if (innerCount != 1) {
        throw jsi::JSError(innerRuntime, "Tensor required as argument");
      }

      auto tensorHostObject =
          utils::helpers::parseTensor(innerRuntime, &innerArguments[0]);
      auto tensor = tensorHostObject->tensor;

      auto ndim = tensor.ndimension();

      // Unsqueeze if ndim is 3 to work with upsample_bilinear2d, which
      // requires 4 dims.
      if (ndim == 3) {
        tensor = tensor.unsqueeze(0);
      }

      std::vector<int64_t> resizeSize;
      resizeSize.push_back(size);
      resizeSize.push_back(size);

      auto resizedTensor = at::upsample_bilinear2d(tensor, resizeSize, false);

      // Undo unsqueeze if input tensor dimension was 3
      if (ndim == 3) {
        resizedTensor = resizedTensor.squeeze(0);
      }

      auto resizedTensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(
              innerRuntime, resizedTensor);
      return jsi::Object::createFromHostObject(
          innerRuntime, resizedTensorHostObject);
    };

    return jsi::Function::createFromHostFunction(
        runtime,
        jsi::PropNameID::forUtf8(runtime, "Resize_Tensor"),
        1,
        resizeFunc);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RESIZE), 1, resizeFactoryFunc);
}

} // namespace transforms
} // namespace vision
} // namespace torchlive
