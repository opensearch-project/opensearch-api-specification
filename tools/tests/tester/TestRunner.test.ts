/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { construct_tester_components, load_expected_evaluation, scrub_errors } from './helpers'

test('stories folder', async () => {
  const { test_runner } = construct_tester_components('tools/tests/tester/fixtures/specs/indices_excerpt.yaml')
  const result = await test_runner.run('tools/tests/tester/fixtures/stories', true)

  expect(result.failed).toBeTruthy()

  const actual_evaluations: any[] = result.evaluations

  for (const evaluation of actual_evaluations) {
    expect(evaluation.full_path.endsWith(evaluation.display_path)).toBeTruthy()
    scrub_errors(evaluation)
    delete evaluation.full_path
  }

  const skipped = load_expected_evaluation('skipped', true)
  const passed = load_expected_evaluation('passed', true)
  const not_found = load_expected_evaluation('failed/not_found', true)
  const invalid_data = load_expected_evaluation('failed/invalid_data', true)
  const chapter_error = load_expected_evaluation('error/chapter_error', true)
  const prologue_error = load_expected_evaluation('error/prologue_error', true)

  const expected_evaluations = [passed, skipped, chapter_error, prologue_error, invalid_data, not_found]
  expect(actual_evaluations).toEqual(expected_evaluations)
})
