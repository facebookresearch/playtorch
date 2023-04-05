# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

tensor_interface_deprecated = {
    "abs": """
  /**
   * Computes the absolute value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.abs.html}
   */
  abs(): Tensor;""",
    "add": """
  /**
   * Add a scalar or tensor to this tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.add.html}
   *
   * @param other Scalar or tensor to be added to each element in this tensor.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  add(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;""",
    "argmax": """
  /**
   * Returns the indices of the maximum value of all elements in the input
   * tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmax.html}
   *
   * @param options argmax Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmax of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmax(options?: {dim?: number; keepdim?: boolean}): Tensor;""",
    "argmin": """
  /**
   * Returns the indices of the minimum value(s) of the flattened tensor or along a dimension
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmin.html}
   *
   * @param options argmin Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmin of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmin(options?: {dim?: number; keepdim?: boolean}): Tensor;""",
    "clamp": """
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param min Lower-bound of the range to be clamped to
   * @param max Upper-bound of the range to be clamped to
   */
  clamp(min: Scalar | Tensor, max?: Scalar | Tensor): Tensor;
  /**
   * Clamps all elements in input into the range `[ min, max ]`.
   *
   * If `min` is `undefined`, there is no lower bound. Or, if `max` is `undefined` there is no upper bound.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.clamp.html}
   *
   * @param options.min Lower-bound of the range to be clamped to
   * @param options.max Upper-bound of the range to be clamped to
   */
  clamp(options: {min?: Scalar | Tensor; max?: Scalar | Tensor}): Tensor;""",
    "contiguous": """
  /**
   * Returns a contiguous in memory tensor containing the same data as this
   * tensor. If this tensor is already in the specified memory format, this
   * function returns this tensor.
   *
   * @param options.memoryFormat The desired memory format of returned Tensor. Default: torch.contiguousFormat.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.contiguous.html}
   */
  contiguous(options?: {memoryFormat: MemoryFormat}): Tensor;""",
    "data": """
  /**
   * Returns the tensor data as `TypedArray` buffer.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
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
   * @experimental
   */
  data(): TypedArray;""",
    "div": """
  /**
   * Divides each element of the input input by the corresponding element of
   * other.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.div.html}
   *
   * @param other Scalar or tensor that divides each element in this tensor.
   * @param options.roundingMode Type of rounding applied to the result
   */
  div(
    other: Scalar | Tensor,
    options?: {roundingMode?: 'trunc' | 'floor'},
  ): Tensor;""",
    "dtype": """
  /**
   * A dtype is an string that represents the data type of a torch.Tensor.
   *
   * {@link https://pytorch.org/docs/1.12/tensor_attributes.html}
   */
  dtype: Dtype;""",
    "expand": """
  /**
   * Returns a new view of the tensor expanded to a larger size.
   *
   * {@link https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html}
   *
   * @param sizes The expanded size, eg: ([3, 4]).
   */
  expand(sizes: number[]): Tensor;""",
    "flip": """
  /**
   * Reverse the order of a n-D tensor along given axis in dims.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.flip.html}
   *
   * @param dims Axis to flip on.
   */
  flip(dims: number[]): Tensor;""",
    "item": """
  /**
   * Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.item.html}
   */
  item(): number;""",
    "reshape": """
  /**
   * Returns a tensor with the same data and number of elements as input, but
   * with the specified shape.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reshape.html}
   *
   * @param shape The new shape.
   */
  reshape(shape: number[]): Tensor;""",
    "matmul": """
  /**
   * Performs matrix multiplication with other tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matmul.html}
   *
   * @param other tensor matrix multiplied this tensor.
   */
  matmul(other: Tensor): Tensor;""",
    "mul": """
  /**
   * Multiplies input by other scalar or tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mul.html}
   *
   * @param other Scalar or tensor multiplied with each element in this tensor.
   */
  mul(other: Scalar | Tensor): Tensor;""",
    "permute": """
  /**
   * Returns a view of the original tensor input with its dimensions permuted.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.permute.html}
   *
   * @param dims The desired ordering of dimensions.
   */
  permute(dims: number[]): Tensor;""",
    "shape": """
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  shape: number[];""",
    "size": """
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  size(): number[];""",
    "softmax": """
  /**
   * Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.nn.functional.softmax.html}
   *
   * @param dim A dimension along which softmax will be computed.
   */
  softmax(dim: number): Tensor;""",
    "sqrt": """
  /**
   * Computes the square-root value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sqrt.html}
   */
  sqrt(): Tensor;""",
    "squeeze": """
  /**
   * Returns a tensor with all the dimensions of input of size 1 removed.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.squeeze.html}
   *
   * @param dim If given, the input will be squeezed only in this dimension.
   */
  squeeze(dim?: number): Tensor;""",
    "stride": """
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   */
  stride(): number[];
  /**
   * Returns the stride of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.stride.html}
   *
   * @param dim The desired dimension in which stride is required.
   */
  stride(dim: number): number;""",
    "sub": """
  /**
   * Subtracts other from input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sub.html}
   *
   * @param other The scalar or tensor to subtract from input.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  sub(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;""",
    "sum": """
  /**
   * Returns the sum of all elements in the input tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   */
  sum(): Tensor;
  /**
   * Returns the sum of each row of the input tensor in the given dimension dim.
   * If dim is a list of dimensions, reduce over all of them.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sum.html}
   *
   * @param dim The dimension or dimensions to reduce.
   * @param options.keepdim Whether the output tensor has `dim` retained or not.
   */
  sum(dim: number | number[], options?: {keepdim?: boolean}): Tensor;""",
    "to": """
  /**
   * Performs Tensor conversion.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to.html}
   *
   * @param options Tensor options.
   */
  to(options: TensorOptions): Tensor;""",
    "topk": """
  /**
   * Returns a list of two Tensors where the first represents the k largest elements of the given input tensor,
   * and the second represents the indices of the k largest elements.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.topk.html}
   *
   * @param k The k in "top-k"
   * @param options topk Options as keywords argument in pytorch
   * @param options.dim The dimension to sort along. If dim is not given, the last dimension of the input is chosen.
   * @param options.largest Controls whether to return largest or smallest elements. It is set to True by default.
   * @param options.sorted Controls whether to return the elements in sorted order. It is set to True by default.
   */
  topk(
    k: number,
    options?: {dim?: number; largest?: boolean; sorted?: boolean},
  ): [Tensor, Tensor];""",
    "unsqueeze": """
  /**
   * Returns a new tensor with a dimension of size one inserted at the
   * specified position.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.unsqueeze.html}
   *
   * @param dim The index at which to insert the singleton dimension.
   */
  unsqueeze(dim: number): Tensor;""",
    "index": """
  /**
   * Access tensor with index.
   *
   * ```typescript
   * const tensor = torch.rand([2]);
   * console.log(tensor.data, tensor[0].data);
   * // [0.8339180946350098, 0.17733973264694214], [0.8339180946350098]
   * ```
   *
   * {@link https://pytorch.org/cppdocs/notes/tensor_indexing.html}
   */
  [index: number]: Tensor;""",
}
