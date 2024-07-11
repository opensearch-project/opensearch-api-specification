/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { construct_tester_components, flatten_errors, load_expected_evaluation } from '../helpers'
import { type StoryEvaluation } from 'tester/types/eval.types'

test('stories folder', async () => {
  const { test_runner, opensearch_http_client } = construct_tester_components('tools/tests/tester/fixtures/specs/excerpt.yaml')

  const info = await opensearch_http_client.wait_until_available()
  expect(info.version).toBeDefined()

  const result = await test_runner.run('tools/tests/tester/fixtures/stories')

  expect(result.failed).toBeTruthy()

  const actual_evaluations: Array<Omit<StoryEvaluation, 'full_path'>> = []

  for (const evaluation of result.evaluations) {
    const { full_path, ...rest } = flatten_errors(evaluation)
    expect(full_path.endsWith(rest.display_path)).toBeTruthy()
    actual_evaluations.push(rest)
  }

  const passed = load_expected_evaluation('passed', true)
  const not_found = load_expected_evaluation('failed/not_found', true)
  const invalid_data = load_expected_evaluation('failed/invalid_data', true)
  const chapter_error = load_expected_evaluation('error/chapter_error', true)
  const prologue_error = load_expected_evaluation('error/prologue_error', true)

  const expected_evaluations = [passed, chapter_error, prologue_error, invalid_data, not_found]
  expect(actual_evaluations).toEqual(expected_evaluations)
})
