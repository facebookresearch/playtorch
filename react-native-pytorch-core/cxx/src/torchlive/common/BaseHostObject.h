/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>

#include <string>
#include <unordered_map>

namespace torchlive {
namespace common {

// This base class simplifies host object implementation, especially for static
// properties like functions.
class BaseHostObject : public facebook::jsi::HostObject {
 public:
  explicit BaseHostObject(facebook::jsi::Runtime& rt);
  virtual ~BaseHostObject();

  virtual facebook::jsi::Value get(
      facebook::jsi::Runtime& rt,
      const facebook::jsi::PropNameID& name) override;

  virtual std::vector<facebook::jsi::PropNameID> getPropertyNames(
      facebook::jsi::Runtime& rt) override;

 protected:
  void setProperty(
      facebook::jsi::Runtime& rt,
      const std::string& name,
      facebook::jsi::Value&& value);

  void setPropertyHostFunction(
      facebook::jsi::Runtime& rt,
      const std::string& name,
      unsigned int paramCount,
      facebook::jsi::HostFunctionType func);

  std::unordered_map<std::string, facebook::jsi::Value> propertyMap_;
};

} // namespace common
} // namespace torchlive
