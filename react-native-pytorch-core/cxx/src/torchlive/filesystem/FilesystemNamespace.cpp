/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "FilesystemNamespace.h"
#include <sys/stat.h>
#include "../Promise.h"
#include "../torch/utils/ArgumentParser.h"
#include "../torch/utils/helpers.h"

namespace torchlive {
namespace filesystem {

using namespace facebook::jsi;
using namespace utils::helpers;

namespace {

Value getLastAccessTimeImpl(
    Runtime& runtime,
    const Value& thisValue,
    const Value* arguments,
    size_t count) {
  try {
    auto args = utils::ArgumentParser(runtime, thisValue, arguments, count);
    args.requireNumArguments(1);

    auto filePath = args[0].asString(runtime);
    struct stat filestat;
    stat(filePath.utf8(runtime).c_str(), &filestat);
    // `st_ctime` - Time of last status change. This reflects the file access
    // time correctly on both iOS and android, while `st_atime` and `st_mtime`
    // don't.
    // https://pubs.opengroup.org/onlinepubs/009696799/basedefs/sys/stat.h.html
    return static_cast<double>(filestat.st_ctime);
  } catch (const std::exception& e) {
    throw JSError(
        runtime, "error on getLastAccessTime: " + std::string(e.what()));
  }
}

} // namespace

Object buildNamespace(Runtime& rt, RuntimeExecutor rte) {
  Object obj(rt);
  setPropertyHostFunction(
      rt, obj, "getLastAccessTime", 1, getLastAccessTimeImpl);
  return obj;
}

} // namespace filesystem
} // namespace torchlive
