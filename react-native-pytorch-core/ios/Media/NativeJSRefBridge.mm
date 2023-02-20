/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <memory>
#import <string>

#import "../../cxx/src/torchlive/media/Blob.h"
#import "../../cxx/src/torchlive/media/NativeJSRefBridge.h"
#import "../../cxx/src/torchlive/media/image/ImageHostObject.h"
#import "Audio/Audio.h"
#import "Image/Image.h"
#import "MediaUtils.h"
#import "PyTorchCore-Swift-Header.h"

#if __has_include(<VisionCamera/FrameHostObject.h>)
#define HAS_VISION_CAMERA
#include <VisionCamera/FrameHostObject.h>
#endif

namespace torchlive {

namespace media {

  std::shared_ptr<IImage> resolveNativeJSRefToImage_DO_NOT_USE(
    const std::string& refId) {
      NSError *error = nil;
auto ptlImage = (PTLImage*) [PTLJSContext unwrapObjectWithJsRef:@{@"ID": [NSString stringWithUTF8String:refId.c_str()]} error:&error];
      UIImage* image = [[UIImage alloc] initWithCGImage:[ptlImage getBitmap]];
  return std::make_shared<Image>(image);
    }

std::string imageToFile(std::shared_ptr<IImage> image, const std::string& filepath) {
   std::shared_ptr<Image> derivedImage = std::dynamic_pointer_cast<Image>(image);
   UIImage* uiImage = derivedImage->image_;
    NSData *imageData = UIImagePNGRepresentation(uiImage);
    [imageData writeToFile:[NSString stringWithUTF8String:filepath.c_str()] atomically:YES];
    return filepath;
}

std::shared_ptr<IImage> imageFromBlob(
    const Blob& blob,
    double width,
    double height) {
  auto image = MediaUtilsImageFromBlob(blob, width, height);
  return std::make_shared<Image>(image);
}

std::shared_ptr<IImage> imageFromFile(std::string filePath) {
  NSString* imageFilePath = [NSString stringWithUTF8String:filePath.c_str()];

  NSFileManager* fileManager = [NSFileManager defaultManager];
  BOOL isFileExist = [fileManager fileExistsAtPath:imageFilePath];
  UIImage* image;
  if (isFileExist) {
    image = [[UIImage alloc] initWithContentsOfFile:imageFilePath];
  } else {
    // do something.
    return nullptr;
  }
  return std::make_shared<Image>(image);
}

std::shared_ptr<IImage> imageFromFrame(jsi::Runtime& runtime, jsi::Object frameHostObject) {
#ifdef HAS_VISION_CAMERA
  const auto& frameHostObject = frameHostObject.asHostObject<vision::FrameHostObject>(runtime);
  auto image = MediaUtilsImageFromCMSampleBuffer(frameHostObject->frame.buffer);
  return std::make_shared<Image>(image);
#else
  throw jsi::JSError(runtime, "Error converting Frame to Image - VisionCamera is not properly installed!");
#endif
}

std::unique_ptr<torchlive::media::Blob> toBlob(const std::string& refId) {
  auto idRef = [NSString stringWithUTF8String:refId.c_str()];
  NSError *error = nil;
  auto mediaToBlob = [[PTLMediaToBlob alloc] initWithRefId:idRef error:&error];
  if (error != nil) {
    throw std::runtime_error(std::string([error.description UTF8String]));
  }

  auto tmpBuffer = [mediaToBlob getByteBuffer];
  auto size = tmpBuffer.length;
  auto type = [mediaToBlob getBlobType];
  auto data = std::unique_ptr<uint8_t[]>(new uint8_t[size]);
  std::memcpy(data.get(), tmpBuffer.bytes, size);

  return std::make_unique<torchlive::media::Blob>(std::move(data), size, std::string([type UTF8String]));
}

std::unique_ptr<torchlive::media::Blob> toBlob(std::shared_ptr<IImage> image) {
  std::shared_ptr<Image> derivedImage = std::dynamic_pointer_cast<Image>(image);
  UIImage* uiImage = derivedImage->image_;

  size_t dataSize = size_t(4 * uiImage.size.width * uiImage.size.height);
  uint8_t* imageData = (uint8_t*)malloc(dataSize);

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();

  CGImageRef imageRef = [uiImage CGImage];
  CGContextRef bitmap = CGBitmapContextCreate(
      imageData,
      uiImage.size.width,
      uiImage.size.height,
      8,
      uiImage.size.width * 4,
      colorSpace,
      kCGImageAlphaPremultipliedLast);
  CGContextDrawImage(
      bitmap, CGRectMake(0, 0, uiImage.size.width, uiImage.size.height), imageRef);

  CGContextRelease(bitmap);
  CGColorSpaceRelease(colorSpace);

  size_t finalDataSize = size_t(3 * uiImage.size.width * uiImage.size.height);
  uint8_t* buffer = (uint8_t*)malloc(finalDataSize);
  for (size_t i = 0; i < uiImage.size.width * uiImage.size.height; i++) {
    buffer[i * 3 + 0] = imageData[i * 4 + 0]; // R
    buffer[i * 3 + 1] = imageData[i * 4 + 1]; // G
    buffer[i * 3 + 2] = imageData[i * 4 + 2]; // B
  }

  auto data = std::unique_ptr<uint8_t[]>(new uint8_t[finalDataSize]);
  std::memcpy(data.get(), buffer, finalDataSize);
  std::string blobType = Blob::kBlobTypeImageRGB;
  return std::make_unique<torchlive::media::Blob>(
      std::move(data), dataSize, blobType);
}

} // namespace media

namespace experimental {

std::shared_ptr<media::IAudio> audioFromBytes(
    const std::vector<uint8_t>& bytes,
    int sampleRate) {
  auto dataWithHeader = MediaUtilsPrependWAVHeader(bytes, sampleRate);
  auto audio = [[PTLAudio alloc] initWithAudioData:dataWithHeader];
  return std::make_shared<media::Audio>(audio);
}

} // namespace experimental

} // namespace torchlive
