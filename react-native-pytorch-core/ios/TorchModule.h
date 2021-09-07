/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "TensorWrapper.h"

NS_ASSUME_NONNULL_BEGIN

@interface TorchModule : NSObject

+ (nullable instancetype)load:(NSString *)filePath extraFiles:(NSMutableDictionary<NSString *, NSString *> *)extraFiles;
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;
- (TensorWrapper *)predictImage:(TensorWrapper *)tensorWrapper outputType:(NSString *)outputType;

@end

NS_ASSUME_NONNULL_END
