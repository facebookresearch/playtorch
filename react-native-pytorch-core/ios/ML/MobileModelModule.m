/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreMobileModelModule, MobileModelModule, NSObject)
RCT_EXTERN_METHOD(execute:(nonnull NSString)modelPath params:(nonnull NSDictionary)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(preload:(nonnull NSString)modelPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(unload:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
@end
