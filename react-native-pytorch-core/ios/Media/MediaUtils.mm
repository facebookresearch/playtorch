/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "MediaUtils.h"

#import <sstream>
#import <vector>
#import "cxx/src/torchlive/media/Blob.h"

using namespace torchlive::media;

#pragma mark - Image

UIImage *MediaUtilsImageFromBlob(const torchlive::media::Blob& blob,
                                 double width,
                                 double height)
{
  int channels;
  if (blob.getType() == Blob::kBlobTypeImageGrayscale) {
    channels = 1;
  } else if (blob.getType() == Blob::kBlobTypeImageRGB) {
    channels = 3;
  } else if (blob.getType() == Blob::kBlobTypeImageRGBA) {
    channels = 4;
  } else {
    throw std::runtime_error("Image from blob error - unsupported blob type: " + blob.getType());
  }

  // blob size check with data format
  if (blob.getDirectSize() != static_cast<int>(width * height * channels)) {
    throw std::runtime_error("Image from blob error - mismatched sizes, blob size (" + std::to_string(blob.getDirectSize()) + ") != width ("
                             + std::to_string(width) + ") * height (" + std::to_string(height) + ") * channels (" + std::to_string(channels) + ")");
  }

  if (channels == 1) {
    // Grayscale with 1 channel
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceGray();
    CGContextRef bitmapContext = CGBitmapContextCreate(blob.getDirectBytes(),
                                                       width,
                                                       height,
                                                       8,
                                                       width,
                                                       colorSpace,
                                                       kCGImageAlphaNone | kCGBitmapByteOrderDefault);

    CGColorSpaceRelease(colorSpace);
    CGImageRef cgImage = CGBitmapContextCreateImage(bitmapContext);
    CGContextRelease(bitmapContext);

    UIImage *image = [UIImage imageWithCGImage:cgImage];
    CGImageRelease(cgImage);

    return image;
  } else {
    // Add alpha
    std::vector<uint8_t> buffer;
    buffer.reserve(width * height * 4);
    auto p = blob.getDirectBytes();
    for (auto i = 0; i < width * height; i++) {
      uint8_t alpha = (channels == 4 ? *(p + 3) : 255);
      uint8_t red = *(p++) * alpha / 255;
      uint8_t green = *(p++) * alpha / 255;
      uint8_t blue = *(p++) * alpha / 255;
      if (channels == 4) {
        p++;
      }
      buffer.push_back(red);    // R
      buffer.push_back(green);  // G
      buffer.push_back(blue);   // B
      buffer.push_back(alpha);  // A
    }

    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef bitmapContext = CGBitmapContextCreate(buffer.data(),
                                                       width,
                                                       height,
                                                       8,
                                                       4 * width,
                                                       colorSpace,
                                                       kCGImageAlphaPremultipliedLast | kCGBitmapByteOrderDefault);

    CGColorSpaceRelease(colorSpace);
    CGImageRef cgImage = CGBitmapContextCreateImage(bitmapContext);
    CGContextRelease(bitmapContext);

    UIImage *image = [UIImage imageWithCGImage:cgImage];
    CGImageRelease(cgImage);

    return image;
  }
}

#pragma mark - Audio

static void write(std::stringstream &stream, int value, int size)
{
  stream.write(reinterpret_cast<const char*>(&value), size);
}

NSData *MediaUtilsPrependWAVHeader(const std::vector<uint8_t>& bytes,
                                   int sampleRate)
{
  int m_channels = 1;
  int bitsPerSample = 16;

  // Create a stream
  std::stringstream stream;
  auto bufSize = bytes.size();

  // Header
  stream.write("RIFF", 4);                                       // sGroupID (RIFF = Resource Interchange File Format)
  write(stream, 36 + static_cast<int>(bufSize), 4);              // dwFileLength
  stream.write("WAVE", 4);                                       // sRiffType

  // Format chunk
  stream.write("fmt ", 4);                                       // sGroupID (fmt = format)
  write(stream, 16, 4);                                          // Chunk size (of Format Chunk)
  write(stream, 1, 2);                                           // Format (1 = PCM)
  write(stream, m_channels, 2);                                  // Channels
  write(stream, sampleRate, 4);                                  // Sample Rate
  write(stream, sampleRate * m_channels * bitsPerSample / 8, 4); // Byterate
  write(stream, m_channels * bitsPerSample / 8, 2);              // Frame size aka Block align
  write(stream, bitsPerSample, 2);                               // Bits per sample

  // Data chunk
  stream.write("data", 4);                                       // sGroupID (data)
  stream.write((const char*)&bufSize, 4);                        // Chunk size (of Data, and thus of bufferSize)
  for (const auto& byte : bytes) {
    write(stream, byte, 1);                                      // The samples DATA!!!
  }

  std::string str = stream.str();
  return [NSData dataWithBytes:str.c_str() length:44 + bufSize]; // header 44 bytes
}
