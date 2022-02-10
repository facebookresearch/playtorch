/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreModelLoaderModule, ModelLoaderModule, NSObject)
RCT_EXTERN_METHOD(download:(nonnull NSString)modelPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
@end
