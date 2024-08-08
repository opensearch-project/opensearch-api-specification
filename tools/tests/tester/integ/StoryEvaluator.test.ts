/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Result } from 'tester/types/eval.types'
import { construct_tester_components, load_actual_evaluation, load_expected_evaluation } from '../helpers'

const { story_evaluator, chapter_evaluator, opensearch_http_client } = construct_tester_components('tools/tests/tester/fixtures/specs/excerpt.yaml')

beforeAll(async () => {
  const info = await opensearch_http_client.wait_until_available()
  expect(info.version).toBeDefined()
})

afterEach(() => {
  jest.resetAllMocks()
})

test('passed', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'passed')
  const expected = load_expected_evaluation('passed')
  expect(actual).toEqual(expected)
})

test('failed/not_found', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'failed/not_found')
  const expected = load_expected_evaluation('failed/not_found')
  expect(actual).toEqual(expected)
})

test('failed/invalid_data', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'failed/invalid_data')
  const expected = load_expected_evaluation('failed/invalid_data')
  expect(actual).toEqual(expected)
})

test('error/prologue_error', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'error/prologue_error')
  const expected = load_expected_evaluation('error/prologue_error')
  expect(actual).toEqual(expected)
})

test('error/output_error', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'error/output_error')
  const expected = load_expected_evaluation('error/output_error')
  expect(actual).toEqual(expected)
})

test('error/chapter_error', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'error/chapter_error')
  const expected = load_expected_evaluation('error/chapter_error')
  expect(actual).toEqual(expected)
})

test('skipped/semver', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'skipped/semver')
  const expected = load_expected_evaluation('skipped/semver')
  expect(actual).toEqual(expected)
})

test('with an unexpected error', async () => {
  chapter_evaluator.evaluate = jest.fn().mockImplementation(() => {
    throw new Error('This was unexpected.');
  })
  const actual = await load_actual_evaluation(story_evaluator, 'passed')
  expect(actual.result).toEqual(Result.ERROR)
  expect(actual.chapters && actual.chapters[0]).toEqual({
    title: "This PUT /{index} chapter should pass.",
    overall: {
      error: 'This was unexpected.',
      message: 'This was unexpected.',
      result: Result.ERROR
    }
  })
})