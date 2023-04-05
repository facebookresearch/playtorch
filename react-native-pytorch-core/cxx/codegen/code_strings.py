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
    "int64_t": Template(
        """auto ${name} = args.asInt64Kwarg(${arg_index}, "${name}", ${default});"""
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
    "at::Tensor &": Template(
        """
            auto ${returns_name}Return = ${self}->tensor.${operator_name}(${arguments});
            if(${returns_name}Return.dtype() == utils::constants::getDtypeFromString("int64")) {
                ${returns_name}Return = ${returns_name}Return.to(c10::ScalarType::Int);
            }
            return utils::helpers::createFromHostObject<TensorHostObject>(runtime, std::move(${returns_name}Return));"""
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
    "null": Template(
        """
          ${self}->tensor.${operator_name}(${arguments});
          return jsi::Value::null();"""
    ),
}

cpp_check_argument_type_templates = {
    "const at::Scalar &": Template("args.isScalar(${idx})"),
    "const at::Tensor &": Template("args.isHostObject<TensorHostObject>(${idx})"),
    "int64_t": Template("args.isInt64(${idx})"),
    "at::IntArrayRef": Template("args.isIntArrayRef(${idx})"),
}

intermediate_return_value_template = Template(
    """
        ${return_type} intermediateTuple = ${self}->tensor.${operator_name}(${arguments});"""
)

unwrap_intermediate_return_type_templates = {
    "at::Tensor": Template(
        """
            auto ${returns_name}Tensor = std::get<${returns_index}>(intermediateTuple);
            if(${returns_name}Tensor.dtype() == utils::constants::getDtypeFromString("int64")) {
                ${returns_name}Tensor = ${returns_name}Tensor.to(c10::ScalarType::Int);
            }
            auto ${returns_name} = utils::helpers::createFromHostObject<TensorHostObject>(runtime, ${returns_name}Tensor);"""
    )
}

combine_intermediate_return_types_templates = {
    "::std::tuple<at::Tensor,at::Tensor>": Template(
        """
        return jsi::Array::createWithElements(runtime, ${returns_names});"""
    )
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
    "int64_t": Template('args.isInt64Kwarg(${idx}, "${name}", ${required})'),
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
    intermediate_return_value_template: Template
    unwrap_intermediate_return_type_templates: Template

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
        self.intermediate_return_value_template = intermediate_return_value_template
        self.unwrap_intermediate_return_type_templates = (
            unwrap_intermediate_return_type_templates
        )
        self.combine_intermediate_return_types_templates = (
            combine_intermediate_return_types_templates
        )


cpp_code_strings = CppCodeStrings()

# torch.ts

op_descriptions = {
    "abs": """Computes the absolute value of each element in input.""",
    "add": """Add a scalar or tensor to this tensor.""",
    "argmax": """Returns the indices of the maximum value of all elements in the input
   * tensor.""",
    "argmin": """Returns the indices of the minimum value(s) of the flattened tensor or along a dimension""",
    "clamp": """Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   """,
    "contiguous": """Returns a contiguous in memory tensor containing the same data as this
   * tensor. If this tensor is already in the specified memory format, this
   * function returns this tensor.""",
    "data": """Returns the tensor data as `TypedArray` buffer.
   *
   * A valid TypeScript expression is as follows:
   *
   * ```typescript
   * torch.rand([2, 3]).data()[3];
   * ```
   *
   * :::note
   *
   * The function only exists in JavaScript.
   *
   * :::
   *
   * @experimental""",
    "div": """Divides each element of the input input by the corresponding element of
   * other.""",
    "dtype": """A dtype is an string that represents the data type of a torch.Tensor.""",
    "expand": """Returns a new view of the tensor expanded to a larger size.""",
    "flip": """Reverse the order of a n-D tensor along given axis in dims.""",
    "item": """Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.""",
    "reshape": """Returns a tensor with the same data and number of elements as input, but
   * with the specified shape.""",
    "matmul": """Performs matrix multiplication with other tensor.""",
    "mul": """Multiplies input by other scalar or tensor.""",
    "permute": """Returns a view of the original tensor input with its dimensions permuted.""",
    "shape": """Returns the size of the tensor.""",
    "size": """Returns the size of the tensor.""",
    "softmax": """Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.""",
    "sqrt": """Computes the square-root value of each element in input.""",
    "squeeze": """Returns a tensor with all the dimensions of input of size 1 removed.""",
    "stride": """Returns the stride of the tensor.""",
    "sub": """Subtracts other from input.""",
    "sum": """Returns the sum of all elements in the input tensor.""",
    "to": """Performs Tensor conversion.""",
    "topk": """Returns a list of two Tensors where the first represents the k largest elements of the given input tensor,
   * and the second represents the indices of the k largest elements.""",
    "unsqueeze": """Returns a new tensor with a dimension of size one inserted at the
   * specified position.""",
    "index": """Access tensor with index.""",
}

ts_return_type_mappings = {
    "data": "TypedArray",
    "at::Tensor": "Tensor",
    "at::Tensor &": "Tensor",
    "at::Scalar": "number",
    "::std::tuple<at::Tensor, at::Tensor>": "[Tensor, Tensor]",
    "null": "null",
}

required_ts_argument_type_mappings = {
    "const at::Tensor &": "Tensor",
    "at::Tensor &": "Tensor",
    "const at::Scalar &": "Scalar",
    "int64_t": "number",
    "at::IntArrayRef": "number[]",
    "c10::optional<c10::string_view>_div_roundingMode": '"trunc" | "floor"',
}

optional_ts_argument_type_mappings = {
    "const at::Scalar &": "Number",
    "c10::optional<int64_t>": "number",
    "bool": "boolean",
    "at::MemoryFormat": "MemoryFormat",
    "int64_t": "number",
}

ts_start_interface = "export interface Tensor {"

ts_definition_template_header = Template(
    """
  /**
   * ${description}
   *
   * {@link ${link}}
"""
)

ts_declaration_template = Template(
    """
   */
  ${name}${arguments}: ${return_type};"""
)

ts_link_template = Template(
    "https://pytorch.org/docs/1.12/generated/torch.Tensor.${name}.html"
)

special_case_links = {
    "data": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray",
    "dtype": "https://pytorch.org/docs/1.12/tensor_attributes.html",
    "softmax": "https://pytorch.org/docs/1.12/generated/torch.nn.functional.softmax.html",
    "index": "https://pytorch.org/cppdocs/notes/tensor_indexing.html",
}


ts_param_template = Template("   * @param ${name} ${description}")
ts_arg_template = Template("${name}: ${type}")
ts_options_template = Template("options${question_mark}: {${optional_arguments}}")

ts_end_interface = "\n} // Tensor\n"


@dataclass
class TSCodeStrings:
    op_descriptions: Dict[str, str]
    return_type_mappings: Dict[str, str]
    required_argument_type_mappings: Dict[str, str]
    optional_argument_type_mappings: Dict[str, str]
    start_interface: str
    definition_template_header: Template
    declaration_template: Template
    link_template: Template
    special_case_links: Dict[str, str]
    param_template: Template
    arg_template: Template
    options_template: Template
    end_interface: str

    def __init__(self):
        self.op_descriptions = op_descriptions
        self.return_type_mappings = ts_return_type_mappings
        self.required_argument_type_mappings = required_ts_argument_type_mappings
        self.optional_argument_type_mappings = optional_ts_argument_type_mappings
        self.start_interface = ts_start_interface
        self.definition_template_header = ts_definition_template_header
        self.declaration_template = ts_declaration_template
        self.link_template = ts_link_template
        self.special_case_links = special_case_links
        self.param_template = ts_param_template
        self.arg_template = ts_arg_template
        self.options_template = ts_options_template
        self.end_interface = ts_end_interface


ts_code_strings = TSCodeStrings()
