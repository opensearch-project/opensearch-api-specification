/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import MergedOpenApiSpec from "tester/MergedOpenApiSpec"
import TestResults from "tester/TestResults"
import { Result } from "tester/types/eval.types"
import fs from 'fs'

describe('TestResults', () => {
  const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete')

  const evaluations = [{
    result: Result.PASSED,
    display_path: 'path',
    full_path: 'full_path',
    description: 'description',
    message: 'message',
    chapters: [{
      title: 'title',
      overall: {
        result: Result.PASSED
      },
      path: 'path'
    }],
    epilogues: [],
    prologues: []
  }]

  const test_results = new TestResults(spec, { evaluations })

  test('evaluated_paths_count', () => {
    expect(test_results.evaluated_paths_count()).toEqual(1)
  })

  test('spec_paths_count', () => {
    expect(test_results.spec_paths_count()).toEqual(6)
  })

  test('write_coverage', () => {
    const filename = 'coverage.json'
    test_results.write_coverage(filename)
    expect(JSON.parse(fs.readFileSync(filename, 'utf8'))).toEqual({
      evaluated_paths_count: 1,
      evaluated_paths_pct: 16.67,
      paths_count: 6
    })
    fs.unlinkSync(filename)
  })
})
