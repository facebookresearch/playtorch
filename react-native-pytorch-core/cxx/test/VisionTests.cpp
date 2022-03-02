/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <fmt/core.h>
#include <fmt/format.h>
#include <gtest/gtest.h>
#include <hermes/hermes.h>
#include <string>

using namespace facebook::jsi;
using namespace facebook::hermes;

namespace torchlive {
void install(Runtime& runtime);
}

namespace {

class TorchliveVisionHermesRuntimeTestBase : public ::testing::Test {
 public:
  TorchliveVisionHermesRuntimeTestBase(
      ::hermes::vm::RuntimeConfig runtimeConfig)
      : rt(makeHermesRuntime(runtimeConfig)) {}

 protected:
  Value eval(const char* code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }
  Value eval(const std::string& code) {
    return rt->global().getPropertyAsFunction(*rt, "eval").call(*rt, code);
  }

  std::shared_ptr<HermesRuntime> rt;
};

class TorchliveVisionHermesRuntimeTest
    : public TorchliveVisionHermesRuntimeTestBase {
 public:
  TorchliveVisionHermesRuntimeTest()
      : TorchliveVisionHermesRuntimeTestBase(
            ::hermes::vm::RuntimeConfig::Builder()
                .withES6Proxy(true)
                .withES6Promise(true)
                .build()) {}
};

class TorchliveVisionRuntimeTest : public TorchliveVisionHermesRuntimeTest {
 public:
  TorchliveVisionRuntimeTest() : TorchliveVisionHermesRuntimeTest() {
    // Install the torchlive objects
    torchlive::install(*rt);
  }
};

TEST_F(TorchliveVisionRuntimeTest, TorchliveVisionObjectTest) {
  EXPECT_TRUE(eval("typeof __torchlive_vision__ === 'object'").getBool());
}

TEST_F(TorchliveVisionRuntimeTest, TransformsObjectTest) {
  EXPECT_TRUE(
      eval("typeof __torchlive_vision__.transforms === 'object'").getBool());
}

TEST_F(TorchliveVisionRuntimeTest, CenterCropTest) {
  std::string centerCropWithoutArgs =
      R"(
          const imageTensor1 = torch.rand([3, 640, 480]);
          const centerCrop = __torchlive_vision__.transforms.centerCrop();
          const imageTensor2 = centerCrop(imageTensor1);
          const shape = imageTensor2.shape;
          shape[0] === 3 && shape[1] === 480 && shape[2] === 480;
        )";
  EXPECT_TRUE(eval(centerCropWithoutArgs).getBool());

  std::string centerCropWithSingleSize =
      R"(
          const imageTensor1 = torch.rand([3, 640, 480]);
          const centerCrop = __torchlive_vision__.transforms.centerCrop(400);
          const imageTensor2 = centerCrop(imageTensor1);
          const shape = imageTensor2.shape;
          shape[0] === 3 && shape[1] === 400 && shape[2] === 400;
        )";
  EXPECT_TRUE(eval(centerCropWithSingleSize).getBool());

  std::string centerCropWithSize =
      R"(
          const imageTensor1 = torch.rand([3, 640, 480]);
          const centerCrop = __torchlive_vision__.transforms.centerCrop(200, 300);
          const imageTensor2 = centerCrop(imageTensor1);
          const shape = imageTensor2.shape;
          shape[0] === 3 && shape[1] === 300 && shape[2] === 200;
        )";
  EXPECT_TRUE(eval(centerCropWithSize).getBool());
}

TEST_F(TorchliveVisionRuntimeTest, NormalizeTest) {
  std::string normalize =
      R"(
          const imageTensor1 = torch.rand([3, 640, 480]);
          const normalize = __torchlive_vision__.transforms.normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225]
          );
          const imageTensor2 = normalize(imageTensor1);
          const shape = imageTensor2.shape;
          shape[0] === 3 && shape[1] === 640 && shape[2] === 480;
        )";
  EXPECT_TRUE(eval(normalize).getBool());
}

} // namespace
