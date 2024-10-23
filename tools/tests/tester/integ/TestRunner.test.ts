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

  const run = await test_runner.run('tools/tests/tester/fixtures/stories', undefined, 'opensearch.org')

  expect(run.failed).toBeTruthy()

  const actual_evaluations: Array<Omit<StoryEvaluation, 'full_path'>> = []

  for (const evaluation of run.results.evaluations) {
    const { full_path, ...rest } = flatten_errors(evaluation)
    expect(full_path.endsWith(rest.display_path)).toBeTruthy()
    actual_evaluations.push(rest)
  }

  const expected_evaluations = [
    'error/chapter_error',
    'error/output_error',
    'error/prologue_error',
    'failed/invalid_data',
    'failed/not_found',
    'passed/passed',
    'passed/value_type',
    'skipped/semver',
    'skipped/distributions/chapters',
    'skipped/distributions/excluded',
    'skipped/distributions/included'
  ].map((fixture) => { return load_expected_evaluation(fixture, true) })

  expect(actual_evaluations).toEqual(expected_evaluations)
})

describe('story_files', () => {
  const { test_runner } = construct_tester_components('tools/tests/tester/fixtures/specs/excerpt.yaml')

  test('does not contain docker-compose.yml', () => {
    expect(test_runner.story_files('tests/plugins/index_state_management').map(
      story_file => story_file.display_path
    )).not.toContain('nodes/plugins/docker-compose.yml')
  })

  test('does not contain a python script', () => {
    expect(test_runner.story_files('tests/plugins/notifications').map(
      story_file => story_file.display_path
    )).not.toContain('nodes/plugins/server.py')
  })
})
