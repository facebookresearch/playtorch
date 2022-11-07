# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from dataclasses import dataclass
from string import Template
from typing import Dict

# TensorHostObject.cpp

cpp_start_namespace = """namespace {"""

cpp_function_implementation_start = Template(
    """jsi::Value ${operator_name}Impl(
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
    'throw facebook::jsi::JSError(runtime, "Arguments for op ${op_name} do not match any of the following signatures:${signatures}");'
)

cpp_function_implementation_end = "}"

cpp_end_namespace = "\n} // namespace\n"

cpp_tensor_host_object_start = """
TensorHostObject::TensorHostObject(jsi::Runtime& runtime, torch_::Tensor t)
  : BaseHostObject(runtime),
  size_(createSize(runtime)),
  toString_(createToString(runtime)),
  tensor(t) {
"""

cpp_set_property_host_function_template = Template(
    """setPropertyHostFunction(runtime, "${operator_name}", ${num_required_args}, ${namespace}${operator_name}Impl);"""
)

cpp_tensor_host_object_end = "}\n\n"


cpp_get_self_template = Template(
    """auto ${name} = args.thisAsHostObject<TensorHostObject>();"""
)

cpp_positional_argument_string_templates = {
    "const at::Tensor &": Template(
        """            auto ${name} = args.asHostObject<TensorHostObject>(${arg_index})->tensor;"""
    ),
    "const at::Scalar &": Template("""auto ${name} = args.asScalar(${arg_index});"""),
    "int64_t": Template("""auto ${name} = args.asInt64(${arg_index});"""),
    "at::IntArrayRef": Template(
        """auto ${name}Pointer = args.asIntArrayRefPtr(${arg_index});
auto ${name} = c10::ArrayRef(*${name}Pointer);"""
    ),
}

cpp_kword_argument_string_templates = {
    "const at::Scalar &": Template(
        """auto ${name} = args.asScalarKwarg(${arg_index}, "${name}", at::Scalar(${default}));"""
    ),
    "c10::optional<int64_t>": Template(
        """auto ${name} = args.asC10OptionalInt64Kwarg(${arg_index}, "${name}", ${default});"""
    ),
    "bool": Template(
        """auto ${name} = args.asBoolKwarg(${arg_index}, "${name}", ${default});"""
    ),
    "at::MemoryFormat": Template(
        """auto ${name} = args.asMemoryFormatKwarg(${arg_index}, "${name}", at::${default});"""
    ),
}

cpp_required_kword_argument_string_templates = {
    "const at::Scalar &": Template(
        """auto ${name} = args.asScalarKwarg(${arg_index}, "${name}");"""
    ),
    "c10::optional<c10::string_view>": Template(
        """auto ${name} = c10::optional<c10::string_view>(args.asStringKwarg(${arg_index}, "${name}"));"""
    ),
}

cpp_returns_type_templates = {
    "at::Tensor": Template(
        """${return_type} ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
if(${returns_name}.dtype() == utils::constants::getDtypeFromString("int64")) {
  ${returns_name} = ${returns_name}.to(c10::ScalarType::Int);
}
return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(${returns_name}));"""
    ),
    "at::Scalar": Template(
        """auto ${returns_name} = ${self}->tensor.${operator_name}(${arguments});
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
    "int64_t": Template("args.isInt64(${idx})"),
    "at::IntArrayRef": Template("args.isIntArrayRef(${idx})"),
}

cpp_check_kword_argument_type_templates = {
    "const at::Scalar &": Template(
        'args.isScalarKwarg(${idx}, "${name}", ${required})'
    ),
    "c10::optional<int64_t>": Template(
        'args.isC10OptionalInt64Kwarg(${idx}, "${name}", ${required})'
    ),
    "bool": Template('args.isBoolKwarg(${idx}, "${name}", ${required})'),
    "c10::optional<c10::string_view>": Template(
        'args.isStringKwarg(${idx}, "${name}", ${required})'
    ),
    "at::MemoryFormat": Template(
        'args.isMemoryFormatKwarg(${idx}, "${name}", ${required})'
    ),
}

cpp_argument_string_error_template = Template(
    'throw facebook::jsi::JSError(runtime, "Argument parsing for type ${arg_type} has not been implemented yet");'
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
        self.tensor_host_object_end = cpp_tensor_host_object_end
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
