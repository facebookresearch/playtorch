/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <string>

#include "Blob.h"
#include "audio/IAudio.h"
#include "image/IImage.h"

namespace torchlive {

namespace media {

/**
 * The resolveNativeJSRefToImage_DO_NOT_USE function is needed to resolve
 * NativeJSRef objects to IImage. This function will be removed without
 * warning in future releases once NativeJSRef is fully deprecated.
 */
std::shared_ptr<IImage> resolveNativeJSRefToImage_DO_NOT_USE(
    const std::string& refId);

std::string imageToFile(
    std::shared_ptr<IImage> image,
    const std::string& filepath);

std::shared_ptr<IImage> imageFromFile(std::string filepath);

std::shared_ptr<IImage>
imageFromBlob(const Blob& blob, double width, double height);

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId);

std::unique_ptr<torchlive::media::Blob> toBlob(std::shared_ptr<IImage> image);

} // namespace media

namespace experimental {

std::shared_ptr<media::IAudio> audioFromBytes(
    const std::vector<uint8_t>& bytes,
    int sampleRate);

} // namespace experimental

} // namespace torchlive
