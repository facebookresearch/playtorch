/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <React/RCTConvert.h>

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreImageModule, ImageModule, NSObject)
RCT_EXTERN_METHOD(fromBundle:(nonnull NSDictionary)assetImage resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(fromFile:(nonnull NSString)filepath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(fromImageData:(nonnull NSDictionary)imageDataRef scaled:(nonnull BOOL)scaled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(fromURL:(nonnull NSString)urlString resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(toFile:(nonnull NSDictionary)imageRef resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getWidth:(nonnull NSDictionary)imageRef);
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getHeight:(nonnull NSDictionary)imageRef);
RCT_EXTERN_METHOD(release:(nonnull NSDictionary)imageRef resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(scale:(nonnull NSDictionary)imageRef sx:(nonnull NSNumber)sx sy:(nonnull NSNumber)sy resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getName);
@end
