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

#include "./image/Image.h"
#include "./image/JIImage.h"

namespace torchlive {
namespace media {

using namespace facebook;
using namespace jni;

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
} // namespace torchlive
