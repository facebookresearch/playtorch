/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "AudioHostObject.h"

#include "../../Promise.h"
#include "../../torch/utils/ArgumentParser.h"
#include "../../torch/utils/helpers.h"

namespace torchlive {
namespace media {

using namespace facebook;

namespace {

jsi::Value playImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& audio = thisValue.asObject(runtime)
                          .asHostObject<AudioHostObject>(runtime)
                          ->getAudio();
  audio->play();
  return jsi::Value::undefined();
};

jsi::Value pauseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& audio = thisValue.asObject(runtime)
                          .asHostObject<AudioHostObject>(runtime)
                          ->getAudio();
  audio->pause();
  return jsi::Value::undefined();
};

jsi::Value stopImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& audio = thisValue.asObject(runtime)
                          .asHostObject<AudioHostObject>(runtime)
                          ->getAudio();
  audio->stop();
  return jsi::Value::undefined();
};

jsi::Value getDurationImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  const auto& audio = thisValue.asObject(runtime)
                          .asHostObject<AudioHostObject>(runtime)
                          ->getAudio();
  return audio->getDuration();
};

jsi::Value releaseImpl(
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) {
  auto audio = thisValue.asObject(runtime)
                   .asHostObject<AudioHostObject>(runtime)
                   ->getAudio();
  auto promiseValue = torchlive::createPromiseAsJSIValue(
      runtime,
      [audio](jsi::Runtime& rt, std::shared_ptr<torchlive::Promise> promise) {
        try {
          audio->close();
          promise->resolve(jsi::Value::undefined());
        } catch (std::exception& e) {
          promise->reject("error on release: " + std::string(e.what()));
        } catch (const char* error) {
          promise->reject("error on release: " + std::string(error));
        } catch (...) {
          promise->reject("error on release");
        }
      });
  return promiseValue;
};

} // namespace

AudioHostObject::AudioHostObject(
    jsi::Runtime& runtime,
    std::shared_ptr<IAudio> audio)
    : BaseHostObject(runtime), audio_(std::move(audio)) {
  // Properties
  setProperty(
      runtime, "ID", jsi::String::createFromUtf8(runtime, audio_->getId()));

  // Functions
  setPropertyHostFunction(runtime, "play", 0, playImpl);
  setPropertyHostFunction(runtime, "pause", 0, pauseImpl);
  setPropertyHostFunction(runtime, "stop", 0, stopImpl);
  setPropertyHostFunction(runtime, "getDuration", 0, getDurationImpl);
  setPropertyHostFunction(runtime, "release", 0, releaseImpl);
}

std::shared_ptr<IAudio> AudioHostObject::getAudio() const noexcept {
  return audio_;
}

} // namespace media
} // namespace torchlive
