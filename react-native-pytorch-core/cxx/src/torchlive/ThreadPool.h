/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <c10/core/thread_pool.h>

namespace torchlive {

// A thread pool to do work off of the main JavaScript thread.
class ThreadPool : public c10::ThreadPool {
 public:
  // Singleton instance.
  static ThreadPool* pool();

 private:
  explicit ThreadPool(std::size_t pool_size);
};

} // namespace torchlive
