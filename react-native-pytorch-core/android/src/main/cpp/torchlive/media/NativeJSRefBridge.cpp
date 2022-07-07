/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <jni.h>

#include <fbjni/ByteBuffer.h>
#include <fbjni/fbjni.h>

#include <torchlive/media/Blob.h>
#include <torchlive/media/NativeJSRefBridge.h>

#include "./audio/Audio.h"
#include "./audio/JIAudio.h"
#include "./image/Image.h"
#include "./image/JIImage.h"

namespace torchlive {

using namespace facebook::jni;

namespace {

alias_ref<JClass> getJBlobUtilsClass() {
  static const auto JBlobUtilsClass =
      findClassStatic("org/pytorch/rn/core/media/BlobUtils");
  return JBlobUtilsClass;
}

alias_ref<JClass> getMediaUtilsClass() {
  static const auto MediaUtilsClass =
      findClassStatic("org/pytorch/rn/core/media/MediaUtils");
  return MediaUtilsClass;
}

} // namespace

namespace media {

std::shared_ptr<IImage>
imageFromBlob(const Blob& blob, double width, double height) {
  auto mediaUtilsClass = getMediaUtilsClass();
  auto imageFromBlobMethod =
      mediaUtilsClass->getStaticMethod<local_ref<JIImage>(
          alias_ref<JByteBuffer>, jdouble, jdouble)>("imageFromBlob");
  uint8_t* const data = blob.getDirectBytes();
  size_t const size = blob.getDirectSize();
  local_ref<JByteBuffer> buffer = JByteBuffer::allocateDirect(size);
  std::memcpy(buffer->getDirectBytes(), data, size);
  local_ref<JIImage> image =
      imageFromBlobMethod(mediaUtilsClass, buffer, width, height);
  return std::make_shared<Image>(make_global(image));
}

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId) {
  auto blobUtilsClass = getJBlobUtilsClass();
  static const auto nativeJSRefToByteBufferMethod =
      blobUtilsClass->getStaticMethod<local_ref<JByteBuffer>(std::string)>(
          "nativeJSRefToByteBuffer");
  local_ref<JByteBuffer> buffer =
      nativeJSRefToByteBufferMethod(blobUtilsClass, refId);

  uint8_t* const bytes = buffer->getDirectBytes();
  size_t const size = buffer->getDirectSize();
  auto data = std::make_unique<uint8_t[]>(size);
  std::memcpy(data.get(), bytes, size);
  return std::make_unique<torchlive::media::Blob>(std::move(data), size);
}

} // namespace media

namespace experimental {

std::shared_ptr<media::IAudio> audioFromBytes(
    const std::vector<uint8_t>& bytes,
    int sampleRate) {
  auto mediaUtilsClass = getMediaUtilsClass();
  auto audioFromBytesMethod =
      mediaUtilsClass->getStaticMethod<local_ref<media::JIAudio>(
          alias_ref<jbyteArray>, jint)>("audioFromBytes");

  auto byteArray = make_byte_array(bytes.size());
  byteArray->setRegion(
      0, bytes.size(), reinterpret_cast<const jbyte*>(bytes.data()));
  local_ref<media::JIAudio> audio =
      audioFromBytesMethod(mediaUtilsClass, byteArray, sampleRate);

  return std::make_shared<media::Audio>(make_global(audio));
}

} // namespace experimental

} // namespace torchlive
