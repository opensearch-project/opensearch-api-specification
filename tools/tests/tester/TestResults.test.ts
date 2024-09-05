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
    display_path: 'PUT /{index}',
    full_path: 'full_path',
    description: 'description',
    message: 'message',
    chapters: [{
      title: 'title',
      operation: {
        method: 'PUT',
        path: '/{index}'
      },
      overall: {
        result: Result.PASSED
      },
      path: 'PUT /{index}'
    }],
    epilogues: [],
    prologues: []
  }]

  const test_results = new TestResults(spec, { evaluations })

  test('unevaluated_operations', () => {
    expect(test_results.unevaluated_operations()).toEqual([
      { method: "GET", path: "/_nodes/{id}" },
      { method: "POST", path: "/_nodes/{id}" },
      { method: "GET", path: "/cluster_manager" },
      { method: "POST", path: "/cluster_manager" },
      { method: "GET", path: "/index" },
      { method: "GET", path: "/nodes" }
    ])
  })

  test('evaluated_operations', () => {
    expect(test_results.evaluated_operations()).toStrictEqual([
      { method: 'PUT', path: '/{index}' }
    ])
  })

  test('operations', () => {
    expect(test_results.operations()).toEqual([
      { method: "GET", path: "/_nodes/{id}" },
      { method: "POST", path: "/_nodes/{id}" },
      { method: "GET", path: "/cluster_manager" },
      { method: "POST", path: "/cluster_manager" },
      { method: "GET", path: "/index" },
      { method: "GET", path: "/nodes" }
    ])
  })

  test('write_coverage', () => {
    const filename = 'coverage.json'
    test_results.write_coverage(filename)
    expect(JSON.parse(fs.readFileSync(filename, 'utf8'))).toEqual({
      summary: {
        evaluated_operations_count: 1,
        evaluated_paths_pct: 16.67,
        total_operations_count: 6
      },
      evaluated_operations: [
        { method: 'PUT', path: '/{index}' },
      ],
      operations: [
        { method: 'GET', path: '/_nodes/{id}' },
        { method: 'POST', path: '/_nodes/{id}' },
        { method: 'GET', path: '/cluster_manager' },
        { method: 'POST', path: '/cluster_manager' },
        { method: 'GET', path: '/index' },
        { method: 'GET', path: '/nodes' }
      ]
    })
    fs.unlinkSync(filename)
  })
})
