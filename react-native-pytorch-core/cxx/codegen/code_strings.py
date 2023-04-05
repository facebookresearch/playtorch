# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from dataclasses import dataclass
from string import Template
from typing import Dict

# TensorHostObject.cpp

cpp_file_start = """#include <c10/core/MemoryFormat.h>
#include <c10/util/Optional.h>

#include "TensorHostObject.h"
#include "TensorHostObjectDeprecated.h"
#include "utils/ArgumentParser.h"
#include "utils/constants.h"
#include "utils/helpers.h"

// Namespace alias for torch to avoid namespace conflicts with torchlive::torch
namespace torch_ = torch;

namespace torchlive {
namespace torch {

// TensorHostObject Method Names
static const std::string SIZE = "size";
static const std::string TOSTRING = "toString";

// TensorHostObject Property Names
static const std::string DATA = "data";
static const std::string DTYPE = "dtype";
static const std::string SHAPE = "shape";

// TensorHostObject Properties
static const std::vector<std::string> PROPERTIES = {DATA, DTYPE, SHAPE};

// TensorHostObject Methods
static const std::vector<std::string> METHODS = {SIZE, TOSTRING};

using namespace facebook;

"""
cpp_start_namespace = """namespace {"""

cpp_function_implementation_start = Template(
    """

jsi::Value ${operator_name}Impl(
  jsi::Runtime& runtime,
  const jsi::Value& thisValue,
  const jsi::Value* arguments,
  size_t count) {
    utils::ArgumentParser args(runtime, thisValue, arguments, count);
    args.requireNumArguments(${num_required_args});"""
)

cpp_throw_BigInt = Template(
    """

    // TODO(T113480543): enable BigInt once Hermes supports it
    if (thisValue.asObject(runtime).asHostObject<TensorHostObject>(runtime)->tensor.dtype() == torch_::kInt64) {
      throw jsi::JSError(
        runtime,
        "the property '${op_name}' for a tensor of dtype torch.int64 is not"
        " supported. Work around this with .to({dtype: torch.int32})"
        " This might alter the tensor values.");
    }
"""
)

cpp_at_least_num_arguments_template = Template("args.atLeastNumArguments(${num_args})")

cpp_try_signature_template = Template(
    """
if(${check_argument_types}) {
    ${get_arguments_string}
    ${get_returns_string}
}
"""
)

cpp_throw_error_template = Template(
    '    throw facebook::jsi::JSError(runtime, "Arguments for op ${op_name} do not match any of the following signatures:${signatures}");'
)

cpp_function_implementation_end = "  }"

cpp_end_namespace = "\n}\n"

cpp_tensor_host_object_start = """
TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
  : BaseHostObject(runtime),
  size_(createSize(runtime)),
  toString_(createToString(runtime)),
  tensor(t) {
"""

cpp_set_property_host_function_template = Template(
    """    setPropertyHostFunction(runtime, "${operator_name}", ${num_required_args}, ${namespace}${operator_name}Impl);
"""
)


cpp_file_end = """}

TensorHostObject::~TensorHostObject() {}

std::vector<jsi::PropNameID> TensorHostObject::getPropertyNames(
  jsi::Runtime& runtime) {
    auto result = BaseHostObject::getPropertyNames(runtime);
    for (std::string property : PROPERTIES) {
      result.push_back(jsi::PropNameID::forUtf8(runtime, property));
    }
    for (std::string method : METHODS) {
      result.push_back(jsi::PropNameID::forUtf8(runtime, method));
    }
    return result;
}

jsi::Value TensorHostObject::get(
  jsi::Runtime& runtime,
  const jsi::PropNameID& propNameId) {
      auto name = propNameId.utf8(runtime);

      if (name == DTYPE) {
        return jsi::String::createFromUtf8(
          runtime,
          utils::constants::getStringFromDtype(
            caffe2::typeMetaToScalarType(this->tensor.dtype())));
      } else if (name == SHAPE) {
        return this->size_.call(runtime);
      } else if (name == SIZE) {
        return jsi::Value(runtime, size_);
      } else if (name == TOSTRING) {
        return jsi::Value(runtime, toString_);
      }

      int idx = -1;
      try {
        idx = std::stoi(name.c_str());
      } catch (...) {
        // Cannot parse name value to int. This can happen when the name in bracket
        // or dot notion is not an int (e.g., tensor['foo']).
        // Let's ignore this exception here since this function will return
        // undefined if it reaches the function end.
      }
      // Check if index is within bounds of dimension 0
      if (idx >= 0 && idx < this->tensor.size(0)) {
        auto outputTensor = this->tensor.index({idx});
        auto tensorHostObject =
        std::make_shared<torchlive::torch::TensorHostObject>(
          runtime, std::move(outputTensor));
        return jsi::Object::createFromHostObject(runtime, tensorHostObject);
      }

      return BaseHostObject::get(runtime, propNameId);
    }

jsi::Function TensorHostObject::createToString(jsi::Runtime& runtime) {
  auto toStringFunc = [this](
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) -> jsi::Value {
      auto tensor = this->tensor;
      std::ostringstream stream;
      stream << tensor;
      std::string tensor_string = stream.str();
      auto val = jsi::String::createFromUtf8(runtime, tensor_string);
      return jsi::Value(std::move(val));
    };
    return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, TOSTRING), 0, toStringFunc);
  }

jsi::Function TensorHostObject::createSize(jsi::Runtime& runtime) {
  auto sizeFunc = [this](
    jsi::Runtime& runtime,
    const jsi::Value& thisValue,
    const jsi::Value* arguments,
    size_t count) -> jsi::Value {
      auto tensor = this->tensor;
      torch_::IntArrayRef dims = tensor.sizes();
      jsi::Array jsShape = jsi::Array(runtime, dims.size());
      for (int i = 0; i < dims.size(); i++) {
        jsShape.setValueAtIndex(runtime, i, jsi::Value((int)dims[i]));
      }
      return jsShape;
    };
    return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forUtf8(runtime, SIZE), 0, sizeFunc);
  }
} // namespace torch
} // namespace torchlive
"""

cpp_get_self_template = Template(
    """            auto ${name} = args.thisAsHostObject<TensorHostObject>();"""
)

cpp_positional_argument_string_templates = {
    "const at::Tensor &": Template(
        """            auto ${name} = args.asHostObject<TensorHostObject>(${arg_index})->tensor;"""
    ),
    "const at::Scalar &": Template(
        """            auto ${name} = args.asScalar(${arg_index});"""
    ),
}

cpp_kword_argument_string_templates = {
    "const at::Scalar &": Template(
        """            auto ${name} = args.asScalarKwarg(${arg_index}, "${name}", at::Scalar(${default}));"""
    ),
}

cpp_required_kword_argument_string_templates = {
    "const at::Scalar &": Template(
        """            auto ${name} = args.asScalarKwarg(${arg_index}, "${name}");"""
    ),
}

cpp_returns_type_templates = {
    "at::Tensor": Template(
        """
            ${return_type} ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(${returns_name}));"""
    ),
    "at::Scalar": Template(
        """
            auto ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
            if (${returns_name}.isIntegral(/*includeBool=*/false)) {
                return jsi::Value(${returns_name}.toInt());
            } else if (${returns_name}.isFloatingPoint()) {
                return jsi::Value(${returns_name}.toDouble());
            } else {
                throw jsi::JSError(runtime, "unsupported dtype for item().");
            }"""
    ),
}

cpp_check_argument_type_templates = {
    "const at::Scalar &": Template("args.isScalar(${idx})"),
    "const at::Tensor &": Template("args.isHostObject<TensorHostObject>(${idx})"),
}

cpp_check_kword_argument_type_templates = {
    "const at::Scalar &": Template(
        'args.isScalarKwarg(${idx}, "${name}", ${required})'
    ),
}

cpp_argument_string_error_template = Template(
    '            throw facebook::jsi::JSError(runtime, "Argument parsing for type ${arg_type} has not been implemented yet");'
)

cpp_returns_string_error_template = Template(
    'throw facebook::jsi::JSError(runtime, "Generating code for return type ${return_type} has not been implemented");'
)


@dataclass
class CppCodeStrings:
    file_start: str
    start_namespace: str
    function_implementation_start: str
    at_least_num_arguments_template: Template
    try_signature_template: Template
    throw_error_template: Template
    function_implementation_end: Template
    end_namespace: str
    tensor_host_object_start: str
    set_property_host_function_template: Template
    file_end: str
    get_self_template: Template
    positional_argument_string_templates: Dict[str, Template]
    kword_argument_string_templates: Dict[str, Template]
    required_kword_argument_string_templates: Dict[str, Template]
    returns_type_templates: Dict[str, Template]
    check_argument_type_templates: Dict[str, Template]
    check_kword_argument_type_templates: Dict[str, Template]
    argument_string_error_template: Template
    returns_string_error_template: Template

    def __init__(self):
        self.file_start = cpp_file_start
        self.start_namespace = cpp_start_namespace
        self.function_implementation_start = cpp_function_implementation_start
        self.throw_BigInt = cpp_throw_BigInt
        self.at_least_num_arguments_template = cpp_at_least_num_arguments_template
        self.try_signature_template = cpp_try_signature_template
        self.throw_error_template = cpp_throw_error_template
        self.function_implementation_end = cpp_function_implementation_end
        self.end_namespace = cpp_end_namespace
        self.tensor_host_object_start = cpp_tensor_host_object_start
        self.set_property_host_function_template = (
            cpp_set_property_host_function_template
        )
        self.file_end = cpp_file_end
        self.get_self_template = cpp_get_self_template
        self.positional_argument_string_templates = (
            cpp_positional_argument_string_templates
        )
        self.kword_argument_string_templates = cpp_kword_argument_string_templates
        self.required_kword_argument_string_templates = (
            cpp_required_kword_argument_string_templates
        )
        self.returns_type_templates = cpp_returns_type_templates
        self.check_argument_type_templates = cpp_check_argument_type_templates
        self.check_kword_argument_type_templates = (
            cpp_check_kword_argument_type_templates
        )
        self.argument_string_error_template = cpp_argument_string_error_template
        self.returns_string_error_template = cpp_returns_string_error_template


cpp_code_strings = CppCodeStrings()
