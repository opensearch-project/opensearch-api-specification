/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import { delete_matching_keys, sort_array_by_keys, to_json, to_ndjson } from '../src/helpers'

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

  describe('delete_matching_keys', () => {
    test('empty collection', () => {
      var obj = {}
      expect(delete_matching_keys(obj, (_obj) => false)).toEqual([])
      expect(obj).toEqual({})
    })

    describe('an object', () => {
      var obj: object

      beforeEach(() => {
        obj = {
          foo: {
            bar1: {
              x: 1
            }
          },
          zar: {
            bar2: {
              y: 2
            }
          }
        }
      })

      test('removes all keys', () => {
        expect(delete_matching_keys(obj, (_item) => true)).toEqual(['foo', 'zar'])
        expect(obj).toStrictEqual({})
      })

      test('removes no keys', () => {
        const obj2 = _.cloneDeep(obj)
        expect(delete_matching_keys(obj, (_item) => false)).toEqual([])
        expect(obj).toStrictEqual(obj2)
      })

      test('removes a value from a key', () => {
        expect(delete_matching_keys(obj, (_item: any) => _item.x == 1)).toEqual(['bar1'])
        expect(obj).toStrictEqual({ foo: {}, zar: { bar2: { y: 2 } } })
      })

      test('removes multiple values from a key', () => {
        expect(delete_matching_keys(obj, (_item: any) => _item.x == 1 || _item.y == 2)).toEqual(['bar1', 'bar2'])
        expect(obj).toStrictEqual({ foo: {}, zar: {} })
      })
    })

    describe('an object with arrays', () => {
      var obj: object

      beforeEach(() => {
        obj = {
          foo: [{
            bar1: {
              x: 1
            },
            bar2: {
              y: 2
            }
          }],
        }
      })

      test('removes all keys', () => {
        expect(delete_matching_keys(obj, (_item) => true)).toEqual(['foo'])
        expect(obj).toStrictEqual({})
      })

      test('removes no keys', () => {
        const obj2 = _.cloneDeep(obj)
        expect(delete_matching_keys(obj, (_item) => false)).toEqual([])
        expect(obj).toStrictEqual(obj2)
      })

      test('removes a value from a key', () => {
        expect(delete_matching_keys(obj, (_item: any) => _item.x == 1)).toEqual(['bar1'])
        expect(obj).toStrictEqual({ foo: [{ bar2: { y: 2 } }] })
      })

      test('removes multiple values from a key', () => {
        expect(delete_matching_keys(obj, (_item: any) => _item.x == 1 || _item.y == 2)).toEqual(['bar1', 'bar2'])
        expect(obj).toStrictEqual({ foo: [{}] })
      })
    })
  })
})
