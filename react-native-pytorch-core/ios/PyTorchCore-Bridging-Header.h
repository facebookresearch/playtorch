/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTConvert.h>
#import "Macros.h"
#import "PTMModule.h"
#import "PTMTensor.h"
#import "PTMIValue.h"

@interface PyTorchCoreBridge: RCTViewManager

@end
