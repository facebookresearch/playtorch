/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

#ifdef __cplusplus
extern "C" {
#endif

namespace torchlive {
namespace media {
class Blob;
}
}

UIImage *MediaUtilsImageFromBlob(const torchlive::media::Blob& blob,
                                 double width,
                                 double height);

#ifdef __cplusplus
}
#endif

NS_ASSUME_NONNULL_END
