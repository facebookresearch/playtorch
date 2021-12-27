/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "Macros.h"
#import <React/RCTConvert.h>

@implementation Macros
+ (UIImage *) toUIImage: (NSDictionary *) imageRef {
    UIImage *uiImage = [RCTConvert UIImage: imageRef];
    return uiImage;
}
@end
