/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <vector>

#include "../media/BlobHostObject.h"
#include "TensorHostObject.h"
#include "TorchHostObject.h"
#include "jit/JITHostObject.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

using namespace facebook;

// TorchHostObject Method Name
static const std::string ABS = "abs";
static const std::string ADD = "add";
static const std::string ARANGE = "arange";
static const std::string ARGMAX = "argmax";
static const std::string EMPTY = "empty";
static const std::string FROM_BLOB = "fromBlob";
static const std::string DIV = "div";
static const std::string MUL = "mul";
static const std::string PERMUTE = "permute";
static const std::string RAND = "rand";
static const std::string RANDINT = "randint";
static const std::string SOFTMAX = "softmax";
static const std::string SUB = "sub";
static const std::string TENSOR = "tensor";
static const std::string TOPK = "topk";
static const std::string ZEROS = "zeros";

// TorchHostObject Property Names
static const std::string JIT = "jit";

// TorchHostObject Properties
static const std::vector<std::string> PROPERTIES = {
    utils::constants::FLOAT32,
    utils::constants::FLOAT64,
    utils::constants::INT16,
    utils::constants::INT32,
    utils::constants::INT64,
    utils::constants::INT8,
    utils::constants::UINT8,
    JIT,
};

// TorchHostObject Methods
const std::vector<std::string> METHODS = {
    ABS,
    ADD,
    ARANGE,
    ARGMAX,
    EMPTY,
    FROM_BLOB,
    DIV,
    MUL,
    PERMUTE,
    RAND,
    RANDINT,
    SOFTMAX,
    SUB,
    TENSOR,
    TOPK,
    ZEROS,
};

TorchHostObject::TorchHostObject(
    jsi::Runtime& runtime,
    torchlive::RuntimeExecutor runtimeExecutor)
    : abs_(createAbs(runtime)),
      add_(createAdd(runtime)),
      arange_(createArange(runtime)),
      argmax_(createArgmax(runtime)),
      empty_(createEmpty(runtime)),
      fromBlob_(createFromBlob(runtime)),
      div_(createDiv(runtime)),
      mul_(createMul(runtime)),
      permute_(createPermute(runtime)),
      rand_(createRand(runtime)),
      randint_(createRandint(runtime)),
      softmax_(createSoftmax(runtime)),
      sub_(createSub(runtime)),
      tensor_(createTensor(runtime)),
      topk_(createTopK(runtime)),
      zeros_(createZeros(runtime)),
      runtimeExecutor_(runtimeExecutor) {}

std::vector<jsi::PropNameID> TorchHostObject::getPropertyNames(
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

jsi::Value TorchHostObject::get(
    jsi::Runtime& runtime,
    const jsi::PropNameID& propName) {
  auto name = propName.utf8(runtime);

  if (name == ABS) {
    return jsi::Value(runtime, abs_);
  } else if (name == ADD) {
    return jsi::Value(runtime, add_);
  } else if (name == ARANGE) {
    return jsi::Value(runtime, arange_);
  } else if (name == ARGMAX) {
    return jsi::Value(runtime, argmax_);
  } else if (name == DIV) {
    return jsi::Value(runtime, div_);
  } else if (name == EMPTY) {
    return jsi::Value(runtime, empty_);
  } else if (
      name == utils::constants::FLOAT32 || name == utils::constants::FLOAT) {
    return jsi::String::createFromAscii(runtime, utils::constants::FLOAT32);
  } else if (
      name == utils::constants::FLOAT64 || name == utils::constants::DOUBLE) {
    return jsi::String::createFromAscii(runtime, utils::constants::FLOAT64);
  } else if (name == utils::constants::INT8) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT8);
  } else if (name == FROM_BLOB) {
    return jsi::Value(runtime, fromBlob_);
  } else if (
      name == utils::constants::INT16 || name == utils::constants::SHORT) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT16);
  } else if (name == utils::constants::INT32 || name == utils::constants::INT) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT32);
  } else if (
      name == utils::constants::INT64 || name == utils::constants::LONG) {
    return jsi::String::createFromAscii(runtime, utils::constants::INT64);
  } else if (name == JIT) {
    auto jitHostObject = std::make_shared<torchlive::torch::jit::JITHostObject>(
        runtime, runtimeExecutor_);
    return jsi::Object::createFromHostObject(runtime, jitHostObject);
  } else if (name == MUL) {
    return jsi::Value(runtime, mul_);
  } else if (name == PERMUTE) {
    return jsi::Value(runtime, permute_);
  } else if (name == RAND) {
    return jsi::Value(runtime, rand_);
  } else if (name == RANDINT) {
    return jsi::Value(runtime, randint_);
  } else if (name == SOFTMAX) {
    return jsi::Value(runtime, softmax_);
  } else if (name == SUB) {
    return jsi::Value(runtime, sub_);
  } else if (name == utils::constants::UINT8) {
    return jsi::String::createFromAscii(runtime, utils::constants::UINT8);
  } else if (name == TENSOR) {
    return jsi::Value(runtime, tensor_);
  } else if (name == TOPK) {
    return jsi::Value(runtime, topk_);
  } else if (name == ZEROS) {
    return jsi::Value(runtime, zeros_);
  }

  return jsi::Value::undefined();
}

jsi::Function TorchHostObject::createAbs(jsi::Runtime& runtime) {
  auto absFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    if (count != 1) {
      throw jsi::JSError(
          runtime,
          "torch.abs expect 1 argument, but " + std::to_string(count) +
              " are given.");
    }
    auto inputTensorHostObject =
        utils::helpers::parseTensor(runtime, &arguments[0]);
    auto outputTensor = torch_::abs(inputTensorHostObject->tensor);
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, outputTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ADD), 1, absFunc);
}

jsi::Function TorchHostObject::createAdd(jsi::Runtime& runtime) {
  auto addFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1Tensor = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime,
        arguments,
        count,
        &operand1Tensor,
        &operand2Tensor,
        &operand2Number);

    auto alphaValue = utils::helpers::parseKeywordArgument(
        runtime, arguments, 2, count, "alpha");
    auto alphaScalarValue = alphaValue.isUndefined()
        ? at::Scalar(1)
        : at::Scalar(alphaValue.asNumber());

    torch_::Tensor resultTensor;
    if (operand2Number != nullptr) {
      resultTensor = torch_::add(
          operand1Tensor->tensor, *operand2Number, alphaScalarValue);
      delete[] operand2Number;
    } else {
      resultTensor = torch_::add(
          operand1Tensor->tensor, operand2Tensor->tensor, alphaScalarValue);
    }

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ADD), 1, addFunc);
}

jsi::Function TorchHostObject::createArange(jsi::Runtime& runtime) {
  auto arangeImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    if (count == 0) {
      throw jsi::JSError(runtime, "This function requires at least 1 argument");
    }

    auto positionalArgCount = count;
    torch_::TensorOptions tensorOptions = torch_::TensorOptions();
    if (arguments[count - 1].isObject()) {
      positionalArgCount--;
      tensorOptions = utils::helpers::parseTensorOptions(
          runtime, arguments, count - 1, count);
    }

    auto end = (positionalArgCount > 1) ? arguments[1].asNumber()
                                        : arguments[0].asNumber();
    auto start = (positionalArgCount > 1) ? arguments[0].asNumber() : 0;
    auto step = (positionalArgCount > 2) ? arguments[2].asNumber() : 1;

    auto tensor = torch_::arange(start, end, step, tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ARANGE), 1, arangeImpl);
}

jsi::Function TorchHostObject::createRand(jsi::Runtime& runtime) {
  auto randImpl = [](jsi::Runtime& runtime,
                     const jsi::Value& thisValue,
                     const jsi::Value* arguments,
                     size_t count) {
    jsi::Array jsShape = arguments[0].asObject(runtime).asArray(runtime);
    auto shapeLength = jsShape.size(runtime);
    std::vector<int64_t> dims = {};
    for (int i = 0; i < shapeLength; i++) {
      int x = jsShape.getValueAtIndex(runtime, i).asNumber();
      dims.push_back(x);
    }

    torch_::TensorOptions tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 1, count);

    auto tensor = torch_::rand(c10::ArrayRef<int64_t>(dims), tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RAND), 2, randImpl);
}

jsi::Function TorchHostObject::createArgmax(jsi::Runtime& runtime) {
  auto argmaxImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    auto object = arguments[0].asObject(runtime);
    if (!object.isHostObject(runtime)) {
      throw std::runtime_error("first argument must be a tensor");
    }

    auto hostObject = object.getHostObject(runtime);
    auto tensorHostObject =
        dynamic_cast<torchlive::torch::TensorHostObject*>(hostObject.get());
    if (tensorHostObject != nullptr) {
      auto tensor = tensorHostObject->tensor;
      auto max = torch_::argmax(tensor);
      return jsi::Value(max.item<int>());
    } else {
      // It's a different kind of HostObject, which is not supported.
      throw std::runtime_error("unkown HostObject");
    }
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ARGMAX), 1, argmaxImpl);
}

jsi::Function TorchHostObject::createDiv(jsi::Runtime& runtime) {
  auto divFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1Tensor = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime,
        arguments,
        count,
        &operand1Tensor,
        &operand2Tensor,
        &operand2Number);

    auto roundingMode = utils::helpers::parseKeywordArgument(
        runtime, arguments, 2, count, "rounding_mode");

    torch_::Tensor resultTensor;
    if (roundingMode.isUndefined()) {
      resultTensor = operand2Number != nullptr
          ? torch_::div(operand1Tensor->tensor, *operand2Number)
          : torch_::div(operand1Tensor->tensor, operand2Tensor->tensor);
    } else {
      auto roundingModeString = roundingMode.asString(runtime).utf8(runtime);
      resultTensor = operand2Number != nullptr
          ? torch_::div(
                operand1Tensor->tensor, *operand2Number, roundingModeString)
          : torch_::div(
                operand1Tensor->tensor,
                operand2Tensor->tensor,
                roundingModeString);
    }

    delete[] operand2Number;
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, DIV), 1, divFunc);
}

jsi::Function TorchHostObject::createEmpty(jsi::Runtime& runtime) {
  auto emptyFunc = [](jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) {
    if (count == 0) {
      throw jsi::JSError(
          runtime, "This function requires at least one argument.");
    }
    std::vector<int64_t> dimensions = {};
    int nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 0, count, &dimensions);

    torch_::TensorOptions tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, nextArgumentIndex, count);
    auto tensor =
        torch_::empty(c10::ArrayRef<int64_t>(dimensions), tensorOptions);
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, EMPTY), 1, emptyFunc);
}

jsi::Function TorchHostObject::createFromBlob(jsi::Runtime& runtime) {
  auto fromBlobImpl = [](jsi::Runtime& runtime,
                         const jsi::Value& thisValue,
                         const jsi::Value* arguments,
                         size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }

    if (!arguments[1].isObject() ||
        !arguments[1].asObject(runtime).isArray(runtime)) {
      throw jsi::JSError(runtime, "Arg 2 should be an array of numbers");
    }

    // We are not using utils::helpers::parseSize here because the
    // torch::from_blob is only available in C++ and doesn't support sizes as
    // variadics.
    jsi::Array jsSizes = arguments[1].asObject(runtime).asArray(runtime);
    auto sizesLength = jsSizes.size(runtime);
    std::vector<int64_t> sizes;
    sizes.reserve(sizesLength);
    for (int i = 0; i < sizesLength; i++) {
      auto value = jsSizes.getValueAtIndex(runtime, i);
      if (value.isNumber()) {
        sizes.push_back(value.asNumber());
      } else {
        throw jsi::JSError(runtime, "Input should be an array of numbers");
      }
    }

    torch_::TensorOptions tensorOptions =
        torch_::TensorOptions().dtype(torch_::kUInt8);

    auto hostObject = arguments[0].asObject(runtime).asHostObject(runtime);
    auto blobHostObject =
        dynamic_cast<torchlive::media::BlobHostObject*>(hostObject.get());
    if (blobHostObject != nullptr) {
      auto blob = blobHostObject->blob;

      uint8_t* const buffer = blob.getDirectBytes();
      auto size = blob.getDirectSize();
      // TODO(T111718110) Check if blob sizes exceed buffer size and if so throw
      // an error

      auto options = torch_::TensorOptions().dtype(torch_::kUInt8);
      auto tensor = torch_::from_blob(buffer, sizes, options).clone();

      auto tensorHostObject =
          std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
      return jsi::Object::createFromHostObject(runtime, tensorHostObject);
    } else {
      throw jsi::JSError(
          runtime, "The fromBlob function only works with BlobHostObject");
    }
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, FROM_BLOB), 1, fromBlobImpl);
}

jsi::Function TorchHostObject::createMul(jsi::Runtime& runtime) {
  auto mulFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1Tensor = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime,
        arguments,
        count,
        &operand1Tensor,
        &operand2Tensor,
        &operand2Number);

    torch_::Tensor resultTensor;
    if (operand2Number != nullptr) {
      resultTensor = torch_::mul(operand1Tensor->tensor, *operand2Number);
      delete[] operand2Number;
    } else {
      resultTensor =
          torch_::mul(operand1Tensor->tensor, operand2Tensor->tensor);
    }
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, MUL), 1, mulFunc);
}

jsi::Function TorchHostObject::createPermute(jsi::Runtime& runtime) {
  auto permuteImpl = [](jsi::Runtime& runtime,
                        const jsi::Value& thisValue,
                        const jsi::Value* arguments,
                        size_t count) {
    if (count != 2) {
      throw jsi::JSError(
          runtime, "Tensor argument and dimensions argument are required");
    }

    auto tensorHostObject = utils::helpers::parseTensor(runtime, &arguments[0]);
    std::vector<int64_t> dims = {};
    int nextArgIndex =
        utils::helpers::parseSize(runtime, arguments, 1, count, &dims);

    auto tensor = tensorHostObject->tensor;
    tensor = torch_::permute(tensor, dims);
    auto permutedTensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, permutedTensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, PERMUTE), 1, permuteImpl);
}

jsi::Function TorchHostObject::createRandint(jsi::Runtime& runtime) {
  auto randintImpl = [](jsi::Runtime& runtime,
                        const jsi::Value& thisValue,
                        const jsi::Value* arguments,
                        size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }

    auto low = 0;
    auto high = 0;
    jsi::Array size = jsi::Array::createWithElements(runtime, {});
    torch_::TensorOptions tensorOptions = torch_::TensorOptions();
    if (count == 2) {
      high = arguments[0].asNumber();
      size = arguments[1].asObject(runtime).asArray(runtime);
    } else if (arguments[1].isObject()) {
      high = arguments[0].asNumber();
      size = arguments[1].asObject(runtime).asArray(runtime);
      tensorOptions =
          utils::helpers::parseTensorOptions(runtime, arguments, 2, count);
    } else {
      low = arguments[0].asNumber();
      high = arguments[1].asNumber();
      size = arguments[2].asObject(runtime).asArray(runtime);
      tensorOptions =
          utils::helpers::parseTensorOptions(runtime, arguments, 3, count);
    }

    auto shapeLength = size.size(runtime);
    std::vector<int64_t> dims = {};
    for (int i = 0; i < shapeLength; i++) {
      int x = size.getValueAtIndex(runtime, i).asNumber();
      dims.push_back(x);
    }
    auto tensor = torch_::randint(low, high, dims, tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, RANDINT), 1, randintImpl);
}

jsi::Function TorchHostObject::createSoftmax(jsi::Runtime& runtime) {
  auto softmaxFunc = [](jsi::Runtime& runtime,
                        const jsi::Value& thisValue,
                        const jsi::Value* arguments,
                        size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }
    auto inputTensorHostObject =
        utils::helpers::parseTensor(runtime, &arguments[0]);
    auto dimension = arguments[1].asNumber();
    auto resultTensor =
        torch_::softmax(inputTensorHostObject->tensor, dimension);
    auto outputTensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);
    return jsi::Object::createFromHostObject(runtime, outputTensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SOFTMAX), 1, softmaxFunc);
}

jsi::Function TorchHostObject::createSub(jsi::Runtime& runtime) {
  auto subFunc = [](jsi::Runtime& runtime,
                    const jsi::Value& thisValue,
                    const jsi::Value* arguments,
                    size_t count) {
    torchlive::torch::TensorHostObject* operand1 = nullptr;
    torchlive::torch::TensorHostObject* operand2Tensor = nullptr;
    double* operand2Number = nullptr;
    utils::helpers::parseArithmeticOperands(
        runtime, arguments, count, &operand1, &operand2Tensor, &operand2Number);
    auto alphaValue = utils::helpers::parseKeywordArgument(
        runtime, arguments, 2, count, "alpha");
    auto alphaScalarValue = alphaValue.isUndefined()
        ? at::Scalar(1)
        : at::Scalar(alphaValue.asNumber());

    torch_::Tensor resultTensor;
    if (operand2Number != nullptr) {
      resultTensor =
          torch_::sub(operand1->tensor, *operand2Number, alphaScalarValue);
      delete[] operand2Number;
    } else {
      resultTensor = torch_::sub(
          operand1->tensor, operand2Tensor->tensor, alphaScalarValue);
    }
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, resultTensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SUB), 1, subFunc);
}

jsi::Function TorchHostObject::createTensor(jsi::Runtime& runtime) {
  auto tensorImpl = [](jsi::Runtime& runtime,
                       const jsi::Value& thisValue,
                       const jsi::Value* arguments,
                       size_t count) {
    std::vector<double> data =
        utils::helpers::parseJSIArrayData(runtime, arguments[0]);
    std::vector<int64_t> shape =
        utils::helpers::parseJSIArrayShape(runtime, arguments[0]);
    auto tensorOptions =
        utils::helpers::parseTensorOptions(runtime, arguments, 1, count);
    auto tensor =
        torch_::tensor(data, tensorOptions).reshape(at::IntArrayRef(shape));
    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);
    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TENSOR), 1, tensorImpl);
}

/**
 * Returns the k largest elements of the given input tensor along a given
 * dimension.
 *
 * https://pytorch.org/docs/stable/generated/torch.topk.html
 */
jsi::Function TorchHostObject::createTopK(jsi::Runtime& runtime) {
  auto topkFunc = [](jsi::Runtime& runtime,
                     const jsi::Value& thisValue,
                     const jsi::Value* arguments,
                     size_t count) {
    if (count < 2) {
      throw jsi::JSError(
          runtime, "This function requires at least 2 arguments");
    }
    auto inputTensorHostObject =
        utils::helpers::parseTensor(runtime, &arguments[0]);
    auto k = arguments[1].asNumber();
    auto resultTuple = torch_::topk(inputTensorHostObject->tensor, k);
    auto outputValuesTensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, std::get<0>(resultTuple));
    auto indicesInt64Tensor = std::get<1>(resultTuple);
    /**
     * NOTE: We need to convert the int64 type to int32 since Hermes does not
     * support Int64 data types yet.
     */
    auto outputIndicesTensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
            runtime, indicesInt64Tensor.to(c10::ScalarType::Int));
    return jsi::Array::createWithElements(
        runtime,
        jsi::Object::createFromHostObject(
            runtime, outputValuesTensorHostObject),
        jsi::Object::createFromHostObject(
            runtime, outputIndicesTensorHostObject));
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TOPK), 2, topkFunc);
}

/**
 * Returns a tensor filled with the scalar value 0, with the shape defined by
 * the variable argument size.
 *
 * https://pytorch.org/docs/stable/generated/torch.topk.html
 */
jsi::Function TorchHostObject::createZeros(jsi::Runtime& runtime) {
  auto zerosImpl = [](jsi::Runtime& runtime,
                      const jsi::Value& thisValue,
                      const jsi::Value* arguments,
                      size_t count) {
    if (count == 0) {
      throw jsi::JSError(
          runtime, "This function requires at least one argument.");
    }
    std::vector<int64_t> dims = {};
    int nextArgumentIndex =
        utils::helpers::parseSize(runtime, arguments, 0, count, &dims);

    torch_::TensorOptions tensorOptions = utils::helpers::parseTensorOptions(
        runtime, arguments, nextArgumentIndex, count);

    auto tensor = torch_::zeros(c10::ArrayRef<int64_t>(dims), tensorOptions);

    auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(runtime, tensor);

    return jsi::Object::createFromHostObject(runtime, tensorHostObject);
  };

  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, ZEROS), 1, zerosImpl);
}

} // namespace torch
} // namespace torchlive
