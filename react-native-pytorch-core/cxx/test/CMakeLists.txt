# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.20)
project(pytorch_live_cxx)

# This should match the Android build. Please keep them in sync. See ../../android/CMakeLists.txt
set(CMAKE_CXX_STANDARD 14)

include(FetchContent)

FetchContent_Declare(
  hermes
  GIT_REPOSITORY https://github.com/facebook/hermes.git
  GIT_TAG        v0.10.0
)

FetchContent_Declare(
  fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG 8.1.1
)
FetchContent_MakeAvailable()

FetchContent_Declare(
 pytorch_mobile
 URL    https://github.com/pytorch/live/releases/download/v0.1.0/pytorch_mobile_install_${CMAKE_HOST_SYSTEM_PROCESSOR}.zip)
FetchContent_MakeAvailable(pytorch_mobile fmt hermes)

enable_testing()

file(GLOB_RECURSE torchlive_srcs ../src/**/[^.]*.cpp)

add_library(
        torchlive
        SHARED
        ${torchlive_srcs}
)

target_include_directories(torchlive PUBLIC "../src/" "${pytorch_mobile_SOURCE_DIR}/include/" )

target_link_libraries(
  torchlive
  hermesapi
  ${pytorch_mobile_SOURCE_DIR}/lib/libc10.dylib
  ${pytorch_mobile_SOURCE_DIR}/lib/libtorch_cpu.dylib
)

file(GLOB torchlive_test_srcs ./*.cpp)

add_executable(
  torchlive_tests
  ${torchlive_test_srcs}
)

target_include_directories(
  torchlive_tests
  PRIVATE ${hermes_SOURCE_DIR}/public
  PRIVATE ${hermes_SOURCE_DIR}/API
  # reuse googletest modules from hermes
  PRIVATE ${hermes_SOURCE_DIR}/external/llvh/utils/unittest/googletest/include
  PRIVATE ${hermes_SOURCE_DIR}/external/llvh/include
  PRIVATE ${hermes_BINARY_DIR}/external/llvh/include
)

target_link_libraries(
  torchlive_tests
  gtest_main
  torchlive
  fmt
)

include(GoogleTest)
gtest_discover_tests(torchlive_tests)
