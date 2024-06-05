/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { construct_tester_components, load_actual_evaluation, load_expected_evaluation } from './helpers'

const { story_evaluator } = construct_tester_components('tools/tests/tester/fixtures/specs/indices_excerpt.yaml')

test('passed', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'passed')
  const expected = load_expected_evaluation('passed')
  expect(actual).toEqual(expected)
})

test('skipped', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'skipped')
  const expected = load_expected_evaluation('skipped')
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

test('error/chapter_error', async () => {
  const actual = await load_actual_evaluation(story_evaluator, 'error/chapter_error')
  const expected = load_expected_evaluation('error/chapter_error')
  expect(actual).toEqual(expected)
})
