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
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"

namespace torchlive {
namespace experimental {

using namespace facebook::jsi;
using namespace utils::helpers;

namespace audio {

static Value audioFromBytesImpl(
    Runtime& runtime,
    const Value& thisValue,
    const Value* arguments,
    size_t count) {
  auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
  args.requireNumArguments(2);

  std::vector<double> dataArray = parseJSIArrayData(runtime, arguments[0]);
  std::vector<uint8_t> bytes(dataArray.begin(), dataArray.end());
  int sampleRate = args.asInteger(1);

  auto promiseValue = createPromiseAsJSIValue(
      runtime,
      [bytes = std::move(bytes), sampleRate](
          Runtime& rt, std::shared_ptr<Promise> promise) {
        auto errorMsg = "error on creating audio from bytes with size: " +
            std::to_string(bytes.size()) +
            ", sample rate: " + std::to_string(sampleRate) + ". ";
        try {
          auto audio = audioFromBytes(bytes, sampleRate);
          if (audio == nullptr) {
            promise->reject(errorMsg);
          } else {
            auto audioHostObject =
                std::make_shared<media::AudioHostObject>(rt, std::move(audio));
            auto jsiObject =
                Object::createFromHostObject(rt, std::move(audioHostObject));
            promise->resolve(std::move(jsiObject));
          }
        } catch (std::exception& e) {
          promise->reject(errorMsg + std::string(e.what()));
        } catch (const char* error) {
          promise->reject(errorMsg + std::string(error));
        } catch (...) {
          promise->reject(errorMsg);
        }
      });
  return promiseValue;
}

static Value audioRemoveWAVHeaderImpl(
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
