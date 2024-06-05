/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { read_yaml } from '../../helpers'
import TestsRunner from '../../src/tester/TestsRunner'
import { type OpenAPIV3 } from 'openapi-types'
import { load_expected_evaluation, scrub_errors } from './helpers'

describe('TestsRunner', () => {
  let spec: OpenAPIV3.Document

  beforeAll(() => {
    // The fallback password must match the default password specified in .github/opensearch-cluster/docker-compose.yml
    process.env.OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
    spec = read_yaml('tools/tests/tester/fixtures/specs/indices_excerpt.yaml')
  })

  test('run', async () => {
    const runner = new TestsRunner(spec, 'tools/tests/tester/fixtures/stories/shoes', {})
    const actual_evaluations = await runner.run(true) as any[]

    for (const evaluation of actual_evaluations) {
      scrub_errors(evaluation)
      expect(evaluation.full_path.endsWith(evaluation.display_path)).toBeTruthy()
      delete evaluation.full_path
    }

    const skipped = load_expected_evaluation('shoes/skipped', true)
    const passed = load_expected_evaluation('shoes/passed', true)
    const not_found = load_expected_evaluation('shoes/failed/not_found', true)
    const invalid_data = load_expected_evaluation('shoes/failed/invalid_data', true)
    const chapter_error = load_expected_evaluation('shoes/error/chapter_error', true)
    const prologue_error = load_expected_evaluation('shoes/error/prologue_error', true)

    const expected_evaluations = [passed, skipped, chapter_error, prologue_error, invalid_data, not_found]
    expect(actual_evaluations).toEqual(expected_evaluations)
  })
})
