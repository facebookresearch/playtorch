/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(PyTorchCoreCanvasView, CanvasManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(onContext2D, RCTBubblingEventBlock)
RCT_EXTERN_METHOD(requiresMainQueueSetup)
@end
