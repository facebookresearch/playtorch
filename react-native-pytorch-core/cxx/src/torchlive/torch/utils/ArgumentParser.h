/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <cstddef>
#include <string>

// Suppress deprecated-declarations error to support Clang/C++17
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
#include <torch/script.h>
#pragma clang diagnostic pop

namespace torchlive {
namespace utils {

// This class holds references to the constructor arguments and is only valid
// for their lifetime.
class ArgumentParser {
 public:
  explicit ArgumentParser(
      facebook::jsi::Runtime& runtime,
      const facebook::jsi::Value& thisVal,
      const facebook::jsi::Value* args,
      size_t count);

  const facebook::jsi::Value& operator[](size_t idx) const;

  size_t count() const;

  template <typename T>
  std::shared_ptr<T> thisAsHostObject() {
    return thisVal_.asObject(runtime_).asHostObject<T>(runtime_);
  }
  template <typename T>
  std::shared_ptr<T> asHostObject(size_t idx) {
    return safeArg_(idx).asObject(runtime_).asHostObject<T>(runtime_);
  }
  template <typename T>
  bool isHostObject(size_t idx) {
    try {
      asHostObject<T>(idx);
      return true;
    } catch (std::exception& ex) {
      return false;
    }
  }

  // Ensure this argument's asNumber is integral or throw an error
  int asInteger(size_t idx) const;

  // See helpers::parseSize()
  std::vector<int64_t> dimsVarArgs(size_t idx, size_t* nextArgIdx = nullptr)
      const;

  // See helpers::parseKeywordArgument()
  facebook::jsi::Value keywordValue(size_t idx, const std::string& keyword)
      const;

  void requireNumArguments(size_t minArgCount) const;
  bool atLeastNumArguments(size_t minArgCount) const;

  // See helpers::parseTensorOptions()
  ::torch::TensorOptions tensorOptions(size_t idx) const;

  bool isScalar(size_t idx) const;
  bool isScalarKwarg(size_t idx, const std::string& keyword, bool required)
      const;
  bool isBoolKwarg(size_t idx, const std::string& keyword, bool required) const;
  bool isC10OptionalInt64Kwarg(
      size_t idx,
      const std::string& keyword,
      bool required) const;
  bool isInt64(size_t idx) const;

  at::Scalar asScalar(size_t idx) const;
  at::Scalar asScalarKwarg(size_t idx, const std::string& keyword) const;
  at::Scalar asScalarKwarg(
      size_t idx,
      const std::string& keyword,
      at::Scalar defaultValue) const;
  bool asBoolKwarg(size_t idx, const std::string& keyword) const;
  bool asBoolKwarg(size_t idx, const std::string& keyword, bool defaultValue)
      const;
  c10::optional<int64_t> asC10OptionalInt64Kwarg(
      size_t idx,
      const std::string& keyword) const;
  c10::optional<int64_t> asC10OptionalInt64Kwarg(
      size_t idx,
      const std::string& keyword,
      c10::optional<int64_t> defaultValue) const;
  int64_t asInt64(size_t idx) const;

 private:
  facebook::jsi::Runtime& runtime_;
  const facebook::jsi::Value& thisVal_;
  const facebook::jsi::Value* args_;
  size_t count_;

  inline const facebook::jsi::Value& safeArg_(size_t idx) const {
    return (*this)[idx];
  }
};

} // namespace utils
} // namespace torchlive
