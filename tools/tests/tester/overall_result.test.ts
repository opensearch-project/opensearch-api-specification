/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { overall_result } from '../../src/tester/helpers'
import { type Evaluation, Result } from '../../src/tester/types/eval.types'

function e (...results: Result[]): Evaluation[] {
  return results.map(result => ({ result }))
}
test('overall_result', () => {
  expect(overall_result(e(Result.PASSED, Result.SKIPPED, Result.FAILED, Result.ERROR))).toBe(Result.ERROR)
  expect(overall_result(e(Result.PASSED, Result.SKIPPED, Result.FAILED))).toBe(Result.FAILED)
  expect(overall_result(e(Result.PASSED, Result.SKIPPED))).toBe(Result.SKIPPED)
  expect(overall_result(e(Result.PASSED))).toBe(Result.PASSED)
  expect(overall_result(e())).toBe(Result.PASSED)
})
