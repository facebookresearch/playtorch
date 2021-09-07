/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTConvert.h>
#import "Macros.h"
#import "TorchModule.h"
#import "TensorWrapper.h"

@interface PyTorchCoreBridge: RCTViewManager

@end
