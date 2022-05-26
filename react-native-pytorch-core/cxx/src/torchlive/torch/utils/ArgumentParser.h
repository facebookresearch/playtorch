/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <torch/script.h>

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

  // Ensure this argument's asNumber is integral or throw an error
  int asInteger(size_t idx) const;

  // See helpers::parseSize()
  std::vector<int64_t> dimsVarArgs(size_t idx, size_t* nextArgIdx = nullptr)
      const;

  // See helpers::parseKeywordArgument()
  facebook::jsi::Value keywordValue(size_t idx, const std::string& keyword)
      const;

  void requireNumArguments(size_t minArgCount) const;

  // See helpers::parseTensorOptions()
  ::torch::TensorOptions tensorOptions(size_t idx) const;

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
