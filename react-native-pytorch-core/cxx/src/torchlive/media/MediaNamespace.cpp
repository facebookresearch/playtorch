/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "MediaNamespace.h"
#include "../torch/utils/helpers.h"
#include "BlobHostObject.h"
#include "NativeJSRefBridge.h"

namespace torchlive {
namespace media {

using namespace facebook;

jsi::Value toBlobImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  if (count != 1) {
    throw jsi::JSError(runtime, "function requires 1 argument");
  }
  if (!arguments[0].isObject()) {
    throw jsi::JSError(runtime, "argument must be a NativeJSRef");
  }

  const auto ID_PROP = jsi::PropNameID::forUtf8(runtime, std::string("ID"));

  auto obj = arguments[0].asObject(runtime);
  if (!obj.hasProperty(runtime, ID_PROP)) {
    throw jsi::JSError(runtime, "object must have ID property");
  }

  auto idValue = obj.getProperty(runtime, ID_PROP);
  if (!idValue.isString()) {
    throw jsi::JSError(runtime, "ID property must be a string");
  }

  auto id = idValue.asString(runtime).utf8(runtime);
  auto blob = torchlive::media::toBlob(id);
  auto blobHostObject = std::make_shared<torchlive::media::BlobHostObject>(
      runtime, std::move(blob));
  return jsi::Object::createFromHostObject(runtime, blobHostObject);
}

jsi::Object buildNamespace(jsi::Runtime& rt, RuntimeExecutor rte) {
  using utils::helpers::setPropertyHostFunction;

  jsi::Object ns(rt);
  setPropertyHostFunction(rt, ns, "toBlob", 1, toBlobImpl);
  return ns;
}

} // namespace media
} // namespace torchlive
