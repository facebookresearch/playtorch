/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "Audio.h"

namespace torchlive {
namespace media {

using namespace facebook::jni;

namespace {

alias_ref<JClass> getMediaUtilsClass() {
  static const auto MediaUtilsClass =
      findClassStatic("org/pytorch/rn/core/media/MediaUtils");
  return MediaUtilsClass;
}

} // namespace

Audio::Audio(alias_ref<JIAudio> audio) : audio_(make_global(audio)) {
  // This is not needed once we fully migrate to JSI.
  auto mediaUtilsClass = getMediaUtilsClass();
  auto wrapObjectMethod =
      mediaUtilsClass->getStaticMethod<std::string(alias_ref<JObject>)>(
          "wrapObject");
  id_ = wrapObjectMethod(mediaUtilsClass, audio)->toStdString();
}

Audio::~Audio() {
  ThreadScope::WithClassLoader([&]() {
    Environment::ensureCurrentThreadIsAttached();
    this->audio_.release();
  });
}

std::string Audio::getId() const {
  return id_;
}

void Audio::play() const noexcept {
  audio_->play();
}

void Audio::pause() const noexcept {
  audio_->pause();
}

void Audio::stop() const noexcept {
  audio_->stop();
}

int Audio::getDuration() const noexcept {
  return audio_->getDuration();
}

void Audio::close() const {
  audio_->close();

  // This is not needed once we fully migrate to JSI.
  auto mediaUtilsClass = getMediaUtilsClass();
  auto releaseMethod =
      mediaUtilsClass->getStaticMethod<void(std::string)>("releaseObject");
  try {
    releaseMethod(mediaUtilsClass, id_);
  } catch (JniException& e) {
    // JniException extends std::exception, so "catch (std::exception& exn)"
    // also works.
    throw std::runtime_error(e.what());
  }
}

} // namespace media
} // namespace torchlive
