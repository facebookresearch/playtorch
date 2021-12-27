/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <LibTorch-Lite/LibTorch-Lite.h>

NS_ASSUME_NONNULL_BEGIN

@interface PTMTensor ()

+ (instancetype)fromTensor:(const at::Tensor&)tensor;

@property(nonatomic, readonly) at::Tensor tensor;

@end

NS_ASSUME_NONNULL_END
