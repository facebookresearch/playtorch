/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <jsi/jsi.h>
#import <sys/utsname.h>

#import "PyTorchCoreJSI.h"

namespace torchlive {
void install(facebook::jsi::Runtime &runtime);
}

@implementation PyTorchCoreJSI

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)setBridge:(RCTBridge *)bridge {
    _bridge = bridge;
    _setBridgeOnMainQueue = RCTIsMainQueue();
    [self install];
}

- (void)install {
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    if (cxxBridge.runtime) {
        torchlive::install(*(facebook::jsi::Runtime *)cxxBridge.runtime);
    }
}

@end
