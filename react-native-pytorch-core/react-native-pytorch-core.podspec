# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-pytorch-core"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/pytorch/live.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}", "cxx/src/**/*.{h,cpp}"
  s.private_header_files = ['ios/**/Internal/*.h']

  s.swift_version = "5.0"

  s.requires_arc = true

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "USE_HEADERMAP" => "YES",
    "HEADER_SEARCH_PATHS" => '$(inherited) "$(PODS_TARGET_SRCROOT)/ReactCommon" "$(PODS_TARGET_SRCROOT)" "$(PODS_ROOT)/Headers/Private/React-Core" "$(PODS_ROOT)/Headers/Public/React-hermes" "$(PODS_ROOT)/Headers/Public/hermes-engine" "${PODS_ROOT}/LibTorch-Lite/install/include"'
  }
  s.preserve_paths = [
    "cxx/**/*.h",
    "ios/**/*.h"
  ]

  s.public_header_files = [
      "ios/Image/**/*.h",
      "ios/ML/**/*.h",
      "ios/PyTorchCore-Bridging-Header.h"
  ]

  s.resource_bundle = { 'PyTorchCore' => 'ios/Resources/**/*.xcassets' }

  s.dependency "React-callinvoker"
  s.dependency "React"
  s.dependency "React-Core"
  s.dependency "SwiftyJSON", '~> 5.0'
  s.dependency "LibTorch-Lite", "~> 1.12.0"
end
