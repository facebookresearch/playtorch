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

#pragma mark - Image

UIImage *MediaUtilsImageFromBlob(const torchlive::media::Blob& blob,
                                 double width,
                                 double height)
{
  // blob data format should be RGB
  if (blob.getDirectSize() != static_cast<int>(width * height * 3)) {
    return nil;
  }

  // Add alpha
  std::vector<uint8_t> buffer;
  buffer.reserve(width * height * 4);
  auto p = blob.getDirectBytes();
  for (auto i = 0; i < width * height; i++) {
    buffer.push_back(*(p++));  // R
    buffer.push_back(*(p++));  // G
    buffer.push_back(*(p++));  // B
    buffer.push_back(255);     // A
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef bitmapContext = CGBitmapContextCreate(buffer.data(),
                                                     width,
                                                     height,
                                                     8,
                                                     4 * width,
                                                     colorSpace,
                                                     kCGImageAlphaNoneSkipLast | kCGBitmapByteOrderDefault);
  CFRelease(colorSpace);
  CGImageRef cgImage = CGBitmapContextCreateImage(bitmapContext);
  CGContextRelease(bitmapContext);

  UIImage *image = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);

  return image;;
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
