/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ExperimentalNamespace.h"
#include "../Promise.h"
#include "../media/NativeJSRefBridge.h"
#include "../media/audio/AudioHostObject.h"
#include "../torch/TensorHostObject.h"
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"

namespace torchlive {
namespace experimental {

using namespace facebook::jsi;
using namespace utils::helpers;

namespace audio {

Value audioFromBytesImpl(
    Runtime& runtime,
    const Value& thisValue,
    const Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);

  auto promiseValue = createPromiseAsJSIValue(
      runtime, [](Runtime& rt, std::shared_ptr<Promise> promise) {
        auto audioHostObject =
            std::make_shared<media::AudioHostObject>(rt, nullptr);
        auto jsiObject =
            Object::createFromHostObject(rt, std::move(audioHostObject));
        promise->resolve(std::move(jsiObject));
      });
  return promiseValue;
}

Value audioRemoveWAVHeaderImpl(
    Runtime& runtime,
    const Value& thisValue,
    const Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(1);

  auto promiseValue = createPromiseAsJSIValue(
      runtime, [](Runtime& rt, std::shared_ptr<Promise> promise) {
        auto audioHostObject =
            std::make_shared<media::AudioHostObject>(rt, nullptr);
        auto jsiObject =
            Object::createFromHostObject(rt, std::move(audioHostObject));
        promise->resolve(std::move(jsiObject));
      });
  return promiseValue;
}

} // namespace audio

Object buildNamespace(Runtime& rt, RuntimeExecutor rte) {
  Object obj(rt);
  setPropertyHostFunction(
      rt, obj, "audioFromBytes", 2, audio::audioFromBytesImpl);
  setPropertyHostFunction(
      rt, obj, "audioRemoveWAVHeader", 1, audio::audioRemoveWAVHeaderImpl);
  return obj;
}

} // namespace experimental
} // namespace torchlive
