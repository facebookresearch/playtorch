# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from string import Template

from ..codegen.op_data_structures import Argument, OpInfo

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
        try {
${get_arguments_string}
${get_returns_string}
        } catch (jsi::JSError& error) {
        // Arguments do not match signature ${signature}
        } catch (std::exception& ex) {
            throw std::move(ex);
        }
    }
"""
)

cpp_throw_error_template = Template(
    '    throw facebook::jsi::JSError(runtime, "Arguments for op ${op_name} do not match any of the following signatures:${signatures}");'
)

cpp_function_implementation_end = "  }"

cpp_end_namespace = "\n}\n"

# new

tensor_host_object_start = """
TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
  : BaseHostObject(runtime),
  size_(createSize(runtime)),
  toString_(createToString(runtime)),
  tensor(t) {
"""

set_property_host_function_template = Template(
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

argument_string_templates = {
    "const at::Tensor &_self": Template(
        """            auto ${name} = args.thisAsHostObject<TensorHostObject>();"""
    ),
    "const at::Tensor &_required": Template(
        """            auto ${name} = args.asHostObject<TensorHostObject>(${arg_index})->tensor;"""
    ),
    "const at::Scalar &": Template(
        """            auto ${name}Value = args.keywordValue(${options_index}, "${name}");
            auto ${name} = ${name}Value.isUndefined() ? at::Scalar(${default}) : at::Scalar(${name}Value.asNumber());"""
    ),
    "const at::Scalar &_required": Template(
        """            auto ${name} = args[${arg_index}].asNumber();"""
    ),
    "c10::optional<int64_t>": Template(
        """            auto ${name}Value = args.keywordValue(${options_index}, "${name}");
            c10::optional<int64_t> ${name} = ${name}Value.isUndefined() ? ${default} : (c10::optional<int64_t>) ${name}Value.asNumber();"""
    ),
    "bool": Template(
        """            auto ${name}Value = args.keywordValue(${options_index}, "${name}");
            auto ${name} = ${name}Value.isUndefined() ? ${default} : ${name}Value.getBool();"""
    ),
    "int64_t_required": Template(
        "            auto ${name} = args.asInteger(${arg_index});"
    ),
}


def get_argument_string(argument: Argument, index: int, options_index: int) -> str:
    try:
        substitutions = {
            "arg_index": index - 1,
            "name": argument.name,
            "default": argument.default,
            "options_index": options_index,
        }
        if isinstance(substitutions["default"], bool):
            substitutions["default"] = "true" if substitutions["default"] else "false"
        argument_string_key = argument.type_
        if index == 0:
            argument_string_key += "_self"
        else:
            if argument.default is None:
                argument_string_key += "_required"
        argument_string = argument_string_templates[argument_string_key].substitute(
            substitutions
        )
        argument.implemented = True
        return argument_string
    except KeyError:
        error_template = Template(
            '            throw facebook::jsi::JSError(runtime, "Argument parsing for type ${arg_type} has not been implemented yet");'
        )
        return error_template.substitute({"arg_type": argument.type_})


returns_type_templates = {
    "at::Tensor": Template(
        """
            ${return_type} ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(${returns_name}));"""
    ),
    "at::Tensor_cast_to_int32": Template(
        """
            ${return_type} ${returns_name} = ${self}->tensor.${operator_name}(${arguments}).to(torch_::TensorOptions().dtype(torch_::kInt32));
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


def get_returns_string(op: OpInfo, cast_to_int32=False) -> str:
    try:
        returns_string_key = op.returns_type
        if cast_to_int32:
            returns_string_key += "_cast_to_int32"
        return returns_type_templates[returns_string_key].substitute(
            {
                "return_type": op.returns_type,
                "returns_name": op.returns_name,
                "operator_name": op.name,
                "arguments": ", ".join([arg.name for arg in op.arguments[1:]])
                if len(op.arguments) > 1
                else "",
                "self": op.arguments[0].name,
            }
        )
    except KeyError:
        op.implemented = False
        error_template = Template(
            'throw facebook::jsi::JSError(runtime, "Generating code for return type ${return_type} has not been implemented");'
        )
        return error_template.substitute({"return_type": op.returns_type})


jsi_type_mappings = {
    "const at::Scalar &": "Number",
    "const at::Tensor &": "HostObject",
    "c10::optional<int64_t>": "Number",
    "bool": "Bool",
    "int64_t": "Number",
}

check_argument_types_template = {
    "Number_required": Template("args[${idx}].isNumber()"),
    "Number": Template(
        '(args.keywordValue(${options_index}, "${name}").isUndefined() || args.keywordValue(${options_index}, "${name}").isNumber())'
    ),
    "HostObject_required": Template(
        "args[${idx}].isObject() && args[${idx}].asObject(runtime).isHostObject<${HostObjectType}>(runtime)"
    ),
    "Bool_required": Template("args[${idx}].isBool()"),
    "Bool": Template(
        '(args.keywordValue(${options_index}, "${name}").isUndefined() || args.keywordValue(${options_index}, "${name}").isBool())'
    ),
}


def get_check_argument_types_string(op: OpInfo):
    condition_list = [
        cpp_at_least_num_arguments_template.substitute({"num_args": op.num_required})
    ]
    for i in range(1, len(op.arguments)):  # first argument is always self
        arg = op.arguments[i]
        substitutions = {
            "idx": i - 1,
            "name": arg.name,
            "options_index": op.options_index,
        }
        try:
            jsi_type = jsi_type_mappings[arg.type_]
            if jsi_type == "HostObject":
                substitutions["HostObjectType"] = "TensorHostObject"
            if arg.default is None:
                jsi_type += "_required"
            condition_list.append(
                check_argument_types_template[jsi_type].substitute(substitutions)
            )
        except KeyError:
            return "false"  # we don't want to enter that if block if the argument type hasn't been implemented yet
    return " && ".join(condition_list)
