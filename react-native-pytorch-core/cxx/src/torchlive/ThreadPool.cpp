/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ThreadPool.h"

namespace torchlive {

ThreadPool::ThreadPool(std::size_t pool_size) : c10::ThreadPool(pool_size) {
  c10::setThreadName("TorchliveThread");
}

ThreadPool* ThreadPool::pool() {
  static ThreadPool threadPool(c10::ThreadPool::defaultNumThreads());
  return &threadPool;
}

} // namespace torchlive
