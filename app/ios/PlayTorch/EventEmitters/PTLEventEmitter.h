/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface PTLEventEmitter : RCTEventEmitter<RCTBridgeModule>

- (void)addGestureRecognizerToUIView:(UIView*)view;

@end

NS_ASSUME_NONNULL_END
