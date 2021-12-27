/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.suite;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.pytorch.IValuePackerInstrumentedTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({IValuePackerInstrumentedTest.class})
public class InstrumentedTestSuite {}
