/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { sort_array_by_keys, to_json, to_ndjson } from '../src/helpers'

describe('helpers', () => {
  describe('sort_array_by_keys', () => {
    test('sorts arrays of string', () => {
      expect(sort_array_by_keys([])).toEqual([])
      expect(sort_array_by_keys(['GET', 'POST'], ['GET', 'POST'])).toEqual(['GET', 'POST'])
      expect(sort_array_by_keys(['GET', 'POST'], ['POST', 'GET'])).toEqual(['POST', 'GET'])
      expect(sort_array_by_keys(['GET', 'POST'], ['POST', 'GET', 'DELETE'])).toEqual(['POST', 'GET'])
      expect(sort_array_by_keys(['DELETE', 'POST', 'GET'], ['POST', 'GET', 'DELETE'])).toEqual(['POST', 'GET', 'DELETE'])
    })

    test('does not modify the original object', () => {
      const arr = ['GET', 'POST']
      expect(sort_array_by_keys(arr, ['POST', 'GET'])).toEqual(['POST', 'GET'])
      expect(arr).toEqual(['GET', 'POST'])
    })
  })

  test('to_json', () => {
    expect(to_json({})).toEqual("{}")
    expect(to_json({ x: 1 })).toEqual("{\n  \"x\": 1\n}")
  })

  test('to_ndjson', () => {
    expect(to_ndjson([])).toEqual("\n")
    expect(to_ndjson([{ x: 1 }])).toEqual("{\"x\":1}\n")
    expect(to_ndjson([{ x: 1 }, { y: 'z' }])).toEqual("{\"x\":1}\n{\"y\":\"z\"}\n")
  })
})
