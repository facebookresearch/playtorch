/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <React/RCTConvert.h>

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreAudioModule, AudioModule, NSObject)
RCT_EXTERN_METHOD(isRecording:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(startRecord);
RCT_EXTERN_METHOD(stopRecord:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getName);
RCT_EXTERN_METHOD(play:(nonnull NSDictionary)audioRef);
RCT_EXTERN_METHOD(pause:(nonnull NSDictionary)audioRef);
RCT_EXTERN_METHOD(stop:(nonnull NSDictionary)audioRef);
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getDuration:(nonnull NSDictionary)audioRef);
RCT_EXTERN_METHOD(release:(nonnull NSDictionary)audioRef resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(fromBundle:(nonnull NSString)assetAudio resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(fromFile:(nonnull NSString)filepath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(toFile:(nonnull NSDictionary)audioRef resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);
@end
