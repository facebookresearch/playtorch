/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/RuntimeExecutor.h>
#import <jsi/jsi.h>
#import <sys/utsname.h>
#import <cxx/src/torchlive/torchlive.h>

#import "PyTorchCoreJSI.h"

@interface RCTCxxBridge ()
- (void)invokeAsync:(std::function<void()> &&)func;
@end

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
        facebook::react::RuntimeExecutor runtimeExecutor =
            [cxxBridge](std::function<void(facebook::jsi::Runtime & runtime)>&& callback) {
                [cxxBridge invokeAsync:[cxxBridge, callback = std::move(callback)]() {
                    if (!cxxBridge || !cxxBridge.runtime) {
                        return;
                    }
                    callback(*(facebook::jsi::Runtime *)(cxxBridge.runtime));
                }];
            };

        torchlive::install(*(facebook::jsi::Runtime *)cxxBridge.runtime, runtimeExecutor);
    }
}

@end
