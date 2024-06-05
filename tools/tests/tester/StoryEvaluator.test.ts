/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { create_shared_resources, load_actual_evaluation, load_expected_evaluation } from './helpers'
import { read_yaml } from '../../helpers'

describe('StoryEvaluator', () => {
  beforeAll(() => {
    // The fallback password must match the default password specified in .github/opensearch-cluster/docker-compose.yml
    process.env.OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
    const spec = read_yaml('tools/tests/tester/fixtures/specs/indices_excerpt.yaml')
    create_shared_resources(spec)
  })

  test('passed', async () => {
    const actual = await load_actual_evaluation('books/passed')
    const expected = load_expected_evaluation('books/passed')
    expect(actual).toEqual(expected)
  })

  test('skipped', async () => {
    const actual = await load_actual_evaluation('books/skipped')
    const expected = load_expected_evaluation('books/skipped')
    expect(actual).toEqual(expected)
  })

  test('failed/not_found', async () => {
    const actual = await load_actual_evaluation('books/failed/not_found')
    const expected = load_expected_evaluation('books/failed/not_found')
    expect(actual).toEqual(expected)
  })

  test('failed/invalid_data', async () => {
    const actual = await load_actual_evaluation('books/failed/invalid_data')
    const expected = load_expected_evaluation('books/failed/invalid_data')
    expect(actual).toEqual(expected)
  })

  test('error/prologue_error', async () => {
    const actual = await load_actual_evaluation('books/error/prologue_error')
    const expected = load_expected_evaluation('books/error/prologue_error')
    expect(actual).toEqual(expected)
  })

  test('error/chapter_error', async () => {
    const actual = await load_actual_evaluation('books/error/chapter_error')
    const expected = load_expected_evaluation('books/error/chapter_error')
    expect(actual).toEqual(expected)
  })
})
