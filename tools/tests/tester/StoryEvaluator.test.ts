/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { load_actual_evaluation, load_expected_evaluation } from './helpers'
import { read_yaml } from '../../helpers'
import { type OpenAPIV3 } from 'openapi-types'

describe('StoryEvaluator', () => {
  let spec: OpenAPIV3.Document

  beforeAll(() => {
    // The fallback password must match the default password specified in .github/opensearch-cluster/docker-compose.yml
    process.env.OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
    spec = read_yaml('tools/tests/tester/fixtures/specs/indices_excerpt.yaml')
  })

  test('passed', async () => {
    const actual = await load_actual_evaluation('passed', spec)
    const expected = await load_expected_evaluation('passed')
    expect(actual).toEqual(expected)
  })

  test('skipped', async () => {
    const actual = await load_actual_evaluation('skipped', spec)
    const expected = await load_expected_evaluation('skipped')
    expect(actual).toEqual(expected)
  })

  test('failed/not_found', async () => {
    const actual = await load_actual_evaluation('failed/not_found', spec)
    const expected = await load_expected_evaluation('failed/not_found')
    expect(actual).toEqual(expected)
  })

  test('failed/invalid_data', async () => {
    const actual = await load_actual_evaluation('failed/invalid_data', spec)
    const expected = await load_expected_evaluation('failed/invalid_data')
    expect(actual).toEqual(expected)
  })

  test('error/prologue_error', async () => {
    const actual = await load_actual_evaluation('error/prologue_error', spec)
    const expected = await load_expected_evaluation('error/prologue_error')
    expect(actual).toEqual(expected)
  })

  test('error/chapter_error', async () => {
    const actual = await load_actual_evaluation('error/chapter_error', spec)
    const expected = await load_expected_evaluation('error/chapter_error')
    expect(actual).toEqual(expected)
  })
})
