/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreImageDataModule, ImageDataModule, NSObject)

RCT_EXTERN_METHOD(release:(nonnull NSDictionary)imageDataRef resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);

@end
