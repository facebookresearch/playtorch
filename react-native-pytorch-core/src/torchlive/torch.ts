/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// Allows tensor data with arbitrary dimensions
type Item = ItemArray;
interface ItemArray extends Array<Item | number> {}

/**
 * TypedArray type to allow index-based access to tensor data.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
 *
 * The type should preferrably be `ArrayBufferView`. However, that type includes
 * `DataView`, which itself is not indexable.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView}
 *
 * A valid TypeScript expression is as follows:
 *
 * ```
 * torch.rand([2, 3]).data[3];
 * ```
 */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * The [[IValue]] type is a convenient type representative of all possible
 * module input/output values.
 */
export type IValue =
  | null
  | string
  | number
  | boolean
  | Tensor
  | Dict
  | IValue[];

export type Dict = {[key: string]: IValue};

export interface Module {
  /**
   * Module forward function.
   *
   * @param inputs Module inputs. Input could be of type [[IValue]]
   * @returns Module output, which is particular to the model and can be any of
   * the [[IValue]] union types.
   */
  forward<In extends IValue[], Out extends IValue>(
    ...inputs: [...In]
  ): Promise<Out>;
  /**
   * Synchronous module forward function.
   *
   * @param inputs Module inputs. Input could be of type [[IValue]]
   * @returns Module output, which is particular to the model and can be any of
   * the [[IValue]] union types.
   */
  forwardSync<In extends IValue[], Out extends IValue>(...inputs: [...In]): Out;
}

export interface JIT {
  /**
   * Loads a serialized mobile module.
   *
   * @param filePath Path to serialized mobile module.
   * @param device Device on which the model will be loaded.
   * @param extraFiles Load extra files when loading the model.
   * @returns Serialized mobile module of the specified type extending [[Module]],
   * which, if not specified, default to be [[Module]]
   */
  _loadForMobile<T extends Module = Module>(
    filePath: string,
    device?: Device,
    extraFiles?: ExtraFilesMap,
  ): Promise<T>;
  /**
   * Loads a serialized mobile module synchronously.
   *
   * @param filePath Path to serialized mobile module.
   * @param device Device on which the model will be loaded.
   * @param extraFiles Load extra files when loading the model.
   * @returns Serialized mobile module of the specified type extending [[Module]],
   * which, if not specified, default to be [[Module]]
   */
  _loadForMobileSync<T extends Module = Module>(
    filePath: string,
    device?: Device,
    extraFiles?: ExtraFilesMap,
  ): T;
}

/**
 * A [[Dtype]] is an object that represents the data type of a [[Tensor]].
 *
 * :::note
 *
 * The `int64` (a.k.a. `long`) data types are not fully supported in React Native.
 * For now, use `.to({dtype: torch.int32})` to downcast before accessing such
 * methods as `.data()` and `.item()`.
 *
 * :::
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch-dtype}
 */
export type Dtype =
  | 'double'
  | 'float'
  | 'float32'
  | 'float64'
  | 'int'
  | 'int16'
  | 'int32'
  | 'int64' // Hermes doesn't support BigInt yet (https://github.com/facebook/hermes/issues/510)
  | 'int8'
  | 'long'
  | 'short'
  | 'uint8';

/**
 * Allowed torch devices
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch-device}
 */
export type Device = 'cpu';

/**
 * Defining type for extra files loaded with `torch.jit._loadForMobile` and
 * `torch.jit._loadForMobileSync`.
 */
export type ExtraFilesMap = {[key: string]: string | null};

export type TensorOptions = {
  /**
   * The desired data type of a tensor.
   */
  dtype?: Dtype;
};

/**
 * A [[MemoryFormat]] is an object representing the memory format on which a [[Tensor]] is or will be allocated.
 *
 * {@link https://pytorch.org/docs/1.12/tensor_attributes.html#torch.torch.memory_format}
 */
export type MemoryFormat =
  | 'channelsLast'
  | 'contiguousFormat'
  | 'preserveFormat';

// Adopt the notion of a Scalar
export type Scalar = number;

export interface Tensor {
  /**
   * Computes the absolute value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.abs.html}
   */
  abs(): Tensor;
  /**
   * Add a scalar or tensor to this tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.add.html}
   *
   * @param other Scalar or tensor to be added to each element in this tensor.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  add(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
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
  argmax(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * Returns the indices of the minimum value(s) of the flattened tensor or along a dimension
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.argmin.html}
   *
   * @param options argmin Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmin of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmin(options?: {dim?: number; keepdim?: boolean}): Tensor;
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
  clamp(options: {min?: Scalar | Tensor; max?: Scalar | Tensor}): Tensor;
  /**
   * Returns a contiguous in memory tensor containing the same data as this
   * tensor. If this tensor is already in the specified memory format, this
   * function returns this tensor.
   *
   * @param options.memoryFormat The desired memory format of returned Tensor. Default: torch.contiguousFormat.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.contiguous.html}
   */
  contiguous(options?: {memoryFormat: MemoryFormat}): Tensor;
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
  data(): TypedArray;
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
  ): Tensor;
  /**
   * A dtype is an string that represents the data type of a torch.Tensor.
   *
   * {@link https://pytorch.org/docs/1.12/tensor_attributes.html}
   */
  dtype: Dtype;
  /**
   * Returns a new view of the tensor expanded to a larger size.
   *
   * {@link https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html}
   *
   * @param sizes The expanded size, eg: ([3, 4]).
   */
  expand(sizes: number[]): Tensor;
  /**
   * Reverse the order of a n-D tensor along given axis in dims.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.flip.html}
   *
   * @param dims Axis to flip on.
   */
  flip(dims: number[]): Tensor;
  /**
   * Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.item.html}
   */
  item(): number;
  /**
   * @experimental
   * 
   * Release tensor memory immediately rather than waiting for JavaScript GC
   * collecting the host object.
   */
  release(): void;
  /**
   * Returns a tensor with the same data and number of elements as input, but
   * with the specified shape.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.reshape.html}
   *
   * @param shape The new shape.
   */
  reshape(shape: number[]): Tensor;
  /**
   * Performs matrix multiplication with other tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.matmul.html}
   *
   * @param other tensor matrix multiplied this tensor.
   */
  matmul(other: Tensor): Tensor;
  /**
   * Multiplies input by other scalar or tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.mul.html}
   *
   * @param other Scalar or tensor multiplied with each element in this tensor.
   */
  mul(other: Scalar | Tensor): Tensor;
  /**
   * Returns a view of the original tensor input with its dimensions permuted.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.permute.html}
   *
   * @param dims The desired ordering of dimensions.
   */
  permute(dims: number[]): Tensor;
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  shape: number[];
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.size.html}
   */
  size(): number[];
  /**
   * Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.nn.functional.softmax.html}
   *
   * @param dim A dimension along which softmax will be computed.
   */
  softmax(dim: number): Tensor;
  /**
   * Computes the square-root value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sqrt.html}
   */
  sqrt(): Tensor;
  /**
   * Returns a tensor with all the dimensions of input of size 1 removed.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.squeeze.html}
   *
   * @param dim If given, the input will be squeezed only in this dimension.
   */
  squeeze(dim?: number): Tensor;
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
  stride(dim: number): number;
  /**
   * Subtracts other from input.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.sub.html}
   *
   * @param other The scalar or tensor to subtract from input.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  sub(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
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
  sum(dim: number | number[], options?: {keepdim?: boolean}): Tensor;
  /**
   * Performs Tensor conversion.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.to.html}
   *
   * @param options Tensor options.
   */
  to(options: TensorOptions): Tensor;
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
  ): [Tensor, Tensor];
  /**
   * Returns a new tensor with a dimension of size one inserted at the
   * specified position.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.Tensor.unsqueeze.html}
   *
   * @param dim The index at which to insert the singleton dimension.
   */
  unsqueeze(dim: number): Tensor;
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
  [index: number]: Tensor;
}

export interface Torch {
  /**
   * Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
   * `[0, end)` taken with common difference step beginning from start.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / 1` with values from the
   * interval `[start, end)` taken with common difference 1 beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(start: number, end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / step` with values from the
   * interval `[start, end)` taken with common difference `step` beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param step The gap between each pair of adjacent points.
   * @param options
   */
  arange(
    start: number,
    end: number,
    step: number,
    options?: TensorOptions,
  ): Tensor;
  /**
   * Concatenate a list of tensors along the specified axis, which default to be axis 0
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.cat.html}
   *
   * @param tensors A sequence of Tensor to be concatenated.
   * @param options used to specify the dimenstion to concate.
   */
  cat(tensors: Tensor[], options?: {dim?: number}): Tensor;
  /**
   * Returns a tensor filled with uninitialized data. The shape of the tensor
   * is defined by the variable argument size.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.empty.html}
   *
   * @param size A sequence of integers defining the shape of the output
   * tensor.
   */
  empty(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with ones on the diagonal, and zeroes elsewhere.
   * The shape of the tensor is defined by the arguments n and m.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.eye.html}
   *
   * @param n An integer defining the number of rows in the result.
   * @param m An integer defining the number of columns in the result. Optional, defaults to n.
   */
  eye(n: number, m?: number, options?: TensorOptions): Tensor;
  /**
   * Exposes the given data as a Tensor without taking ownership of the
   * original data.
   *
   * :::note
   *
   * The function exists in JavaScript and C++ (torch::from_blob).
   *
   * :::
   *
   * @param blob The blob holding the data.
   * @param sizes Should specify the shape of the tensor, strides the stride
   * @param options Tensor options
   * in each dimension.
   */
  fromBlob(blob: any, sizes?: number[], options?: TensorOptions): Tensor;
  /**
   * Creates a tensor of size `size` filled with `fillValue`. The tensor’s dtype is default to be `torch.float32`,
   * unless specified with `options`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.full.html}
   *
   * @param size  A list of integers defining the shape of the output tensor.
   * @param fillValue The value to fill the output tensor with.
   * @param options Object to customizing dtype, etc. default to be {dtype: torch.float32}
   */
  full(size: number[], fillValue: number, options?: TensorOptions): Tensor;
  /**
   * Creates a one-dimensional tensor of size steps whose values are evenly spaced from `start` to `end`,
   * inclusive.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.linspace.html}
   *
   * @param start Starting value for the set of points
   * @param end Ending value for the set of points
   * @param steps Size of the constructed tensor
   * @param options Object to customizing dtype. default to be {dtype: torch.float32}
   */
  linspace(
    start: number,
    end: number,
    steps: number,
    options?: TensorOptions,
  ): Tensor;
  /**
   * Returns a one-dimensional tensor of size steps whose values are evenly spaced from
   * base^start to base^end, inclusive, on a logarithmic scale with base.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.logspace.html}
   *
   * @param start Starting value for the set of points
   * @param end Ending value for the set of points
   * @param steps Size of the constructed tensor
   * @param options Object to customizing base and dtype. default to be {base: 10, dtype: torch.float32}
   */
  logspace(
    start: number,
    end: number,
    steps: number,
    options?: TensorOptions & {base: number},
  ): Tensor;
  /**
   * Returns a tensor filled with the scalar value 1, with the shape defined
   * by the argument `size`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.ones.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  ones(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with random numbers from a uniform distribution on
   * the interval `[0, 1)`.
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  rand(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `0` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randint.html}
   *
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(high: number, size: number[]): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `low` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randint.html}
   *
   * @param low Lowest integer to be drawn from the distribution.
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(low: number, high: number, size: number[]): Tensor;
  /**
   * Returns a tensor filled with random numbers from a normal distribution
   * with mean 0 and variance 1 (also called the standard normal distribution).
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randn.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  randn(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a random permutation of integers from 0 to n - 1
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.randperm.html}
   *
   * @param n The upper bound (exclusive)
   * @param options Object to customizing dtype, etc. default to be {dtype: torch.int64}.
   */
  randperm(n: number, options?: TensorOptions): Tensor;
  /**
   * Constructs a tensor with no autograd history.
   *
   * @param data Tensor data as multi-dimensional array.
   * @param options Tensor options.
   */
  tensor(data: Scalar | ItemArray, options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with the scalar value 0, with the shape defined
   * by the argument `size`.
   *
   * {@link https://pytorch.org/docs/1.12/generated/torch.zeros.html}
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  zeros(size: number[], options?: TensorOptions): Tensor;

  /**
   * JIT module
   */
  jit: JIT;

  // Tensor Data Type
  double: 'double';
  float: 'float';
  float32: 'float32';
  float64: 'float64';
  int: 'int';
  int16: 'int16';
  int32: 'int32';
  int64: 'int64';
  int8: 'int8';
  long: 'long';
  short: 'short';
  uint8: 'uint8';

  // Memory Format
  channelsLast: 'channelsLast';
  contiguousFormat: 'contiguousFormat';
  preserveFormat: 'preserveFormat';
}

type Torchlive = {
  torch: Torch;
};

declare const __torchlive__: Torchlive;

export const torch: Torch = __torchlive__.torch;
