/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <cmath>

#include "../TensorHostObject.h"
#include "ArgumentParser.h"
#include "helpers.h"

namespace torchlive {
namespace utils {

using namespace facebook;

ArgumentParser::ArgumentParser(
    jsi::Runtime& runtime,
    const jsi::Value& thisVal,
    const jsi::Value* args,
    size_t count)
    : runtime_(runtime), thisVal_(thisVal), args_(args), count_(count) {}

const jsi::Value& ArgumentParser::operator[](size_t idx) const {
  if (idx + 1 > count_) {
    requireNumArguments(idx + 1);
  }
  return args_[idx];
}

size_t ArgumentParser::count() const {
  return count_;
}

int ArgumentParser::asInteger(size_t idx) const {
  double numberValue = safeArg_(idx).asNumber();
  if (fmod(numberValue, 1) != 0) {
    throw jsi::JSError(
        runtime_,
        "parameter at index " + std::to_string(idx) + " must be an integer");
  }
  return static_cast<int>(numberValue);
}

std::vector<int64_t> ArgumentParser::dimsVarArgs(size_t idx, size_t* nextArgIdx)
    const {
  std::vector<int64_t> dims;
  auto numParsed = helpers::parseSize(runtime_, args_, idx, count_, &dims);
  if (nextArgIdx != nullptr) {
    *nextArgIdx = idx + numParsed;
  }
  return dims;
}

jsi::Value ArgumentParser::keywordValue(size_t idx, const std::string& key)
    const {
  return helpers::parseKeywordArgument(
      runtime_, args_, idx, count_, key.c_str());
}

void ArgumentParser::requireNumArguments(size_t minArgCount) const {
  if (count_ < minArgCount) {
    throw jsi::JSError(
        runtime_,
        "This function requires at least " + std::to_string(minArgCount) +
            " argument" + (minArgCount == 1 ? "" : "s"));
  }
}

bool ArgumentParser::atLeastNumArguments(size_t minArgCount) const {
  return count_ >= minArgCount;
}

::torch::TensorOptions ArgumentParser::tensorOptions(size_t idx) const {
  return helpers::parseTensorOptions(runtime_, args_, idx, count_);
}

bool ArgumentParser::isScalar(size_t idx) const {
  return args_[idx].isNumber();
}

bool ArgumentParser::isScalarKwarg(
    size_t idx,
    const std::string& keyword,
    bool required) const {
  jsi::Value val = keywordValue(idx, keyword);
  if (!required) {
    return val.isUndefined() || val.isNumber();
  } else {
    return val.isNumber();
  }
}

at::Scalar ArgumentParser::asScalar(size_t idx) const {
  return at::Scalar(args_[idx].asNumber());
}

at::Scalar ArgumentParser::asScalarKwarg(size_t idx, const std::string& keyword)
    const {
  auto scalarValue = keywordValue(idx, keyword);
  if (scalarValue.isUndefined()) {
    throw facebook::jsi::JSError(runtime_, "scalarValue undefined");
  } else {
    return at::Scalar(scalarValue.asNumber());
  }
}

at::Scalar ArgumentParser::asScalarKwarg(
    size_t idx,
    const std::string& keyword,
    at::Scalar defaultValue) const {
  try {
    return asScalarKwarg(idx, keyword);
  } catch (facebook::jsi::JSError& error) {
    return defaultValue;
  }
}

} // namespace utils
} // namespace torchlive
